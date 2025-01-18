"use client";

import { useIsClient } from "usehooks-ts";

interface Props {
  children: React.ReactNode;
  loader?: React.ReactNode;
}
const CsrWrapper: React.FC<Props> = ({
  children,
  loader = <div>Loading...</div>
}) => {
  const isClient = useIsClient();

  return <>{isClient ? children : loader}</>;
};

export default CsrWrapper;
