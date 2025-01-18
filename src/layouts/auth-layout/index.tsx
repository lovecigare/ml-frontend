"use client";

import React from "react";
import { useIsClient } from "usehooks-ts";

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const isClient = useIsClient();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e5dcff66] dark:bg-[#12181f]">
      {isClient && (
        <div className="mx-auto min-h-[60vh] w-full max-w-[400px] justify-center rounded-xl bg-[#F9FAFD] px-3 py-5 dark:bg-[#161d27] sm:max-w-[400px] sm:px-4 sm:py-7">
          {children}
        </div>
      )}
    </main>
  );
};

export default AuthLayout;
