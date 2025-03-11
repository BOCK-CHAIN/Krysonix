import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { api } from "~/utils/api";

import Link from "next/link";
import { type NextPage } from "next";
import {
  FollowButton,
  LikeDislikeButton,
  SaveButton,
} from "~/Components/Buttons/Buttons";
import {
  Description,
  SmallSingleColumnVideo,
  CommentSection,
  Layout,
  ErrorMessage,
  LoadingMessage,
  VideoTitle,
  VideoInfo,
  UserImage,
  UserName,
} from "~/Components/Components";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Share } from "lucide-react";
import { Button } from "~/Components/ui/button";
import { env } from "~/env.mjs";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const { data: sessionData } = useSession();

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideoData,
  } = api.video.getVideoById.useQuery(
    {
      id: videoId as string,
      viewerId: sessionData?.user?.id as string,
    },
    {
      enabled: !!videoId && !!sessionData?.user?.id, // run the query when videoId and sessionData?.user?.id are both defined
    }
  );

  const {
    data: sidebarVideos,
    isLoading: sidebarLoading,
    error: sidebarError,
    refetch: refetchSidebarVideos,
  } = api.video.getRandomVideos.useQuery(20, {
    enabled: false, // this query will not run automatically
  });
  const addViewMutation = api.videoEngagement.addViewCount.useMutation();
  const addView = async (input: { id: string; userId: string }) => {
    addViewMutation.mutate(input);
  };
  async function addViewFunc() {
    await addView({
      id: videoId as string,
      userId: sessionData ? sessionData.user.id : " ",
    });
  }
  useEffect(() => {
    if (videoId) {
      void refetchVideoData();
      addViewFunc();
    }
  }, [sessionData]);

  useEffect(() => {
    if (!sidebarVideos) {
      void refetchSidebarVideos(); // manually refetch sidebarVideos if they do not exist
    }
  }, []);

  const video = videoData?.video;
  const user = videoData?.user;
  const viewer = videoData?.viewer;
  const errorTypes = !videoData || !user || !video || !viewer;
  const DataError = () => {
    if (videoLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Video"
          description="Sorry there is an error with video ."
        />
      );
    } else {
      return <></>;
    }
  };

  const handleShare = async (video: { id: string; title: string | null }) => {
    const videoUrl = `${window.location.origin}/video/${video.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title || "",
          url: videoUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(videoUrl);
      alert("Link copied to clipboard!");
    }
  };

  if (!video) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{video.title}</title>
        <meta property="og:title" content={video.title || ""} />
        <meta property="og:description" content={video.description || ""} />
        <meta property="og:image" content={video.thumbnailUrl || ""} />
        <meta property="og:url" content={`https://krysonix.bock/video/${video.id}`} />
        <meta property="og:type" content="video.other" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={video.title || ""} />
        <meta name="twitter:description" content={video.description || ""} />
        <meta name="twitter:image" content={video.thumbnailUrl || ""} />
      </Head>
      <Layout closeSidebar={true}>
        <main className="mx-auto lg:flex">
          {errorTypes ? (
            <DataError />
          ) : (
            <>
              <div className="w-full sm:px-4 lg:w-3/5 ">
                <div className="py-4">
                  {/* <ReactPlayer
                    controls={true}
                    style={{ borderRadius: "1rem", overflow: "hidden" }}
                    width={"100%"}
                    height={"50%"}
                    url={video.videoUrl || ""}
                  /> */}
                  <video
                    preload="metadata"
                    className="aspect-video w-full  rounded-xl"
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                  >
                    <source
                      src={`${process.env.NEXT_PUBLIC_GCS_CDN_URL}/${video.videoUrl}#1`}
                    />
                  </video>
                </div>
                <div className="mb-3 flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <div className="min-w-0 flex-1 space-y-3 ">
                    <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
                      <div className="flex flex-col items-start justify-center gap-1 self-stretch">
                        <VideoTitle title={video.title as string} />
                        <VideoInfo views={video.views} createdAt={video.createdAt} />
                      </div>
                      <div className="flex flex-col items-end gap-2 self-start">
                        <div className="flex items-center gap-4">
                          <LikeDislikeButton
                            EngagementData={{
                              id: video.id,
                              likes: video.likes,
                              dislikes: video.dislikes,
                            }}
                            viewer={{
                              hasDisliked: viewer.hasDisliked,
                              hasLiked: viewer.hasLiked,
                            }}
                          />
                          <Button
                            size={"sm"}
                            onClick={() => handleShare(video)}
                            className="flex items-center gap-2 rounded-lg bg-purple-800 text-white hover:bg-purple-800 px-3 py-2  transition-all"
                          >
                            <Share size={20} />
                            <span className="text-sm">Share</span>
                          </Button>
                          <SaveButton videoId={video.id} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row  place-content-between gap-x-4 ">
                      <Link
                        href={`/${video.userId}/profileVideos`}
                        key={video.userId}
                      >
                        <div className="flex flex-row gap-2">
                          <UserImage image={user.image} />
                          <button className="flex flex-col">
                            <UserName name={user.name || ""} />
                            <p className=" text-sm text-gray-400">
                              {user.followers}
                              <span> Followers</span>
                            </p>
                          </button>
                        </div>
                      </Link>
                      <FollowButton
                        refetch={refetchVideoData}
                        followingId={user.id}
                        viewer={{
                          hasFollowed: viewer.hasFollowed,
                        }}
                      />
                    </div>
                    <Description
                      text={video.description || ""}
                      length={200}
                      border={true}
                    />
                  </div>
                </div>

                <CommentSection
                  videoId={video.id}
                  comments={videoData.comments.map(({ user, comment }) => ({
                    comment: {
                      id: comment.id,
                      message: comment.message,
                      createdAt: comment.createdAt,
                    },
                    user: {
                      id: user.id,
                      name: user.name,
                      image: user.image,
                      handle: user.handle,
                    },
                  }))}
                  refetch={refetchVideoData}
                />
              </div>
            </>
          )}
          <div className="px-4 lg:w-2/5 lg:px-0   ">
            {!sidebarVideos ? (
              <DataError />
            ) : (
              <SmallSingleColumnVideo
                refetch={refetchSidebarVideos}
                videos={sidebarVideos.videos.map((video) => ({
                  id: video?.id || "",
                  title: video?.title || "",
                  thumbnailUrl: video?.thumbnailUrl || "",
                  createdAt: video?.createdAt || new Date(),
                  views: video?.views || 0,
                }))}
                users={sidebarVideos.users.map((user) => ({
                  name: user?.name || "",
                  image: user?.image,
                }))}
              />
            )}
          </div>
        </main>
      </Layout>
    </>
  );
};

export default VideoPage;
