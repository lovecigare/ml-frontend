import { api } from "@/backend-apis/lib";
import { SocialLinks, WalletAuth } from "@/backend-apis/types";

import {
  AuthResponse,
  CreateResponse,
  LoginResponse,
  PutResponse
} from "./types";

const prefix = "/admin";

const auth = async () => {
  const res = await api.get<AuthResponse>(`${prefix}`);
  return res.data.contents;
};

const create = async (address: string, walletAuth: WalletAuth) => {
  const res = await api.post<CreateResponse>(`${prefix}`, {
    address,
    walletAuth
  });
  return res.data.contents;
};

const login = async (address: string) => {
  const res = await api.post<LoginResponse>(`${prefix}/login`, {
    address
  });

  return res.data.contents;
};

const put = async (
  data: Partial<{
    email: string;
    name: string;
    phoneNumber: string;
    socialLinks: SocialLinks;
  }>,
  walletAuth: WalletAuth
) => {
  const res = await api.put<PutResponse>(`${prefix}`, {
    ...data,
    walletAuth
  });
  return res.data.contents;
};

export { auth, create, login, put };
