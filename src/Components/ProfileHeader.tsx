import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FollowButton } from "./Buttons/Buttons";
import { useSession } from "next-auth/react";
import { Edit } from "./Icons/Icons";
import { ErrorMessage, LoadingMessage, UserImage } from "./Components";
import Head from "next/head";
import { Button } from "./ui/button";

export default function ProfileHeader() {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  const isOwnProfile = userId === sessionData?.user.id;

  if (!isOwnProfile && (router.pathname === `/[userId]/profilePlaylists` || router.pathname === `/[userId]/profileFollowing`)) {
    router.push(`/${userId}/profileVideos`)
  }

  const tabs = useMemo(() => {
    const allTabs = [
      {
        name: "Videos",
        path: `/${userId}/profileVideos`,
        current: router.asPath === `/${userId}/profileVideos`,
      },
      {
        name: "Playlists",
        path: `/${userId}/profilePlaylists`,
        current: router.asPath === `/${userId}/profilePlaylists`,
      },
      {
        name: "Announcements",
        path: `/${userId}/profileAnnouncements`,
        current: router.asPath === `/${userId}/profileAnnouncements`,
      },
      {
        name: "Following",
        path: `/${userId}/profileFollowing`,
        current: router.asPath === `/${userId}/profileFollowing`,
      },
    ];

    return isOwnProfile ? allTabs : allTabs.filter(tab => ["Videos", "Announcements"].includes(tab.name));
  }, [userId, router.pathname, isOwnProfile]);

  const { data, isLoading, error, refetch } = api.user.getChannelById.useQuery({
    id: userId as string,
    viewerId: sessionData?.user?.id as string,
  });

  const channel = data?.user;
  const viewer = data?.viewer;
  const errorTypes = !channel || !viewer || error;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPeople"
          message="Error loading Channel"
          description="Sorry there is a error loading channel at this time."
        />
      );
    } else {
      return <></>;
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Head>
        <title>{channel?.name ? channel.name : ""}</title>
        <meta name="description" content={channel?.description || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {errorTypes ? (
        <Error />
      ) : (
        <>
          <Image
            className="h-32 w-full object-cover lg:h-64"
            src={channel.backgroundImage || "/background.jpg"}
            width={2000}
            height={2000}
            alt="error"
          />
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="!-mt-6 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <UserImage
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  image={channel.image || "/profile.jpg"}
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="sm: mt-6 min-w-0 flex-1 md:block">
                  <h1 className="truncate text-2xl font-bold text-white">
                    {channel.name}
                  </h1>
                  <p className="text-regular text-gray-300">{channel.handle}</p>
                  <div className="mt-1 flex items-start text-xs">
                    <p className="text-sm text-gray-300">
                      {channel.followers} Followers
                    </p>
                    <li className="pl-2 text-sm text-gray-500"></li>
                    <p className="text-sm text-gray-300">
                      {channel.followings} Following
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-stretch space-y-3 sm:space-x-4 sm:space-y-0">
                  {isOwnProfile ? (
                    <Button
                      size={"lg"}
                      onClick={() => router.push("/settings")}
                      className="!-5 ml-2 flex bg-purple-800 hover:bg-purple-700"
                    >
                      <Edit className="mr-2 h-5 w-5 shrink-0 stroke-white" />
                      Edit
                    </Button>
                  ) :
                    <FollowButton
                      refetch={refetch}
                      followingId={userId as string}
                      viewer={{
                        hasFollowed: viewer.hasFollowed,
                      }}
                    />
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 mt-4 border-b border-gray-700">
            <nav
              className="-mb-px flex min-w-max whitespace-nowrap"
              aria-label="Tabs"
            >
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.path}
                  onClick={(e) => {
                    e.preventDefault();
                    void router.push(tab.path);
                  }}
                  className={classNames(
                    tab.current
                      ? "border-purple-800 bg-gray-800 text-white"
                      : "border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300",
                    "w-full border-b-4 px-1 py-4 text-center text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}