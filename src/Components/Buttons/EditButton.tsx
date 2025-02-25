import { Transition, Dialog } from "@headlessui/react"
import React from "react"
import { useState, useRef, Fragment, useEffect } from "react"
import { Edit } from "../Icons/Icons"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"
import { Button } from "~/Components/ui/button"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"
import { env } from "~/env.mjs"
import { Input } from "~/Components/ui/input"
import { Textarea } from "~/Components/ui/textarea"
import { Label } from "~/Components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { Thumbnail } from "../Thumbnail"
import { set } from "zod"

interface EditButtonProps {
  video: {
    videoUrl: string
    id: string
    title: string
    description: string
    thumbnailUrl: string
  }
  refetch: () => Promise<unknown>
}

export function EditButton({ video, refetch }: EditButtonProps) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [user, setUser] = useState({
    title: video.title,
    description: video.description,
  })
  const { data: sessionData } = useSession()
  const addVideoUpdateMutation = api.video.updateVideo.useMutation()

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }))
  }

  useEffect(()=>{
    if(video.thumbnailUrl) setCroppedImage(video.thumbnailUrl)
    else setCroppedImage(null)
  },[video.thumbnailUrl])

  const handleEdit = async () => {
    setLoading(true);
    const newVideoData = {
      id: video.id,
      userId: sessionData?.user.id as string,
      title: video.title || undefined,
      description: video.description || undefined,
      thumbnailUrl: video.thumbnailUrl || undefined,
    }
    if (croppedImage && image) {
      const mediaData = {
        userId: sessionData?.user.id as string,
        fileType: image.type,
        fileName: `${video.videoUrl.split("/")[1]}`,
        type: "thumbnail",
      }

      try {
        const resp = await fetch(`/api/${env.NEXT_PUBLIC_CDN_LINK}`, {
          method: 'POST',
          body: JSON.stringify(mediaData),
        })
        const data = await resp.json()
        if (resp.status !== 200) {
          console.error("An error occurred:", data.error)
          toast.error("An error occurred while uploading the thumbnail")
          setImage(null)
          setLoading(false)
          return
        }
        const { signedUrl } = data
        if (!signedUrl) return toast.error("An error occurred while uploading the thumbnail.Please update again.")
        const blob = await fetch(croppedImage).then(async (r) => await r.blob())
        await axios.put(signedUrl, blob, {
          headers: {
            "Content-Type": image.type,
          },
        })
        const url = new URL(signedUrl)
        const tnurl = url.origin + url.pathname + "?v=" + Date.now();
        newVideoData.thumbnailUrl = tnurl
        setCroppedImage(tnurl)
      } catch (err) {
        console.error("An error occurred:", err)
        toast.error("An error occurred while uploading the video")
        setImage(null)
        setLoading(false)
        return
      }
    }
    if (user.title !== video.title || user.description !== video.description || image !== null) {
      if (user.title !== video.title) newVideoData.title = user.title
      if (user.description !== video.description) newVideoData.description = user.description

      addVideoUpdateMutation.mutate(newVideoData, {
        onSuccess: () => {
          setOpen(false)
          void refetch()
        },
      })
      toast.success("Data Edited successfully.Please wait...");
    }else
    setOpen(false)
    setLoading(false)
    setImage(null)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files[0] && e.target.files[0].type.includes("image") && e.target.files[0].size < 5242880) {
      setImage(e.target.files[0] ? e.target.files[0] : null)
      setCurrentPage(2)
    } else {
      toast.error("Please upload a valid image file or size")
    }
  }

  const handleClick = () => {
    setCurrentPage(1)
    setOpen(true)
  }

  return (
    <>
      <Button className="bg-transparent p-2 sm:p-3" onClick={() => handleClick()}>
        <Edit className="h-5 w-5 shrink-0 stroke-gray-400" />
      </Button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 my-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 my-10 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-100 py-10 pt-20 overflow-y-auto no-scrollbar flex items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#181818] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6">
                {currentPage === 1 && (
                  <>
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 w-full text-center sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-200">
                          Edit Video
                        </Dialog.Title>
                        <p className="mt-2 text-sm text-gray-400">Edit your thumbnail, title, or description</p>
                        <div className="w-full">
                          <Label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-200">
                            Cover photo
                          </Label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-4 py-6 sm:px-6 sm:py-10">
                            <div className="text-center">
                              {croppedImage ? (
                                <>
                                  <img
                                    src={croppedImage || "/placeholder.svg"}
                                    alt="Cropped"
                                    className="cursor-pointer w-full max-w-xs rounded-md"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                  />
                                  <Input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={onFileChange}
                                  />
                                  <p className="mt-2 text-xs text-gray-400">Click the image to upload a new one</p>
                                </>
                              ) : (
                                <>
                                  <div className="mt-4 flex text-sm leading-6 py-1 text-gray-400">
                                    <Label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer p-1 rounded-md bg-[#181818] font-semibold text-purple-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-800 focus-within:ring-offset-2 hover:text-purple-700"
                                    >
                                      <span>Upload a file</span>
                                      <Input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={onFileChange}
                                      />
                                    </Label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                          <Label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-200">
                            Title
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            id="title"
                            onChange={handleInputChange}
                            value={user.title}
                            className="w-full rounded-md border-0 py-1.5 text-gray-200 shadow-sm  bg-zinc-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm"
                          />
                          <Label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-200 mt-4">
                            Description
                          </Label>
                          <Textarea
                            rows={4}
                            name="description"
                            id="description"
                            value={user.description || ""}
                            onChange={handleInputChange}
                            className="w-full rounded-md border-0 py-1.5 text-gray-200 shadow-sm   bg-zinc-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                      <Button
                        onClick={() => handleEdit()}
                        variant="default"
                        className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 w-full sm:w-auto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setOpen(false);
                          setImage(null);
                          setLoading(false);
                          setUser({
                            title: video.title,
                            description: video.description,
                          });
                        }}
                        className="bg-gray-700 text-gray-200 hover:bg-gray-600 w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
                {currentPage === 2 && (
                  <ImageCropper setCurrentPage={setCurrentPage} setCroppedImage={setCroppedImage} image={image} />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}


export function ImageCropper({
  setCurrentPage,
  setCroppedImage,
  image,
  handleSubmit,
  imageType,
  setOpen,
}: {
  handleSubmit?: (croppedDataUrl: string) => void
  setCurrentPage?: (page: number) => void
  setCroppedImage: (image: string | null) => void
  image: File | null | string
  imageType?: "backgroundImage" | "image"
  setOpen?: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  interface CropperImageElement extends HTMLImageElement {
    cropper?: Cropper
  }

  const cropperRef = useRef<CropperImageElement>(null)
  const cropImage = () => {
    if (cropperRef.current && cropperRef.current !== null) {
      const imageElement: CropperImageElement | null = cropperRef.current
      const cropper: Cropper | undefined = imageElement.cropper
      if (cropper) {
        const croppedDataUrl = cropper.getCroppedCanvas().toDataURL()
        setCroppedImage(croppedDataUrl)
        handleSubmit ? handleSubmit(croppedDataUrl) : null
      }
    }
  }

  const completeCrop = () => {
    cropImage()
    setCurrentPage ? setCurrentPage(1) : null
    setLoading(false)
  }

  const cancelCrop = () => {
    setCurrentPage ? setCurrentPage(1) : null
    setOpen ? setOpen(false) : null
  }

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
        {image && (
          <div className="mt-5">
            <Cropper
              src={image instanceof File ? URL.createObjectURL(image) : image}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={imageType === "image" ? 1 : 16 / 9}
              guides={false}
              ref={cropperRef}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={cancelCrop} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={loading}
                onClick={completeCrop}
                className="bg-purple-800 text-gray-200 hover:bg-purple-800"
              >
                {
                  loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Crop Image"
                  )
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

