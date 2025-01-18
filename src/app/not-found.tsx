import React from "react";
import Link from "next/link";
import Image from "next/image";

import CompactLayout from "@/layouts/compact-layout";

const NotFound = () => {
  return (
    <CompactLayout>
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <Image
          alt="404 Error"
          src="/assets/images/404-error.png"
          className="mb-4"
          width={500}
          height={400}
        />
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    </CompactLayout>
  );
};

export default NotFound;
