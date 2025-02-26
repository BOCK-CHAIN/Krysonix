import { api } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import { useEngagementButton } from "~/Hooks/useEngagement";
import ThumbsUp from "../Icons/ThumbsUp";
import ThumbsDown from "../Icons/ThumbsDown";

interface LikeDislikeButtonProps {
  EngagementData: {
    id: string;
    likes: number;
    dislikes: number;
  };
  viewer: {
    hasLiked: boolean;
    hasDisliked: boolean;
  };
}

export default function VideoEngagement({
  EngagementData,
  viewer,
}: LikeDislikeButtonProps) {
  const { likeCount, dislikeCount, userChoice, handleLike, handleDislike } =
    useEngagementButton({
      EngagementData,
      viewer,
      addLikeMutation: api.videoEngagement.addLike.useMutation(),
      addDislikeMutation: api.videoEngagement.addDislike.useMutation(),
    });

  const { data: sessionData } = useSession();

  return (
    <div className="flex-end isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={
          sessionData
            ? () =>
                handleLike({
                  id: EngagementData ? EngagementData.id : "",
                  userId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className={`focus group relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-700 focus:z-10
        ${
          userChoice.like
            ? "bg-purple-800 text-white hover:bg-purple-800"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
      >
        <ThumbsUp
          className={`h-4 w-4 shrink-0 ${
            userChoice.like ? "fill-white" : "stroke-current"
          }`}
        />
        <p className="pl-2">{likeCount}</p>
      </button>
      <button
        onClick={
          sessionData
            ? () =>
                handleDislike({
                  id: EngagementData ? EngagementData.id : "",
                  userId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className={`focus group relative -ml-px inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-700 focus:z-10
        ${
          userChoice.dislike
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
      >
        <ThumbsDown
          className={`h-4 w-4 shrink-0 ${
            userChoice.dislike ? "fill-white" : "stroke-current"
          }`}
        />
        <p className="pl-2">{dislikeCount}</p>
      </button>
    </div>
  );
}
