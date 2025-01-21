"use client";

import { Button } from "@/components/ui/button";
import { sendUsdc } from "@/utils/sendSolanaTransaction";
import { useState } from "react";

const BuyML = () => {
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // const { publicKey } = useWallet();

  const handleBuyML = async () => {
    // if (!publicKey) {
    //   alert("Connect your wallet first!");
    // }
    if (amount < 50) {
      alert("Amount should be higher than $20");
    } else if (address === "") {
      alert("ML reciving address cannot be blank");
    } else {
      try {
        setIsProcessing(true);
        await sendUsdc(
          "4wPpM4tps4tptP2ShG2NAoFCB8QfRwgE1sMS87Yrjq45",
          "GeC6HKcPT3FRcDzQhQPLwJo2ggn3c7o6uBEp5nJV5wWL",
          amount,
          "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
        );
        // if (payment) {
        const response = await fetch(
          "https://764e-172-86-123-74.ngrok-free.app/api/buy-ml",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420"
            },
            body: JSON.stringify({ amount, address })
          }
        );
        if (response.ok) {
          setIsProcessing(false);
          alert(
            "Purchasing Successed! Bought Mintlayer tokens will be arrived to your wallet after 20 mins!"
          );
        } else {
          setIsProcessing(false);
          alert("Purchasing Failed! Try again later");
        }
        console.log("response", response);
        // } else {
        //   alert("Payment failed!");
        // }
      } catch (err) {
        alert("USDT Transaction was failed because of Netowrk speed issue");
      }
    }
  };

  return (
    <div className="mx-auto flex h-[378px] w-[378px] flex-col items-center gap-4 bg-neutral-500 p-2">
      <span className="mx-auto">Buy Mintlayer</span>
      <div className="flex h-[40px] w-auto flex-row items-center justify-center gap-2">
        <span className="text-[40px] text-white">$</span>
        <input
          className="w-[40%] bg-neutral-500 text-[40px] text-white outline-none"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        ></input>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <div
          className="flex h-[30px] w-[60px] cursor-pointer items-center justify-center rounded-md bg-neutral-800"
          onClick={() => setAmount(100)}
        >
          100
        </div>
        <div
          className="flex h-[30px] w-[60px] cursor-pointer items-center justify-center rounded-md bg-neutral-800"
          onClick={() => setAmount(200)}
        >
          200
        </div>
        <div
          className="flex h-[30px] w-[60px] cursor-pointer items-center justify-center rounded-md bg-neutral-800"
          onClick={() => setAmount(300)}
        >
          300
        </div>
      </div>

      <div className="flex h-[40px] w-full flex-col items-center justify-center">
        <span>Eth Address to receive Mintlayer Token</span>
        <input
          className="w-full bg-neutral-600 text-[14px] text-white outline-none"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></input>
      </div>
      <Button onClick={handleBuyML}>
        {isProcessing ? (
          <span>Processing ... </span>
        ) : (
          <span>Proceed to BUY</span>
        )}
      </Button>
    </div>
  );
};

export default BuyML;
