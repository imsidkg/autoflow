import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

type Props = {};

const AppHeader = (props: Props) => {
  return (
    <div>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-backgroung">
        <SidebarTrigger />
      </header>
    </div>
  );
};

export default AppHeader;
