import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ClockIcon as ClockRewind,
  Folder,
  Home,
  UserCheck,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

export default function Footer() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const tabs: NavigationItem[] = [
    {
      name: "Home",
      path: `/`,
      icon: (className) => <Home className={className} />,
      current: router.pathname === `/`,
    },
    {
      name: "Following",
      path: userId ? `/${String(userId)}/profileFollowing` : "sign-in",
      icon: (className) => <UserCheck className={className} />,
      current: router.asPath === `/${String(userId)}/profileFollowing`,
    },
    {
      name: "Library",
      path: userId ? `/${String(userId)}/profilePlaylists` : "sign-in",
      icon: (className) => <Folder className={className} />,
      current: router.asPath === `/${String(userId)}/profilePlaylists`,
    },
    {
      name: "History",
      path: userId ? `/playlist/history` : "sign-in",
      icon: (className) => <ClockRewind className={className} />,
      current: router.pathname === `/playlist/history`,
    },
  ];

  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-[#2a2a2a] bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/60">
      <nav className="flex" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href="#"
            className={cn(
              tab.current
                ? "bg-[#2a2a2a] text-white"
                : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white",
              "group flex flex-1 flex-col items-center gap-1 p-2 text-xs font-semibold"
            )}
            onClick={(e) => {
              e.preventDefault();
              if (tab.path === "sign-in") {
                void signIn();
              } else {
                void router.push(tab.path || "/");
              }
            }}
          >
            {tab.icon(
              cn(
                "h-5 w-5 shrink-0",
                tab.current
                  ? "text-white"
                  : "text-gray-300 group-hover:text-white"
              )
            )}
            {tab.name}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
