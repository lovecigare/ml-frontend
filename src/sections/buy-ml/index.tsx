"use client";

import { Button } from "@/components/ui/button";
import { sendUSDTTransaction } from "@/utils/sendSolanaTransaction";
import { useState } from "react";

const BuyML = () => {
  const [amount, setAmount] = useState(0);

  const handleBuyML = async () => {
    const payment = await sendUSDTTransaction(
      "GeC6HKcPT3FRcDzQhQPLwJo2ggn3c7o6uBEp5nJV5wWL",
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      amount
    );
    if (payment) {
      const response = await fetch("http://localhost:5000/api/buy-ml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      console.log("response", response);
    } else {
      alert("payment failed!");
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
      <Button onClick={handleBuyML}>Proceed to BUY</Button>
    </div>
  );
};

export default BuyML;
