const savedWalletSelectionKey = "yieldlab-connected-wallet";

type WalletItem = {
  name: string;
  key: string;
  icon: string;
  link: string;
};

const supportedWallets: WalletItem[] = [
  {
    name: "Vespr",
    key: "vespr",
    icon: "/assets/icon/wallet/vespr.png",
    link: "https://vespr.xyz/"
  },
  {
    name: "Eternl",
    key: "eternl",
    icon: "/assets/icon/wallet/eternl.png",
    link: "https://chromewebstore.google.com/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka"
  },
  {
    name: "Typhon",
    key: "typhoncip30",
    icon: "/assets/icon/wallet/typhon.png",
    link: "https://typhonwallet.io/#/download"
  },
  {
    name: "Gero",
    key: "gerowallet",
    icon: "/assets/icon/wallet/gero.png",
    link: "https://www.gerowallet.io"
  },
  {
    name: "Begin",
    key: "begin",
    icon: "/assets/icon/wallet/begin.png",
    link: "https://begin.is"
  }
];

export { savedWalletSelectionKey, supportedWallets };
