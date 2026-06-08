"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { addCommentAction, AddCommentState } from "@/app/actions/comment";
import useQueryComments from "@/hooks/use-query-comments";

interface CommentsSectionProps {
  postId: string;
  session: Session | null;
}

const initialState: AddCommentState = {};

export const CommentsSection = ({ postId, session }: CommentsSectionProps) => {
  const [commentContent, setCommentContent] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    addCommentAction,
    initialState,
  );

  // Query Comments (暫時保留 useQuery，等後續重構留言列表)
  const { data: comments = [], isLoading, error } = useQueryComments(postId);

  // 成功後清空輸入框並刷新頁面
  useEffect(() => {
    if (state.success) {
      setCommentContent("");
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.success, router]);

  const isLoggedIn = !!session?.user;

  return (
    <div className="w-full mt-10 pt-10 border-t border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-white">留言區</h2>
        <span className="bg-white/10 text-white/80 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-white/5">
          {comments.length}
        </span>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {isLoading && (
          <div className="py-8 text-center text-white/30 text-sm flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white/85 rounded-full animate-spin" />
            <span>載入留言中...</span>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-400 text-sm">
            留言載入失敗，請稍後再試
          </div>
        )}

        {!isLoading && !error && comments.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">
            <p className="font-semibold text-white/40">目前還沒有留言</p>
            <p className="text-xs mt-1 text-white/20">
              成為第一個留言的人吧
            </p>
          </div>
        )}

        {!isLoading && !error && comments.length > 0 && (
          <div className="divide-y divide-white/5">
            {comments.map((comment: Comment) => (
              <div
                key={comment.id}
                className="hover:bg-white/[0.02] p-4 transition-all duration-300 group relative"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 via-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0 select-none">
                    {comment.author?.name?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-xs">
                        {comment.author?.name}
                      </p>
                      <p className="text-white/30 text-[10px]">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-white/80 text-sm mt-1.5 whitespace-pre-wrap leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoggedIn ? (
          <form
            ref={formRef}
            action={formAction}
            className="p-4 bg-white/[0.01] hover:bg-white/[0.02] focus-within:bg-white/[0.03] transition-all duration-300"
          >
            {/* 把 postId 藏在表單裡，Server Action 才能讀到 */}
            <input type="hidden" name="postId" value={postId} />

            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 select-none">
                {session.user?.name?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <textarea
                  name="content"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="輸入你的留言..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none min-h-[80px] leading-relaxed pt-1"
                />

                {state.error && (
                  <p className="text-red-400 text-xs mt-1">{state.error}</p>
                )}

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30">
                    以{" "}
                    <span className="text-white/60 font-medium">
                      {session.user?.name}
                    </span>{" "}
                    留言
                  </span>
                  <button
                    type="submit"
                    disabled={isPending || !commentContent.trim()}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 disabled:cursor-not-allowed rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    {isPending ? "送出中..." : "送出留言"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            onClick={() => router.push("/login")}
            className="p-4 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all duration-300 group"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white/40 font-bold text-sm shadow-md flex-shrink-0 select-none">
                ?
              </div>

              <div className="flex-1">
                <textarea
                  readOnly
                  placeholder="登入後即可留言..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none min-h-[80px] leading-relaxed pt-1 cursor-pointer"
                />

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-white/30 group-hover:text-white/50 transition">
                    先登入再開始留言
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    登入
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
