"use client";

import React from "react";
import Image from "next/image";

import { parseError } from "@/backend-apis/lib";
import { supportedWallets } from "@/constants/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import useSnackbar from "@/hooks/use-snackbar";

const LoginForm = () => {
  const snackbar = useSnackbar();
  const { connect } = useWallet();
  const { signIn } = useAuth();

  const onConnectWalletAndSignIn = async (walletKey: string) => {
    try {
      const connectedAddress = await connect(walletKey);
      await signIn(connectedAddress);
    } catch (err) {
      console.error(err);
      snackbar.snackbarError(parseError(err));
    }
  };

  return (
    <>
      {supportedWallets.map((item) => (
        <button
          className="bg-info h-full w-full p-0"
          onClick={() => onConnectWalletAndSignIn(item.key)}
          key={item.key}
        >
          <div className="flex w-full flex-row items-center justify-center gap-2 rounded-[10px] border border-[#d9d9d9] py-2">
            <Image
              src={item.icon}
              className="rounded-full"
              alt={`${item.name} icon`}
              width={48}
              height={48}
            />
            <p
              className={`text-primary-dark w-[65%] text-sm font-light dark:text-[#f2f4f6]`}
            >
              Connect {item.name} Wallet
            </p>
          </div>
        </button>
      ))}
    </>
  );
};

export default LoginForm;
