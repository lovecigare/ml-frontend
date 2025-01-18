import Image from "next/image";

interface Props {
  walletName: string;
  imageUrl: string;
  handleConnect: (walletName: string) => void;
}

const WalletButton = ({ walletName, imageUrl, handleConnect }: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleConnect(walletName);
  };
  return (
    <button
      className="justify-space flex h-[48px] w-full flex-row items-center gap-2 rounded-lg bg-neutral-300 p-3 dark:bg-neutral-700 sm:h-[56px]"
      onClick={handleClick}
    >
      <Image src={imageUrl} alt={walletName} height={30} width={30} />
      <span className="text-[16px] font-bold">{walletName.toUpperCase()}</span>
    </button>
  );
};

export default WalletButton;
