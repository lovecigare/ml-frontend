interface Response {
  code: number;
}

interface SuccessResponse<T> extends Response {
  contents: T;
}

interface ErrorResponse extends Response {
  errors: { code: string; message: string }[];
}

export type { ErrorResponse, SuccessResponse };
