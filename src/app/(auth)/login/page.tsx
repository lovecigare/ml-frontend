import React from "react";
import { Metadata } from "next";
import Image from "next/image";

import LoginForm from "./form";

export const metadata: Metadata = {
  title: "Log In to Yieldlab",
  description: "Yieldlab | Log In with wallet"
};

const LoginPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-evenly gap-8 px-8 py-16 text-center">
      <div className="flex items-center justify-center space-x-2">
        <Image
          alt="logo"
          src="assets/icon/logo_with_title.svg"
          width={180}
          height={60}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 space-y-1">
        <p className="text-primary-dark text-base font-black dark:text-[#f2f4f6]">
          Connect Wallet
        </p>
        <p className="text-primary-dark text-sm font-normal dark:text-[#f2f4f6]">
          Connect your wallet to access YieldLab
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
