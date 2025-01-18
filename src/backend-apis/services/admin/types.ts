import { SuccessResponse } from "@/backend-apis/lib";
import { Admin } from "@/backend-apis/types";

type AuthResponse = SuccessResponse<{ admin: Admin }>;
type LoginResponse = SuccessResponse<{ admin: Admin; accessToken: string }>;
type CreateResponse = AuthResponse;
type PutResponse = LoginResponse;

export type { AuthResponse, CreateResponse, LoginResponse, PutResponse };
