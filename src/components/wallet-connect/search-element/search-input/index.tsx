"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SearchInput: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.replace(`?${params.toString()}`);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
  };

  return (
    <div className="flex w-full flex-row items-center justify-between rounded-lg border border-neutrals-500 pr-2 dark:bg-neutral-900">
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={handleChange}
        className="w-[80%] rounded-md bg-neutral-100 p-2 outline-none dark:bg-neutral-900"
      />
      <Search size={16} />
    </div>
  );
};

export default SearchInput;
