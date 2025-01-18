import { AxiosError } from "axios";

const parseApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.status == 401)
      return (
        error.response?.data?.contents?.errors?.[0]?.message ||
        error.response?.data?.error ||
        "Unauthorized"
      );
    return (
      error.response?.data?.contents?.errors?.[0]?.message ||
      error.response?.data?.error ||
      "Failed"
    );
  } else if (error instanceof Error) return error.message || "Failed";
  return "Failed";
};

const parseError = (error: unknown): string => {
  if (error instanceof Error) return error.message || "Failed";
  return String(error) || "Failed";
};

export { parseApiError, parseError };
