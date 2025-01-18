import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function CompactLayout({ children }: Props) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full px-8 py-12 mx-auto text-center">
        {children}
      </div>
    </div>
  );
}