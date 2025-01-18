import { ChevronUp } from "lucide-react";

/// components
import { Button } from "@/components/ui/button";
/// lib
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

const UserDetailsToggle = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div>
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-md w-8 h-8"
        variant="outline"
        size="icon"
      >
        <ChevronUp
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}

export default UserDetailsToggle;
