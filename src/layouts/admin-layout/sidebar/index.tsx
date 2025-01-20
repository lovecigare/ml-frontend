import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";

/// components
import { Button } from "@/components/ui/button";
/// lib
import { cn } from "@/lib/utils";

import Menu from "./menu";
import SidebarToggle from "./sidebar-toggle";

const Sidebar = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useLocalStorage<boolean>(
    "isSidebarOpen",
    true
  );

  const toggleSidebar = () => {
    setIsSidebarOpened((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpened === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={isSidebarOpened} setIsOpen={toggleSidebar} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "mb-1 transition-transform duration-300 ease-in-out",
            isSidebarOpened === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="mr-1 h-6 w-6" />
            <h1
              className={cn(
                "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                isSidebarOpened === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
            >
              Mintlayer
            </h1>
          </Link>
        </Button>
        <Menu isOpen={isSidebarOpened} />
      </div>
    </aside>
  );
};

export default Sidebar;
