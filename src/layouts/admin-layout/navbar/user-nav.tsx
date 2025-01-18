"use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { useEffect } from "react";

/// components

interface Props {
  walletAddress: string;
  handleDisconnect: () => void;
}

const UserNav = ({ walletAddress }: Props) => {
  // const { downGradePlan, user } = useAuth();
  // const capitalizeFirstLetter = (str: string): string => {
  //   return str.replace(/^\w/, (c) => c.toUpperCase());
  // };
  // const currentDate = new Date();

  // Calculate the difference in time (in milliseconds)
  // const differenceInTime = new Date(endDate).getTime() - currentDate.getTime();

  // Convert the difference from milliseconds to days
  // const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  // useEffect(() => {
  //   if (user?.subscription?.planName !== "free" && differenceInDays <= 0) {
  //     downGradePlan(user?.email as string);
  //   }
  // }, [differenceInDays, user?.email]);

  return (
    <div className="relative">
      <div className="flex h-8 flex-row items-center justify-center gap-4">
        <div className="flex flex-col">
          <p className="text-sm">{walletAddress}</p>
          {/* <p className="text-sm font-black text-blue-600">
            {user?.subscription?.planName === "free"
              ? `${capitalizeFirstLetter(level)}`
              : `${capitalizeFirstLetter(level)} (${differenceInDays.toString()} days left)`}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default UserNav;
