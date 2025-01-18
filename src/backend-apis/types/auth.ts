import type { SignedMessage } from "lucid-cardano";

type WalletAuth = {
  payload: string;
  signedMessage: SignedMessage;
};

export type { WalletAuth };
