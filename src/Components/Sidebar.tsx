import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Rewind as ClockRewind, Folder, HelpCircle, Home, Lock, MessageSquarePlus as MessagePlusSquare, Settings, ThumbsUp, UserCheck, File, Video as VideoRecorder, User, Brush, LogOut, X, FileText, Phone, DollarSign, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserImage } from "./Components";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { UploadButton } from "./Buttons/UploadButton";
import { api } from "~/utils/api";

interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}

export default function Sidebar({
  isOpen,
  setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;
  const { refetch } =
    api.user.getDashboardData.useQuery(userId as string);

  const DesktopNavigation: NavigationItem[] = [
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
    {
      name: "Liked Videos",
      path: userId ? `/playlist/likedVideos` : "sign-in",
      icon: (className) => <ThumbsUp className={className} />,
      current: router.pathname === `/playlist/likedVideos`,
    },
    {
      name: "Your Videos",
      path: userId ? `/${String(userId)}/profileVideos` : "sign-in",
      icon: (className) => <VideoRecorder className={className} />,
      current: router.asPath === `/${String(userId)}/profileVideos`,
    },

  ];

  const SignedInMobileNavigation: NavigationItem[] = [
    {
      name: "Profile",
      path: `/${String(userId)}/profileVideos`,
      icon: (className) => <User className={className} />,
      current: router.pathname === `/[userId]/profileVideos`,
    },
    {
      name: "Creator Studio",
      path: `/dashboard`,
      icon: (className) => <Brush className={className} />,
      current: router.pathname === `/dashboard`,
    },
    {
      name: "Settings",
      path: `/settings`,
      icon: (className) => <Settings className={className} />,
      current: router.pathname === `/settings`,
    },
  ];

  const SignedOutMobileNavigation: NavigationItem[] = [
    {
      name: "Home",
      path: `/`,
      icon: (className) => <Home className={className} />,
      current: router.pathname === `/`,
    },
  ];

  const mobileNavigation = sessionData
    ? SignedInMobileNavigation
    : SignedOutMobileNavigation;

  useEffect(() => {
    DesktopNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
    mobileNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
  }, [router.pathname]);

  return (
    <>
      <div className={cn(
        closeSidebar ? "lg:w-20" : "lg:w-56",
        "bottom-0 top-16 hidden lg:fixed lg:z-40 lg:flex lg:flex-col"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-[#2a2a2a] bg-[#1a1a1a] px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {DesktopNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.path === "sign-in") {
                            void signIn();
                          } else {
                            void router.push(item.path || "/");
                          }
                        }}
                        className={cn(
                          item.current
                            ? "bg-[#2a2a2a] text-white"
                            : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        {item.icon(cn(
                          "h-5 w-5 shrink-0",
                          item.current ? "text-white" : "text-gray-300 group-hover:text-white"
                        ))}
                        <p className={cn(closeSidebar ? "hidden" : "")}>
                          {item.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="*"
                  onClick={(e) => {
                    e.preventDefault();
                    sessionData ? void router.push("/dashboard") : void signIn();
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                >
                  <Brush
                    className="h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-white"
                  />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Creator Studio
                  </p>
                </Link>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    sessionData ? void router.push("/settings") : void signIn();
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                >
                  <Settings
                    className="h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-white"
                  />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Settings
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="text-gray-300 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#1a1a1a] px-6 pb-4">
                  <nav className="flex flex-1 flex-col pt-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                      <li className="border-t border-[#2a2a2a] h-full">
                        <ul role="list" className="-mx-2 space-y-1 pt-3">
                          {mobileNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.path || "/"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  void router.push(item.path || "/");
                                }}
                                className={cn(
                                  item.current
                                    ? "bg-[#2a2a2a] text-white"
                                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                {item.icon(cn(
                                  "h-5 w-5 shrink-0",
                                  item.current ? "text-white" : "text-gray-300 group-hover:text-white"
                                ))}
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className=" justify-center items-center flex mt-5">
                          <UploadButton link="/dashboard" refetch={refetch} />
                        </div>
                      </li>

                      <li className="mt-auto border-b border-[#2a2a2a]">
                        <Link
                          href="/terms-and-conditions"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                        >
                          <File className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-white" />
                          Terms and Conditions
                        </Link>
                        <Link
                          href="/privacy-policy"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                        >
                          <Lock className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-white" />
                          Privacy Policy
                        </Link>
                        <Link
                          href="/refund-and-cancellation"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                        >
                          <BadgeDollarSign className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-white" />
                          Refund and Cancellation Policy
                        </Link>
                        <Link
                          href="/contact-us"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                        >
                          <Phone className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-white" />
                          Contact Us
                        </Link>
                      </li>

                      {sessionData ? (
                        <div
                          onClick={(e) => { e.preventDefault(); router.push('/settings') }}
                          className={cn(
                            "flex items-center gap-x-3 rounded-lg p-2 text-sm font-semibold cursor-pointer leading-6",
                            "bg-[#2a2a2a] text-white hover:bg-[#363636]"
                          )}
                        >
                          <UserImage image={sessionData?.user.image} className="h-8 w-8 rounded-full" />
                          <div className="flex flex-col truncate">
                            <p className="font-semibold">{sessionData.user?.name}</p>
                            <p className="text-gray-300 text-xs">{sessionData.user?.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            className="ml-auto text-gray-300 hover:text-white hover:bg-[#363636]"
                            onClick={(e) => {
                              e.preventDefault();
                              void signOut();
                            }}
                          >
                            <LogOut className="h-5 w-5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="default"
                            className="w-full bg-[#2a2a2a] text-white hover:bg-[#363636]"
                            onClick={() => router.push('/auth/sign-up')}
                          >
                            Sign Up
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border border-gray-600 text-gray-900 bg-gray-400 hover:bg-white hover:text-gray-950"
                            onClick={() => void signIn()}
                          >
                            Log In
                          </Button>
                        </div>

                      )}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
