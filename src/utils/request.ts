import { ValidationError } from "@/utils/errors";

// 讀取 JSON 請求內容；不是合法 JSON 或不是物件時丟出 ValidationError（400）
export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError("請求內容不是合法的 JSON");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("請求內容必須是 JSON 物件");
  }

  return body as Record<string, unknown>;
}
