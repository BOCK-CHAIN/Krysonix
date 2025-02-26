import { Switch } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";

interface PublishedButton {
  video: {
    id: string;
    publish: boolean;
    description: string | null;
    title: string | null;
    thumbnailUrl: string | null;
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PublishedButton({ video }: PublishedButton) {
  const { data: sessionData } = useSession();
  const [userChoice, setUserChoice] = useState({
    publish: video.publish,
  });
  const publishVideoMutation = api.video.publishVideo.useMutation();
  const handlePublishVideo = (input: { id: string; userId: string }) => {
    if (!sessionData) return;
    if (!video.thumbnailUrl || !video.title) {
      toast.error("Please add the title and thumbnail to publish the video");
      return;
    }
    setUserChoice((prev) => ({ publish: !prev.publish }));
    publishVideoMutation.mutate(input);
  };

  return (
    <>
      <td className="whitespace-nowrap px-3 py-5 text-sm">
        <Switch
          checked={userChoice.publish}
          onChange={() =>
            handlePublishVideo({
              id: video.id,
              userId: sessionData ? sessionData.user.id : "",
            })
          }
          className={classNames(
            userChoice.publish ? "bg-purple-800" : "bg-gray-700",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              userChoice.publish ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm">
        {userChoice.publish ? (
          <span className="inline-flex items-center rounded-full border border-green-700 px-2 py-1 text-xs font-medium text-green-700">
            Published
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-yellow-700 px-2 py-1 text-xs font-medium text-yellow-700">
            Unpublished
          </span>
        )}
      </td>
    </>
  );
}
