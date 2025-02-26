import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { UserPlus } from "../Icons/Icons";
import { Button } from "~/Components/ui/button";
import Loader from "../ui/loader";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface FollowButton {
  followingId: string;
  hideIcon?: boolean;
  viewer: {
    hasFollowed: boolean;
  };
  refetch?: () => void;
}

export default function FollowButton({
  followingId,
  hideIcon,
  viewer,
  refetch,
}: FollowButton) {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [userChoice, setUserChoice] = useState({
    following: viewer.hasFollowed,
  });
  const addFollowMutation = api.user.addFollow.useMutation();
  const handleFollow = async (input: {
    followingId: string;
    followerId: string;
  }) => {
    if (setLoading) {
      setLoading(true);
    }
    if (userChoice.following) {
      setUserChoice({ following: false });
    } else {
      setUserChoice({ following: true });
    }
    await addFollowMutation.mutateAsync(input);
    if (refetch) {
      void refetch();
    }
    if (setLoading) {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        variant={userChoice.following ? "secondary" : "default"}
        size="sm"
        onClick={
          sessionData
            ? () =>
                handleFollow({
                  followingId: followingId ? followingId : "",
                  followerId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className={`flex ${
          userChoice.following
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
            : "bg-purple-800 text-gray-200 hover:bg-purple-800"
        }`}
      >
        {loading ? (
          <>
            <Loader state></Loader>
          </>
        ) : (
          <>
            <UserPlus
              className={classNames(
                hideIcon
                  ? "hidden"
                  : `mr-2 h-5 w-5 shrink-0
                ${userChoice.following ? "stroke-gray-400" : "stroke-gray-200"}
                `
              )}
            />
            {userChoice.following ? "Following" : "Follow"}
          </>
        )}
      </Button>
    </>
  );
}
