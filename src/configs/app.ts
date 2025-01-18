import type { Network } from "lucid-cardano";

const loadAppConfig = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACK_END_API_URL;
  const network = process.env.NEXT_PUBLIC_NETWORK as Network;

  return {
    network,
    apiBaseUrl
  };
};

export { loadAppConfig };
