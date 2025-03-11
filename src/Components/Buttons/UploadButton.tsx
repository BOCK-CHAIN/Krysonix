import React from "react";
import { useState, useRef } from "react";
import { Loader2, Plus, Upload } from "lucide-react";
import { Button } from "~/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/Components/ui/dialog";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";

export function UploadButton({
  link,
  refetch,
}: {
  link?: string;
  refetch: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const { data: sessionData } = useSession();
  const addVideoUpdateMutation = api.video.createVideo.useMutation();
  const [loading, setLoading] = useState(false);

  const handlevideo = async () => {
    if (!uploadedVideo) return toast.error("Please attach a video");

    if (uploadedVideo.type !== "video/mp4")
      return toast.error("Please attach a video with mp4 format");
    setLoading(true);

    const videoData = {
      userId: sessionData?.user.id as string,
      fileType: uploadedVideo.type,
      fileName: `${uploadedVideo.name}-${Date.now()}`,
      type: "video",
    };
    try {
      const resp = await fetch(`/api/${env.NEXT_PUBLIC_CDN_LINK}`, {
        method: "POST",
        body: JSON.stringify(videoData),
      });
      const data = await resp.json();
      if (resp.status !== 200) {
        console.error("An error occurred:", data.error);
        toast.error("An error occurred while uploading the video");
        setUploadedVideo(null);
        setLoading(false);
        return;
      }
      const { signedUrl } = data;

      if (!signedUrl)
        return toast.error("An error occurred while uploading the video");
      await axios.put(signedUrl, uploadedVideo, {
        headers: {
          "Content-Type": uploadedVideo.type,
        },
      });
      // const url = new URL(signedUrl)
      // const videoUrl = url.origin + url.pathname
      const newVideoData = {
        userId: sessionData?.user.id as string,
        videoUrl: `${sessionData?.user.id}/${videoData.fileName}/video`,
      };
      addVideoUpdateMutation.mutate(newVideoData, {
        onSuccess: () => {
          setUploadedVideo(null);
          setOpen(false);
          setLoading(false);
          void refetch();
          link
            ? toast("Video uploaded successfully.Please publish it.", {
                duration: 4000,
                action: {
                  label: "Go to Creator Studio",
                  onClick: () => {
                    window.location.href = "/dashboard";
                  },
                },
              })
            : toast.success("Video uploaded successfully.Please publish it.");
        },
      });
    } catch (err) {
      console.error("An error occurred:", err);
      toast.error("An error occurred while uploading the video");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.files &&
      e.target.files.length > 0 &&
      e.target.files[0]?.type === "video/mp4"
    ) {
      setUploadedVideo(e.target.files[0] ? e.target.files[0] : null);
      toast.info("Video attached successfully");
    } else {
      toast.error("Please attach a video with mp4 format");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="ml-2 flex bg-purple-800 text-gray-200 hover:bg-purple-800"
        >
          <>
            <Image
              src="/VideoIcon.svg"
              alt="Video Icon"
              width={30}
              height={30}
              className="mr-2 shrink-0 fill-white text-white invert"
            />
            Upload
          </>
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-gray-700 bg-[#181818] text-gray-200 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-6 text-gray-200">
            Upload Video
          </DialogTitle>
        </DialogHeader>
        <div className="mt-3 w-full sm:mt-0">
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
              <div className="text-center">
                {uploadedVideo ? (
                  <p className="text-gray-300">Your video has been attached.</p>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-transparent font-semibold text-purple-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-800 focus-within:ring-offset-2 hover:text-purple-600"
                      >
                        <span>Upload a video</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={onFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-row-reverse gap-2 sm:mt-4">
          <Button
            variant="default"
            onClick={() => handlevideo()}
            className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Upload"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setUploadedVideo(null);
              setLoading(false);
              setOpen(false);
            }}
            className="bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
