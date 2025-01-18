"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Network, WalletApi } from "lucid-cardano";

import { WalletAuth } from "@/backend-apis/types/auth";
import { wallet as walletConstants } from "@/constants";
import useSnackbar from "@/hooks/use-snackbar";
import {
  canConnect,
  convertAddressToBech32,
  getNetworkFromId
} from "@/utils/wallet";

type WalletContext = {
  isConnected: boolean;
  wallet: WalletApi | undefined;
  walletKey: string;
  address: string;
  stakeAddress: string;
  networkId: number;
  network: Network | "";
  assets: Record<string, string>;
  connect: (walletKey: string) => Promise<string>;
  disconnect: () => void;
  getWalletAuth: (payload?: string) => Promise<WalletAuth>;
};

const walletContext = createContext<WalletContext>({
  isConnected: false,
  wallet: undefined,
  walletKey: "",
  address: "",
  stakeAddress: "",
  networkId: -1,
  network: "",
  assets: {},
  connect: async () => {
    return "";
  },
  disconnect: () => {},
  getWalletAuth: async () => {
    throw new Error("Not Yet");
  }
});

interface Props {
  children: React.ReactNode;
}
const WalletContextProvider = ({ children }: Props) => {
  const snackbar = useSnackbar();

  const [wallet, setWallet] = useState<WalletApi | undefined>(undefined);
  const [walletKey, setWalletKey] = useState<string>("");
  const [address, setAddress] = useState("");
  const [stakeAddress, setStakeAddress] = useState("");
  const [networkId, setNetworkId] = useState(-1);
  const [network, setNetwork] = useState<Network | "">("");
  const [assets, setAssets] = useState<Record<string, string>>({});

  const onWalletChanged = async () => {
    try {
      if (!wallet) return;
      const [nId, changeAddr, stakeAddrs] = await Promise.all([
        wallet.getNetworkId(),
        wallet.getChangeAddress(),
        wallet.getRewardAddresses()
      ]);

      setNetworkId(nId);
      setNetwork(getNetworkFromId(nId));
      setAddress(await convertAddressToBech32(changeAddr));
      if (stakeAddrs.length > 0)
        setStakeAddress(await convertAddressToBech32(stakeAddrs[0]));
    } catch (err) {
      console.error(err);
      snackbar.snackbarError("Wallet has an issue");
    }
  };

  useEffect(() => {
    onWalletChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // methods
  const connect = async (walletKey: string) => {
    try {
      const foundWallet = walletConstants.supportedWallets.find(
        (e) => e.key == walletKey
      );

      // check supported
      if (!foundWallet) {
        throw new Error("This wallet is not supported.");
      }

      // check installed
      if (canConnect(foundWallet.key)) {
        const connectedWallet = await window.cardano[walletKey].enable();
        const connectedAddress = convertAddressToBech32(
          await connectedWallet.getChangeAddress()
        );
        setWallet(connectedWallet);
        setWalletKey(walletKey);
        window.localStorage.setItem(
          walletConstants.savedWalletSelectionKey,
          walletKey
        );
        return connectedAddress;
      } else {
        throw new Error("This Wallet extension not installed.");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getWalletAuth = async (
    payload: string = "Verify with Yieldlab"
  ): Promise<WalletAuth> => {
    const { fromText } = await import("lucid-cardano");
    if (!wallet || !address) throw new Error("Connect Wallet First");
    const hexPayload = fromText(payload);
    const result = await wallet.signData(address, hexPayload);
    return {
      payload: payload,
      signedMessage: result
    };
  };

  const disconnect = () => {
    setWallet(undefined);
    setWalletKey("");
    setAddress("");
    setStakeAddress("");
    setNetworkId(-1);
    setNetwork("");
    setAssets({});
    window.localStorage.removeItem(walletConstants.savedWalletSelectionKey);
  };

  const init = () => {
    // restore saved connected wallet.
    const savedConnectedWalletKey =
      window.localStorage.getItem(walletConstants.savedWalletSelectionKey) ||
      "";
    if (savedConnectedWalletKey?.length > 0) {
      setWalletKey(savedConnectedWalletKey);
      connect(savedConnectedWalletKey).catch((err) => {
        console.error(err);
        disconnect();
      });
    }
  };

  useEffect(() => {
    init();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: WalletContext = {
    isConnected: wallet ? true : false,
    wallet,
    walletKey,
    address,
    stakeAddress,
    networkId,
    network,
    assets,
    connect,
    disconnect,
    getWalletAuth
  };

  return (
    <walletContext.Provider value={value}>{children}</walletContext.Provider>
  );
};

const useWallet = () => {
  return useContext(walletContext);
};

export { useWallet, WalletContextProvider };
