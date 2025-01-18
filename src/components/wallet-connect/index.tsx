"use client";

import { useEffect, useState } from "react";
import { WalletName } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
// import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import { Button } from "../ui/button";

import { availableWallets } from "./search-element/constant";
import SearchInput from "./search-element/search-input";
import WalletButton from "./wallet-button";
//handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const WalletConnection = () => {
  const [connectedWalletName, setConnectedWalletName] = useLocalStorage<string>(
    "connectedWalletName",
    ""
  );
  console.log("connectedWalletName", connectedWalletName);
  const { connection } = useConnection();
  const { select, publicKey, disconnect, connecting, wallets } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  console.log("userWalletAddress", userWalletAddress);
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const { toast } = useToast();
  const filteredItems = availableWallets.filter((item) =>
    item.value.toLowerCase().includes(query)
  );

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info?.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    if (publicKey) {
      setUserWalletAddress(publicKey.toBase58());
    } else {
      setUserWalletAddress(""); // or handle the null case as needed
    }
  }, [publicKey]);

  const handleWalletSelect = async (walletName: string) => {
    setConnectedWalletName(walletName);
    console.log("walletName", walletName.toLowerCase());
    // console.log('window.solana', window.solflare)
    console.log("wallets", wallets);
    if (walletName === "Phantom") {
      try {
        const wallet = window.solana;
        if (wallet && wallet.isPhantom) {
          select(walletName as WalletName);
          setOpen(false);
          toast({
            variant: "default",
            title: "Wallet Connected",
            description: `Connected ${walletName}`,
            duration: 1000
          });
        } else {
          const walletUrl = getWalletUrl(walletName);
          window.open(walletUrl, "_blank");
        }
      } catch (error) {
        console.log("wallet connection err : ", error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect wallet. Please try again.",
          duration: 3000
        });
      }
    } else if (walletName === "Solflare") {
      const solflareWallet = wallets.find(
        (wallet) => wallet.adapter.name === "Solflare"
      );
      if (solflareWallet) {
        select(walletName as WalletName);
        setOpen(false);
        toast({
          variant: "default",
          title: "Wallet Connected",
          description: `Connected ${walletName}`,
          duration: 1000
        });
      } else {
        const walletUrl = getWalletUrl(walletName);
        window.open(walletUrl, "_blank");
      }
    } else {
      if (window.okxwallet) {
        try {
          const provider = window.okxwallet.solana;
          const accounts = await provider.connect();
          console.log(
            "Connected OKX Wallet:",
            new PublicKey(accounts.publicKey).toBase58()
          );
          localStorage.setItem(
            "okx",
            new PublicKey(accounts.publicKey).toBase58()
          );
          setOpen(false);
          window.location.reload(); // Return the public key of the connected account
        } catch (error) {
          console.error("Failed to connect OKX Wallet:", error);
        }
      } else {
        const walletUrl = getWalletUrl(walletName);
        window.open(walletUrl, "_blank");
      }
    }
  };

  const getWalletUrl = (walletName: string): string => {
    switch (walletName.toLowerCase()) {
      case "phantom":
        return "https://phantom.app/";
      case "solflare":
        return "https://solflare.com/";
      case "okx wallet":
        return "https://www.okx.com/download";
      // Add more cases for other wallets as needed
      default:
        return "https://solana.com/ecosystem/wallets";
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          {!publicKey ? (
            <>
              <DialogTrigger asChild>
                <button className="flex h-[40px] w-[154px] items-center justify-center rounded-full bg-blue-900">
                  <span className="text-[14px] font-bold text-whites-basic">
                    {connecting ? "connecting..." : "Connect Wallet"}
                  </span>
                </button>
              </DialogTrigger>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="font-slackey z-50 flex h-[40px] gap-2 border-2 border-white bg-black text-[20px] text-white ring-2 ring-black md:h-[60px] md:text-[30px]">
                  <div className="">
                    <div className="w-[100px] truncate md:w-[150px]">
                      {publicKey.toBase58()}
                    </div>
                  </div>
                  {balance ? (
                    <div>{toFixed(balance, 2)} SOL</div>
                  ) : (
                    <div>0 SOL</div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] bg-black hover:bg-black">
                <DropdownMenuItem className="flex justify-center">
                  <Button
                    className="font-slackey z-50 border-2 border-white bg-[#ff5555] text-[20px] text-white"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DialogContent className="w-[95%] dark:bg-neutral-900 sm:w-[652px]">
            <DialogHeader>
              <DialogTitle>
                <span className="text-[24px] font-bold">{`Connect Your Wallet`}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6 pb-3 pt-4">
              <div className="flex items-center rounded-lg bg-neutral-300 px-8 py-3 dark:bg-neutral-800">
                <p className="text-[13px]">
                  By connecting your wallet, you acknowledge that you have read,
                  understand and accept our terms
                  {/* <span className="cursor-pointer text-blues-700 dark:text-blues-300">
                    disclaimer
                  </span> */}
                </p>
              </div>
              <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col">
                  <SearchInput />
                </div>
                <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex w-full flex-col gap-4 sm:w-[50%]">
                    {filteredItems
                      .slice(0, Math.ceil(filteredItems.length / 2))
                      .map((wallet, index) => (
                        <WalletButton
                          key={index}
                          walletName={wallet.name}
                          imageUrl={wallet.imgUrl}
                          handleConnect={() => handleWalletSelect(wallet.name)}
                        />
                      ))}
                  </div>
                  <div className="flex w-full flex-col gap-4 sm:w-[50%]">
                    {filteredItems
                      .slice(Math.ceil(filteredItems.length / 2))
                      .map((wallet, index) => (
                        <WalletButton
                          key={index}
                          walletName={wallet.name}
                          imageUrl={wallet.imgUrl}
                          handleConnect={() => handleWalletSelect(wallet.name)}
                        />
                      ))}
                  </div>
                </div>
                {/* <div className="flex flex-row items-center justify-between px-3">
                  <div className="flex flex-row items-center justify-around gap-2">
                    <AlertCircle size={16} />
                    <span className="text-[14px] font-light dark:text-whites-basic">{`New to Dexscout?`}</span>
                  </div>
                  <u className="cursor-pointer text-[14px] font-semibold dark:text-neutrals-100">{`Get Started`}</u>
                </div> */}
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;
