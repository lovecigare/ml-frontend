"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { auth, login } from "@/backend-apis/index";
import { Admin } from "@/backend-apis/types";
import { removeBearerToken, setBearerToken } from "@/helpers";

type AuthContext = {
  admin?: Admin;
  setAdmin: (admin: Admin | undefined) => void;
  signIn: (address: string) => Promise<void>;
  signOut: () => void;
  fetchMe: () => Promise<void>;
};

const authContext = createContext<AuthContext>({
  setAdmin: () => {},
  signIn: async () => {},
  signOut: () => {},
  fetchMe: async () => {}
});

// const protectedRoutes = ["", "/", "/project", "/account"];
// const authRoutes = ["/login"];

export const AuthContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | undefined>(undefined);

  const signIn = async (address: string) => {
    const res = await login(address);
    console.log("res", res);
    setAdmin(res.admin);
    setBearerToken(res.accessToken);
    setTimeout(() => router.push("/"), 0);
  };

  const signOut = () => {
    setAdmin(undefined);
    removeBearerToken();
    setTimeout(() => router.push("/login"), 0);
  };

  const fetchMe = async () => {
    const res = await auth();
    setAdmin(res.admin);
  };

  const checkAuth = async () => {
    // try {
    //   const isProtected = protectedRoutes.some((item) =>
    //     pathname.startsWith(item)
    //   );
    //   const isAuth = authRoutes.some((item) => pathname.startsWith(item));
    //   if (!isAuth && !isProtected) return;

    //   const token = getBearerToken();
    //   console.log("isAuth", isAuth);
    //   if (isAuth) {
    //     if (token) router.push("/");
    //     return;
    //   }

    //   // if (!token) return signOut();

    //   await fetchMe();
    // } catch (err) {
    //   console.error(err);
    //   router.push("/login");
    // }
  };

  useEffect(() => {
    if (pathname) checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const value: AuthContext = {
    admin,
    setAdmin,
    fetchMe,
    signIn,
    signOut
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};
