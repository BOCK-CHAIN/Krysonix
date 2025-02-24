import { Fragment, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

import { Button } from "~/Components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
  MoreVertical,
  FileText,
  Settings,
  HelpCircle,
  Lock,
  LogOut,
  Paintbrush as Brush,
  Search,
  User,
  MessageSquarePlus
} from "lucide-react";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { Input } from "~/Components/ui/input";
import { UserImage } from "./VideoComponent";
import Image from "next/image";
import { UploadButton } from "./Buttons/UploadButton";
import { api } from "~/utils/api";
import { useDebounce } from "~/Hooks/use-debounce";

interface NavbarProps {
  children?: JSX.Element;
}

interface NavigationItem {
  icon: (className: string) => JSX.Element;
  name: string;
  path: string;
  lineAbove: boolean;
}

export default function Navbar({ children }: NavbarProps) {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const { refetch } =
    api.user.getDashboardData.useQuery(userId as string);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const router = useRouter();

  useEffect(() => {
    void refetch()
  }, [sessionData?.user.id])

  useEffect(() => {
    if (debouncedSearchInput) {
      handleSearch();
    }
  }, [debouncedSearchInput]);

  const signedInNavigation: NavigationItem[] = [
    {
      icon: (className) => <User className={className} />,
      name: "View Profile",
      path: `/${String(userId)}/profileVideos`,
      lineAbove: true,
    },
    {
      icon: (className) => <Brush className={className} />,
      name: "Creator Studio",
      path: "/dashboard",
      lineAbove: false,
    },
    {
      icon: (className) => <Settings className={className} />,
      name: "Settings",
      path: "/settings",
      lineAbove: false,
    },
    {
      icon: (className) => <FileText className={className} />,
      name: "Terms and Conditions",
      path: "/terms-and-conditions",
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy Policy",
      path: "/privacy-policy",
      lineAbove: false,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Refund and Cancellation Policy",
      path: "/refund-and-cancellation",
      lineAbove: false,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Contact Us",
      path: "/contact-us",
      lineAbove: false,
    },
    {
      icon: (className) => <LogOut className={className} />,
      name: "Log Out",
      path: "sign-out",
      lineAbove: true,
    },
  ];

  const signedOutNavigation: NavigationItem[] = [
    {
      icon: (className) => <FileText className={className} />,
      name: "Terms and Conditions",
      path: "/terms-and-conditions",
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy Policy",
      path: "/privacy-policy",
      lineAbove: false,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Refund and Cancellation Policy",
      path: "/refund-and-cancellation",
      lineAbove: false,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Contact Us",
      path: "/contact-us",
      lineAbove: false,
    },
  ];

  const Navigation = sessionData ? signedInNavigation : signedOutNavigation;

  const handleSearch = async () => {
    try {
      await router.push({
        pathname: "/searchPage",
        query: { q: searchInput },
      });
    } catch (error) {
      console.error("Error navigating to search page:", error);
    }
  };

  return (
    <div className="fixed z-50 w-full border-b bg-[#0d0d0d] text-gray-300 backdrop-blur">
      <div className="mx-auto flex max-w-full px-6 lg:px-16 xl:grid xl:grid-cols-12">
        <div className="flex flex-shrink-0 items-center lg:static xl:col-span-2">
          <Link href="/" aria-label="Home">
            <Image src={"/logo.svg"} alt={""} width={"150"} height={"100"} />
          </Link>
        </div>

        <div className="w-full min-w-0 flex-1 lg:px-0 xl:col-span-8">
          <div className="flex items-center px-6 py-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="search"
                name="search"
                className="pl-10 bg-[#181818] border-gray-600 text-gray-200"
                placeholder="Search"
                type="search"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center lg:hidden">
          {children}
        </div>

        <div className="m-0 hidden w-max px-0 lg:flex lg:items-center lg:justify-end xl:col-span-2 gap-2">
          <Menu as="div" className="relative ml-5 flex-shrink-0">
            <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {sessionData ? (
                <UserImage image={sessionData?.user.image} />
              ) : (
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#181818] text-gray-300 rounded-md shadow-lg ring-1 ring-gray-700">
                {sessionData && (
                  <div className="px-4 py-3 flex items-center border-b border-gray-600">
                    <UserImage image={sessionData?.user.image} />
                    <div className="ml-3 flex-grow overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {sessionData.user?.name}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {sessionData.user?.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="py-1">
                  {Navigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm",
                            active ? "bg-gray-700" : "",
                            item.lineAbove && "border-t border-border"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.path === "sign-out") {
                              void signOut({ redirect: true });
                            } else {
                              void router.push(item.path);
                            }
                          }}
                        >
                          {item.icon("h-4 w-4 mr-3")}
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {!sessionData ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => void signIn()}
              >
                Log in
              </Button>
              <Button
                onClick={() => router.push('/auth/sign-up')}
              >
                Sign up
              </Button>
            </div>) :
            <div className="m-0 hidden w-max px-0 lg:flex lg:items-center lg:justify-end xl:col-span-2 gap-2">
              <UploadButton link={"/dashboard"} refetch={refetch}></UploadButton>
            </div>
          }
        </div>

      </div>
    </div>
  );
}