"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { availableWallets } from "./constant";
import SearchInput from "./search-input";

const SearchElement: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredItems = availableWallets.filter((item) =>
    item.value.toLowerCase().includes(query)
  );

  return (
    <div className="flex w-full flex-col gap-8 sm:w-[330px]">
      <Suspense fallback={<div></div>}>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold">Search</span>
          <SearchInput />
        </div>
        <div className="flex flex-col gap-2">
          <span className="dark:neutrals-100 text-[24px] font-bold">
            All Posts
          </span>
          <ScrollArea className="scroll-area border-neutrals-500 h-[1049px] w-full rounded-md border bg-neutral-100 dark:bg-neutral-900 sm:w-[330px]">
            {filteredItems.map((wallet, index) => (
              <>
                <Button
                  key={index}
                  variant={"ghost"}
                  className="font-slackey flex h-[40px] w-full items-center justify-center text-[20px] text-white hover:bg-transparent hover:text-white"
                >
                  <div className="flex">
                    <Image
                      src={wallet.imgUrl}
                      alt={wallet.name}
                      height={30}
                      width={30}
                      className="mr-5"
                    />
                  </div>
                  <div className="font-slackey wallet-name text-[20px] text-white">
                    {wallet.name}
                  </div>
                </Button>
              </>
            ))}
          </ScrollArea>
        </div>
      </Suspense>
    </div>
  );
};

export default SearchElement;
