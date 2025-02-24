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
  const handleClick = () => {
    setOpen(true);
  };
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
      <Button className="bg-transparent text-white" size={"default"} onClick={() => handleClick()}>
        <Trash className=" h-5 w-5 shrink-0 " />
      </Button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#181818] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex !h-12 !w-12">
                      <RedTrash aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-200"
                      >
                        Delete Video
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">
                          Are you sure you want to delete this video? Once it's
                          deleted, you will not be able to recover it.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      variant="default"
                      className="bg-red-800 mx-3 text-neutral-200 hover:bg-red-700"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        await handleDeleteVideo({
                          id: videoId,
                          userId: sessionData ? sessionData.user.id : "",
                        })
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
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
