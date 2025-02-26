import { Navbar, Sidebar, Footer } from "./Components";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "~/Components/ui/button";

interface LayoutProps {
  children: JSX.Element;
  closeSidebar?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children, closeSidebar }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0D0D0D] text-gray-300">
      <Navbar>
        <Button
          variant="ghost"
          className="text-gray-400 hover:bg-gray-800 hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </Navbar>

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:hidden">
        <Footer />
      </div>

      <div
        className={classNames(
          closeSidebar ? "lg:pl-20" : "lg:pl-56",
          "h-full bg-[#181818] text-gray-200"
        )}
      >
        <main className="no-scrollbar mx-auto h-full space-x-4 overflow-y-auto px-4 py-24 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
