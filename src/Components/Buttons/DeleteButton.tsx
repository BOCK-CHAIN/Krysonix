import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Button } from "~/Components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { RedTrash } from "../Icons/RedTrash";
import { toast } from "sonner";

export default function DeleteButton({
  videoId,
  refetch,
}: {
  videoId: string;
  refetch: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { data: sessionData } = useSession();
  const deleteVideoMutation = api.video.deleteVideo.useMutation();

  const handleDeleteVideo = async (input: { id: string; userId: string }) => {
    try {
      await deleteVideoMutation.mutateAsync(input, {
        onSuccess: () => {
          void refetch();
          setOpen(false);
          toast.success("Video deleted successfully");
        },
      });
    } catch (err) {
      toast.error("Error deleting video. Please try again later.");
    }
  };

  return (
    <>
      <Button
        className="bg-transparent text-white"
        size="default"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-5 w-5 shrink-0" />
      </Button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-[#181818] p-6 text-left shadow-xl transition-all sm:max-w-md">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12">
                    <RedTrash aria-hidden="true" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="mt-3 text-center text-lg font-semibold text-gray-200"
                  >
                    Delete Video
                  </Dialog.Title>
                  <p className="mt-2 text-center text-sm text-gray-400">
                    Are you sure you want to delete this video? Once deleted, it
                    cannot be recovered.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="default"
                    className="w-full bg-red-800 text-neutral-200 hover:bg-red-700 sm:w-auto"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      await handleDeleteVideo({
                        id: videoId,
                        userId: sessionData ? sessionData.user.id : "",
                      });
                      setLoading(false);
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                  <Button
                    className="w-full bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 shadow-sm hover:bg-gray-600 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
