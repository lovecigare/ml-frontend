"use client";

import { useLocalStorage } from "usehooks-ts";

/// lib
import { cn } from "@/lib/utils";

interface ProjectLayoutProps {
  SideBar?: JSX.Element;
  NavBar?: JSX.Element;
  Footer?: JSX.Element;
  children?: React.ReactNode;
}

const AdminLayout = ({
  SideBar,
  NavBar,
  Footer,
  children
}: ProjectLayoutProps) => {
  const [isSidebarOpened] = useLocalStorage<boolean>("isSidebarOpen", true);

  return (
    <>
      {SideBar}
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
          isSidebarOpened === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <div>
          {NavBar}
          <div className="container px-4 pb-8 pt-8 sm:px-8">{children}</div>
        </div>
      </main>
      <footer
        className={cn(
          "transition-[margin-left] duration-300 ease-in-out",
          isSidebarOpened === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {Footer}
      </footer>
    </>
  );
};

export default AdminLayout;
