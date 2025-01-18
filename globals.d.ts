// globals.d.ts or index.d.ts
import { PublicKey } from '@solana/web3.js';

declare global {
    interface Window {
        solana: {
            isPhantom?: boolean; // Indicates if the wallet is Phantom
            isConnected: boolean; // Indicates if the wallet is connected
            publicKey: PublicKey; // The public key of the connected wallet
            connect: () => Promise<void>; // Method to connect the wallet
            disconnect: () => Promise<void>; // Method to disconnect the wallet
            signTransaction: (transaction: any) => Promise<any>; // Method to sign a transaction
            signMessage: (message: Uint8Array) => Promise<{ signature: string; publicKey: PublicKey }>; // Method to sign a message
        };
    }
}
