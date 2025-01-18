"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { LogOut, LucideIcon, Settings, Unplug } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/// components
// import ThemeToggle from "@/components/themes/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import WalletConnection from "@/components/wallet-connect";
// import { useAuth } from "@/contexts/AuthContext";
// import UserDetailsToggle from "@/layouts/support-layout/navbar/user-details-toggle";

// import useToast from "@/hooks/use-toaster";
import { getMenuList } from "@/lib/menu-list";
import { usePathname } from "next/navigation";
import SheetMenu from "./sheet-menu";
// import SubscriptionDialog from "./subscription-dialog";
import UserNav from "./user-nav";
import UserDetailsToggle from "./user-details-toggle";

interface NavbarProps {
  title?: string;
}

const Navbar = ({ title }: NavbarProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [okxWallet, setOkxWallet] = useState<string | null>(null);

  const { publicKey, disconnect } = useWallet();
  // const { logout, user, connectWallet } = useAuth();
  // const { toast } = useToast();

  // useEffect(() => {
  //   if (
  //     (publicKey && !user?.walletAddress) ||
  //     (publicKey && user?.walletAddress === "")
  //   ) {
  //     connectWallet(user?.email as string, publicKey.toBase58());
  //     window.location.reload();
  //   }
  // }, [publicKey, user?.walletAddress, connectWallet, user?.email]);

  const handleDisconnect = async () => {
    const okxConnect = localStorage.getItem("okx");
    console.log('okxConnected', okxConnect)
    if (okxConnect) {
      await window.okxwallet?.solana.disconnect()
      localStorage.removeItem("okx")
      setIsOpen(false)
    } 
      disconnect();
      // toast("Successed!", "Successfully disconnected wallet", "success");
      setIsOpen(false);
  };

  const handleLogout = () => {
    // logout();
  };

  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const menu = menuList.find((m) => m.menus[0].label === title);
  const MenuIcon = menu?.menus[0].icon as LucideIcon;

  // Function to handle changes in local storage
  const okxwallet = localStorage.getItem("okx")
  // Set up an interval to check for changes
  useEffect(() => {
    setOkxWallet(localStorage.getItem("okx"));
  }, [okxwallet]);
  const connectedWalletAddress = publicKey
    ? publicKey.toString()
    : okxWallet
      ? okxWallet
      : undefined;
  console.log("connectedWalletAddress", connectedWalletAddress);
  // console.log("user?.subscription.planType", user?.subscription.planType);

  return (
    <header className="sticky top-0 z-10 w-full border-b border-neutral-700 bg-background/9 dark:shadow-secondary dark:supports-[backdrop-filter]:bg-neutral-1000">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <div className="flex flex-row gap-2">
            {MenuIcon && <MenuIcon />}
            <h1 className="hidden font-bold md:block">{title}</h1>
          </div>
        </div>
        <div className="relative flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:block">
            {/* {connectedWalletAddress && (
              <span className="text-muted-foreground">
                {connectedWalletAddress.toString().slice(0, 5) +
                  " ... " +
                  connectedWalletAddress.toString().slice(-5)}
              </span>
            )} */}
            {/* {connectedWalletAddress &&
              user?.subscription.planName === "free" &&
              user?.subscription.planType !== "downed" && (
                <SubscriptionDialog />
              )} */}
          </div>
          {/* <div className="hidden md:flex">
            <ThemeToggle />
          </div> */}
          {/* <WalletConnection /> */}
          {isOpen && (
            <div className="absolute top-[50px] flex w-56 flex-col gap-2 rounded-md bg-zinc-200 px-5 py-4 shadow shadow-neutrals-500 dark:bg-neutral-900">
              {/* <div className="md:hidden">
                {user?.subscription.planName === "free" &&
                  user?.subscription.planType !== "downed" && (
                    <SubscriptionDialog />
                  )}
              </div> */}

              {/* <div className="flex items-center justify-center hover:cursor-pointer md:hidden">
                <ThemeToggle />
              </div> */}
              {/* <DropdownMenuSeparator className="md:hidden" /> */}
              <div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {/* {user?.userName} */}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {/* {user?.email} */}
                  </p>
                  {connectedWalletAddress && (
                    <span className="text-[12px] text-muted-foreground sm:hidden">
                      {connectedWalletAddress.toString().slice(0, 10) +
                        " ... " +
                        connectedWalletAddress.toString().slice(-10)}
                    </span>
                  )}
                </div>
              </div>

              {/* <DropdownMenuSeparator />
              
              <div>
                <div className="flex flex-row items-center hover:cursor-pointer">
                  <CircleUserRound
                    className="mr-3 h-4 w-4 text-muted-foreground"
                    size={20}
                  />
                  Account
                </div>
              </div> */}
              <DropdownMenuSeparator />
              <div className="hover:cursor-pointer">
                <Link
                  href="/user-profile"
                  className="flex flex-row items-center"
                >
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  Profile Settings
                </Link>
              </div>
              <DropdownMenuSeparator />
              {connectedWalletAddress && (
                <>
                  <div
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={handleDisconnect}
                  >
                    <Unplug className="mr-3 h-4 w-4 text-muted-foreground" />
                    Disconnect
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <div
                className="flex flex-row items-center hover:cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                Sign out
              </div>
            </div>
          )}

          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            {/* <AvatarImage src={user?.profilePicture as string} /> */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {!connectedWalletAddress ? (
            <WalletConnection />
          ) : (
            <UserNav
              // userName={user?.userName || undefined}
              walletAddress={
                connectedWalletAddress.toString().slice(0, 5) +
                " ... " +
                connectedWalletAddress.toString().slice(-5)
              }
              // level={user?.subscription.planName as string}
              // endDate={user?.subscription.endTime as Date}
              handleDisconnect={handleDisconnect}
            />
          )}

          <UserDetailsToggle
            isOpen={isOpen}
            setIsOpen={() => setIsOpen(!isOpen)}
          />
          {/* <DexScoutConnectWalletModal /> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
