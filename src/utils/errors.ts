// 可預期的業務錯誤，帶有對應的 HTTP 狀態碼，由 withApiHandler 統一轉成回應
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends ApiError {
  constructor(message = "資料格式錯誤") {
    super(message, 400);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "沒有權限執行此操作") {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "找不到資料") {
    super(message, 404);
  }
}
