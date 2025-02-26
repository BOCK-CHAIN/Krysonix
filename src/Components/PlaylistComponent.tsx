import moment from "moment";
import Link from "next/link";
import {
  Description,
  SmallSingleColumnVideo,
  Thumbnail,
  UserImage,
} from "./Components";
import Head from "next/head";

interface PlaylistPageProps {
  playlist: {
    id: string;
    title: string;
    description: string;
    videoCount: number;
    playlistThumbnail: string;
    createdAt: Date;
  };
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    createdAt: Date;
    updatedAt: Date;
    views: number;
  }[];
  authors: {
    id: string;
    name: string;
    image: string | null | undefined;
  }[];
  user: {
    id: string;
    image: string | null | undefined;
    name: string;
    followers: number;
  };
}

export const PlaylistPage: React.FC<PlaylistPageProps> = ({
  playlist,
  videos,
  authors,
  user,
}) => {
  if (!playlist || !videos || !authors || !user) {
    return <></>;
  }
  return (
    <>
      <Head>
        <title>{playlist?.title ? playlist?.title + " - Krysonix" : ""}</title>
        <meta name="description" content={playlist?.description || ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto gap-4 lg:flex">
        <div className="lg:w-1/2 lg:px-0 lg:pl-6">
          <SinglePlaylist
            playlist={{
              id: playlist?.id || "",
              title: playlist?.title || "",
              videoCount: playlist?.videoCount || 0,
              playlistThumbnail: playlist?.playlistThumbnail || "",
              createdAt: playlist?.createdAt || new Date(),
            }}
          />
          <Description
            text={playlist.description || ""}
            length={250}
            border={false}
          />
          <div className="flex flex-row place-content-between gap-x-4">
            <Link href={`/${user.id}/profileVideos`} key={user.id}>
              <div className="mt-4 flex flex-row gap-2">
                <UserImage image={user.image} />
                <div className="flex flex-col">
                  <p className="w-max text-sm font-semibold leading-6 text-white">
                    {user.name || ""}
                  </p>
                  <p className="text-sm text-gray-300">
                    {user.followers}
                    <span> Followers</span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="gap-4 lg:w-1/2 lg:px-0 lg:pr-6">
          <SmallSingleColumnVideo
            videos={videos
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              )
              .map((video) => ({
                id: video?.id || "",
                title: video?.title || "",
                updatedAt: video?.updatedAt || new Date(),
                thumbnailUrl: video?.thumbnailUrl || "",
                createdAt: video?.createdAt || new Date(),
                views: video?.views || 0,
              }))}
            users={authors.map((author) => ({
              id: author?.id || "",
              name: author?.name || "",
              image: author?.image,
            }))}
          />
        </div>
      </main>
    </>
  );
};

export function MultiColumnPlaylist({
  playlists,
}: {
  playlists: {
    id: string;
    title: string;
    description: string;
    videoCount: number;
    playlistThumbnail: string;
    createdAt: Date;
  }[];
}) {
  return (
    <div className="mx-auto grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
      {playlists?.map((playlist) => (
        <Link
          href={`/playlist/${playlist.id}`}
          className="flex flex-col items-start justify-between rounded-2xl hover:bg-none"
          key={playlist.id}
        >
          <SinglePlaylist playlist={playlist}>
            <p className="text-regular mt-2 max-h-12 overflow-hidden text-gray-300">
              {playlist?.description}
            </p>
          </SinglePlaylist>
        </Link>
      ))}
    </div>
  );
}

export function SinglePlaylist({
  playlist,
  children,
}: {
  playlist: {
    id: string;
    title: string;
    videoCount: number;
    playlistThumbnail: string;
    createdAt: Date;
  };
  children?: React.ReactNode;
}) {
  return (
    <div className="relative w-full rounded-2xl">
      <div className="relative w-full">
        <Thumbnail thumbnailUrl={playlist?.playlistThumbnail} />
        <div className="absolute inset-x-0 bottom-0 max-h-32 rounded-b-2xl bg-black bg-opacity-80 backdrop-blur-lg">
          <div className="m-6 ">
            <div className="mt-2 flex place-content-between items-start gap-x-2 text-sm font-semibold text-white">
              <p>Playlist</p>
              <p>
                {playlist.videoCount}
                <span> Videos</span>
              </p>
            </div>
            <div className="mt-2 flex items-start gap-x-2">
              <p className="text-sm text-gray-300">
                {moment(playlist.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-lg">
        <div className="items-top relative mt-4 flex gap-x-4">
          <div className="w-full">
            <div className="w-100 flex">
              <h3 className="h-auto w-full text-2xl font-medium text-white group-hover:text-gray-300">
                {playlist.title}
              </h3>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
