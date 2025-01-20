import {
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID
  } from "@solana/spl-token";
  import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction
  } from "@solana/web3.js";
  
  interface OkxWallet {
    solana: {
      isConnected: () => Promise<boolean>;
      connect: () => Promise<{ publicKey: string }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      publicKey: string; // Add this line to include publicKey
    };
  }
  
  // Extend the Window interface
  declare global {
    interface Window {
      okxwallet?: OkxWallet;
    }
  }
  
  export const sendSolanaTransaction = async (
    toAddress: string,
    amount: number
  ) => {
    if (!window.solana || !window.solana.isConnected) {
      return;
    }
  
    const connection = new Connection(
      process.env.RPC_URL || "https://solana-rpc.publicnode.com",
      "confirmed"
    );
  
    // Request the user's wallet to connect
    await window.solana.connect();
  
    const fromPublicKey = new PublicKey(window.solana.publicKey);
    const toPublicKey = new PublicKey(toAddress);
  
    const maxRetries = 3;
  
    // Check the balance of the sender's account
    const senderBalance = await connection.getBalance(fromPublicKey);
    const requiredBalance = amount * 1e9; // Convert SOL to lamports
    const transactionFee = 5000; // Estimated transaction fee in lamports (adjust as necessary)
  
    if (senderBalance < requiredBalance + transactionFee) {
      console.error(
        "Sender's account does not have enough SOL to cover the transaction and fees."
      );
      throw new Error("Insufficient balance to cover transaction and fees.");
    }
  
    // Check the balance of the recipient's account
    const recipientBalance = await connection.getBalance(toPublicKey);
  
    if (recipientBalance < requiredBalance) {
      console.log(
        "Recipient's account does not have enough SOL to cover the transaction."
      );
  
      // Optionally fund the recipient's account with a small amount of SOL
      const fundingAmount = 0.001; // Amount to fund in SOL
      const fundingLamports = fundingAmount * 1e9; // Convert to lamports
  
      // Create a transaction to fund the recipient's account
      const fundingTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: fundingLamports
        })
      );
  
      // Set the fee payer and get a fresh blockhash
      fundingTransaction.feePayer = fromPublicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      fundingTransaction.recentBlockhash = blockhash;
  
      // Sign and send the funding transaction
      const signedFundingTransaction =
        await window.solana.signTransaction(fundingTransaction);
      const fundingSignature = await connection.sendRawTransaction(
        signedFundingTransaction.serialize(),
        { maxRetries: 5 }
      );
  
      console.log("Funding transaction sent with signature:", fundingSignature);
  
      // Wait for confirmation of the funding transaction
      try {
        await connection.confirmTransaction(fundingSignature);
        console.log("Recipient's account funded successfully.");
      } catch (error) {
        console.error("Error confirming funding transaction:", error);
        // Handle the error as needed, e.g., log it or notify the user
      }
    }
  
    // Proceed with the main transaction
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Create a transaction
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: requiredBalance // Use the required balance
          })
        );
  
        // Set the fee payer and get a fresh blockhash
        transaction.feePayer = fromPublicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
  
        // Sign and send the transaction
        const signedTransaction =
          await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          { maxRetries: 5 }
        );
  
        console.log("Transaction sent with signature:", signature);
  
        // Wait for confirmation using getSignatureStatus
        let status;
        let retries = 0;
        const maxStatusRetries = 5;
        const statusRetryInterval = 2000; // 2 seconds
  
        while (retries < maxStatusRetries) {
          status = await connection.getSignatureStatus(signature);
          console.log("Transaction status:", status);
  
          if (status.value !== null) {
            if (status.value.err) {
              throw new Error("Transaction failed");
            } else if (
              status.value.confirmationStatus === "confirmed" ||
              status.value.confirmationStatus === "finalized"
            ) {
              console.log("Transaction successful with signature:", signature);
              const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;
              console.log("Transaction link:", transactionLink);
              return { signature, transactionLink };
            }
          }
  
          retries++;
          if (retries < maxStatusRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, statusRetryInterval)
            );
          }
        }
  
        throw new Error("Transaction confirmation timeout");
      } catch (error) {
        console.error(`Transaction attempt ${attempt + 1} failed:`, error);
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Wait for a short time before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };
  
  export const sendUSDCTransaction = async (
    toAddress: string,
    usdcMintAddress: string,
    amount: number
  ) => {
    if (!window.solana || !window.solana.isConnected) {
      return;
    }
  
    const connection = new Connection(
      process.env.RPC_URL || "https://solana-rpc.publicnode.com",
      "confirmed"
    );
    const amountInLamports = amount * 1e6; // 1 USDC (USDC has 6 decimal places)
  
    // Request the user's wallet to connect
    await window.solana.connect();
  
    const fromPublicKey = new PublicKey(window.solana.publicKey);
    const toPublicKey = new PublicKey(toAddress);
  
    const maxRetries = 3;
  
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Get the associated token accounts
        const fromTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(usdcMintAddress),
          fromPublicKey
        );
        console.log("fromTokenAccount", fromTokenAccount.toBase58());
  
        const toTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(usdcMintAddress),
          toPublicKey
        );
        console.log("toTokenAccount", toTokenAccount.toBase58());
  
        // Check if the recipient's token account is initialized
        const accountInfo = await connection.getAccountInfo(toTokenAccount);
        if (!accountInfo) {
          console.log(
            "Recipient's token account is not initialized. Creating it..."
          );
  
          // Create the associated token account for the recipient
          const transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              fromPublicKey, // payer
              toTokenAccount, // new account
              toPublicKey, // owner
              new PublicKey(usdcMintAddress) // mint
            )
          );
  
          // Set the fee payer and get a fresh blockhash
          transaction.feePayer = fromPublicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
  
          // Sign and send the transaction to create the token account
          const signedTransaction =
            await window.solana.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize(),
            { maxRetries: 5 }
          );
  
          console.log(
            "Token account creation transaction sent with signature:",
            signature
          );
  
          // Wait for confirmation
          await connection.confirmTransaction(signature);
          console.log("Token account created successfully.");
        }
  
        // Create a transaction to transfer USDC
        const transaction = new Transaction().add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromPublicKey,
            amountInLamports,
            [],
            TOKEN_PROGRAM_ID
          )
        );
  
        // Set the fee payer and get a fresh blockhash
        transaction.feePayer = fromPublicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
  
        // Sign and send the transaction
        const signedTransaction =
          await window.solana.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          { maxRetries: 5 }
        );
  
        console.log("Transaction sent with signature:", signature);
  
        // Wait for confirmation using getSignatureStatus
        let status;
        let retries = 0;
        const maxStatusRetries = 5;
        const statusRetryInterval = 10000; // 2 seconds
  
        while (retries < maxStatusRetries) {
          status = await connection.getSignatureStatus(signature);
          console.log("Transaction status:", status);
  
          if (status.value !== null) {
            if (status.value.err) {
              throw new Error("Transaction failed");
            } else if (
              status.value.confirmationStatus === "confirmed" ||
              status.value.confirmationStatus === "finalized"
            ) {
              console.log(
                "USDC Transaction successful with signature:",
                signature
              );
              const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;
              console.log("USDC Transaction link:", transactionLink);
              return { signature, transactionLink };
            }
          }
  
          retries++;
          if (retries < maxStatusRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, statusRetryInterval)
            );
          }
        }
  
        throw new Error("Transaction confirmation timeout");
      } catch (error) {
        console.error(`USDC Transaction attempt ${attempt + 1} failed:`, error);
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Wait for a short time before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };
  
  export const sendSol = async (
    sender: string,
    recipient: string,
    amount: number
  ) => {
    if (typeof window !== "undefined" && window.okxwallet) {
      try {
        const provider = window.okxwallet.solana;
  
        // Log the provider to check its structure
        console.log("Provider:", provider);
  
        const connection = new Connection(
          process.env.RPC_URL || "https://solana-rpc.publicnode.com",
          "confirmed"
        );
  
        // Create transaction to send SOL
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(sender), // Use the retrieved public key
            toPubkey: new PublicKey(recipient),
            lamports: amount * 1e9 // Convert SOL to lamports
          })
        );
  
        // Set the fee payer and get a fresh blockhash
        transaction.feePayer = new PublicKey(sender);
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash; // Set the recent blockhash
  
        const signedTransaction = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
  
        // Retry confirmation if it fails initially
        const maxRetries = 3;
        let confirmed = false;
  
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            await connection.confirmTransaction(signature, "confirmed");
            confirmed = true;
            break; // Exit loop if confirmation is successful
          } catch (error) {
            console.error(`Confirmation attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) {
              throw error; // Rethrow error if max retries reached
            }
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
  
        if (confirmed) {
          console.log("SOL Transaction successful with signature:", signature);
          const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;
          console.log("USDC Transaction link:", transactionLink);
          return { signature, transactionLink }; // Return true on success
        } else {
          console.error("SOL Transaction confirmation failed after retries.");
        }
      } catch (error) {
        console.error("SOL Transaction failed:", error);
      }
    } else {
      console.error("OKX Wallet not found");
    }
  };
  
  export const sendUsdc = async (
    sender: string,
    recipient: string,
    amount: number,
    usdcMintAddress: string
  ) => {
    // Change return type to boolean
    if (typeof window !== "undefined" && window.okxwallet) {
      try {
        const provider = window.okxwallet.solana;
  
        const connection = new Connection(
          process.env.RPC_URL || "https://solana-rpc.publicnode.com",
          "confirmed"
        );
  
        const amountInLamports = amount * 1e6; // 1 USDC (USDC has 6 decimal places)
  
        // Request the user's wallet to connect
        await provider.connect();
  
        const fromPublicKey = new PublicKey(sender);
        const toPublicKey = new PublicKey(recipient);
  
        const fromTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(usdcMintAddress),
          fromPublicKey
        );
  
        const toTokenAccount = await getAssociatedTokenAddress(
          new PublicKey(usdcMintAddress),
          toPublicKey
        );
  
        // Check if the recipient's token account is initialized
        const accountInfo = await connection.getAccountInfo(toTokenAccount);
        if (!accountInfo) {
          console.log(
            "Recipient's token account is not initialized. Creating it..."
          );
  
          // Create the associated token account for the recipient
          const transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              fromPublicKey, // payer
              toTokenAccount, // new account
              toPublicKey, // owner
              new PublicKey(usdcMintAddress) // mint
            )
          );
  
          // Set the fee payer and get a fresh blockhash
          transaction.feePayer = fromPublicKey;
          const { blockhash } = await connection.getLatestBlockhash();
          transaction.recentBlockhash = blockhash;
  
          // Sign and send the transaction to create the token account
          const signedTransaction = await provider.signTransaction(transaction);
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize(),
            { maxRetries: 5 }
          );
  
          console.log(
            "Token account creation transaction sent with signature:",
            signature
          );
  
          // Wait for confirmation
          await connection.confirmTransaction(signature);
          console.log("Token account created successfully.");
        }
  
        // Create a transaction to transfer USDC
        const transaction = new Transaction().add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            fromPublicKey,
            amountInLamports,
            [],
            TOKEN_PROGRAM_ID
          )
        );
  
        // Set the fee payer and get a fresh blockhash
        transaction.feePayer = fromPublicKey;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
  
        // Sign and send the transaction
        const signedTransaction = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          { maxRetries: 5 }
        );
  
        console.log("USDC Transaction sent with signature:", signature);
  
        // Wait for confirmation
        await connection.confirmTransaction(signature);
        console.log("USDC Transaction successful with signature:", signature);
        const transactionLink = `https://explorer.solana.com/tx/${signature}?cluster=mainnet`;
        console.log("USDC Transaction link:", transactionLink);
        return { signature, transactionLink };
      } catch (error) {
        console.error("USDC Transaction failed:", error);
      }
    } else {
      console.error("OKX Wallet not found");
    }
  };
  
  export const sendUSDTTransaction = async (
    toAddress: string,
    usdtMintAddress: string,
    amount: number
) => {
    if (!window.solana || !window.solana.isConnected) {
        return;
    }

    const connection = new Connection(
        process.env.RPC_URL || "https://solana-rpc.publicnode.com",
        "confirmed"
    );

    const amountInLamports = amount * 1e6; // Assuming USDT has 6 decimal places

    await window.solana.connect();

    const fromPublicKey = new PublicKey(window.solana.publicKey);
    const toPublicKey = new PublicKey(toAddress);

    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Log wallet balance
            const balance = await connection.getBalance(fromPublicKey);
            console.log("Wallet balance:", balance);

            // Get associated token accounts
            const fromTokenAccount = await getAssociatedTokenAddress(
                new PublicKey(usdtMintAddress),
                fromPublicKey
            );
            console.log("fromTokenAccount", fromTokenAccount.toBase58());

            const toTokenAccount = await getAssociatedTokenAddress(
                new PublicKey(usdtMintAddress),
                toPublicKey
            );
            console.log("toTokenAccount", toTokenAccount.toBase58());

            // Check if recipient's token account is initialized
            const accountInfo = await connection.getAccountInfo(toTokenAccount);
            if (!accountInfo) {
                console.log("Creating recipient's token account...");
                const transaction = new Transaction().add(
                    createAssociatedTokenAccountInstruction(
                        fromPublicKey,
                        toTokenAccount,
                        toPublicKey,
                        new PublicKey(usdtMintAddress)
                    )
                );

                transaction.feePayer = fromPublicKey;
                const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;

                const signedTransaction = await window.solana.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signedTransaction.serialize());
                
                // Wait for confirmation
                await connection.confirmTransaction(signature);
                console.log("Token account created successfully.");
            }

            // Create a transaction to transfer USDT
            const transaction = new Transaction().add(
                createTransferInstruction(
                    fromTokenAccount,
                    toTokenAccount,
                    fromPublicKey,
                    amountInLamports,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            transaction.feePayer = fromPublicKey;
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            const signedTransaction = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            console.log("Transaction sent with signature:", signature);

            // Wait for confirmation using getSignatureStatus
            let status;
            let retries = 0;
            const maxStatusRetries = 5;
            while (retries < maxStatusRetries) {
                status = await connection.getSignatureStatus(signature);
                console.log("Transaction status:", status);

                if (status.value !== null) {
                    if (status.value.err) {
                        throw new Error("Transaction failed");
                    } else if (
                        status.value.confirmationStatus === "confirmed" ||
                        status.value.confirmationStatus === "finalized"
                    ) {
                        console.log("USDT Transaction successful with signature:", signature);
                        return { signature };
                    }
                }

                retries++;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
            }

            throw new Error("Transaction confirmation timeout");
        } catch (error) {
            console.error(`USDT Transaction attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) {
                throw error;
            }
        }
    }
};
