import type { Network } from "lucid-cardano";

import { loadConfigs } from "@/configs";

const getNetworkFromId = (networkId: number): Network | "" => {
  const config = loadConfigs();
  const appNetwork = config.app.network;
  if (networkId === 0) return appNetwork === "Preprod" ? "Preprod" : "Preview";
  if (networkId === 1) return "Mainnet";
  return "";
};

const convertAddressToBech32 = async (address = "") => {
  const { C, fromHex } = await import("lucid-cardano");
  try {
    if (!(address?.length > 0)) {
      return "";
    }
    const bech32Address = C.Address.from_bytes(fromHex(address)).to_bech32(
      undefined
    );
    return bech32Address;
  } catch (_) {
    try {
      const bech32Address = C.Address.from_bech32(address).to_bech32(undefined);
      return bech32Address;
    } catch (_) {
      return "";
    }
  }
};

const canConnect = (walletKey = "") => {
  if (
    walletKey?.length > 0 &&
    window?.cardano &&
    window?.cardano[walletKey] &&
    typeof window.cardano[walletKey].enable == "function"
  ) {
    return true;
  }
  return false;
};

const truncateAddress = (
  address: string,
  startCharacters: number = 6,
  endCharacters: number = 4
) => {
  return (
    address.slice(0, startCharacters) + "..." + address.slice(-endCharacters)
  );
};

export {
  canConnect,
  convertAddressToBech32,
  getNetworkFromId,
  truncateAddress
};
