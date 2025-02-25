import type { NextPage } from "next"
import Head from "next/head"
import { Layout } from "../Components/Components"
import { useSession } from "next-auth/react"
import { Button } from "~/Components/ui/button"
import Image from "next/image"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ImageCropper } from "~/Components/Buttons/EditButton"
import { api } from "~/utils/api"
import { env } from "~/env.mjs"
import { Input } from "~/Components/ui/input"
import { Textarea } from "~/Components/ui/textarea"
import { Label } from "~/Components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "~/Components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import Loader from "~/Components/ui/loader"

const Settings: NextPage = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.id
  const addUserUpdateMutation = api.user.updateUser.useMutation()
  const { data, refetch } = api.user.getChannelById.useQuery({
    id: userId as string,
  })
  const [loading, setLoading] = useState(false)
  const channel = data?.user
  const [user, setUser] = useState({
    name: "",
    email: "",
    handle: "",
    description: "",
  })

  useEffect(() => {
    if (channel) {
      setUser({
        name: channel.name || "",
        email: channel.email || "",
        handle: channel.handle || "",
        description: channel.description || "",
      })
    }
  }, [channel])

  if (!channel) {
    return <div className="text-gray-200">Channel not loading</div>
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }))
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const userData = {
      id: channel.id,
      name: channel.name || undefined,
      email: channel.email,
      handle: channel.handle || undefined,
      image: channel.image || undefined,
      backgroundImage: channel.backgroundImage || undefined,
      description: channel.description || undefined,
    }

    if (
      user.name !== channel.name ||
      user.description !== channel.description ||
      user.handle !== channel.handle ||
      user.email !== channel.email
    ) {
      const newUserData = {
        ...userData,
      }
      if (user.name && user.name !== channel.name) newUserData.name = user.name
      if (user.description && user.description !== channel.description) newUserData.description = user.description
      if (user.handle && user.handle !== channel.handle) newUserData.handle = user.handle
      if (user.email && user.email !== channel.email) newUserData.email = user.email

      if (!user.name || !user.handle || !user.email) {
        return toast.error("Name and handle are required")
      }

      addUserUpdateMutation.mutate(newUserData, {
        onSuccess: () => {
          toast.success("Profile updated")
          void refetch()
          setLoading(false)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }
  }

  return (
    <>
      <Head>
        <title>Krysonix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={false}>
        <>
          <div>
            <CropImageModal
              channel={{
                id: channel.id || "",
                image: channel.image || "",
                backgroundImage: channel.backgroundImage || "",
              }}
              refetch={refetch}
              imageType="backgroundImage"
            />

            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                <div className="flex">
                  <CropImageModal
                    channel={{
                      id: channel.id || "",
                      image: channel.image || "",
                      backgroundImage: channel.backgroundImage || "",
                    }}
                    refetch={refetch}
                    imageType="image"
                  />
                </div>
                <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
                    <h1 className="truncate text-2xl font-bold text-gray-200">{channel.name}</h1>
                    <p className="text-gray-400">{channel.handle}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <Card className="bg-gray-950 text-gray-200">
              <CardHeader>
                <CardTitle>Personal Info</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <Label htmlFor="name" className="text-gray-300">
                        Name
                      </Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={user.name || ""}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-gray-200 border-gray-600"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <Label htmlFor="email" className="text-gray-300">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        disabled
                        type="email"
                        value={user.email || ""}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-gray-200 border-gray-600"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 text-gray-200">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <Label htmlFor="handle" className="text-gray-300">
                        Handle
                      </Label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <Input
                          type="text"
                          name="handle"
                          id="handle"
                          value={user.handle || ""}
                          onChange={handleInputChange}
                          className="rounded-l-none bg-gray-700 text-gray-200 border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <Label htmlFor="description" className="text-gray-300">
                        About
                      </Label>
                      <div className="mt-2">
                        <Textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={user.description || ""}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-gray-200 border-gray-600"
                        />
                      </div>
                      <p className="mt-3 text-sm text-gray-400">Write a few sentences about yourself.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSubmit} className="bg-purple-800 text-gray-200 hover:bg-purple-800">
                      {loading ? <><Loader state></Loader></> : <>Save</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      </Layout>
    </>
  )
}

// Interface for CropImageModal props
interface CropImageModalProps {
  channel: {
    id: string
    image?: string
    backgroundImage?: string
  }
  refetch: () => Promise<unknown>
  imageType: "backgroundImage" | "image"
}

function CropImageModal({ channel, refetch, imageType }: CropImageModalProps) {
  const [image, setImage] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const addUserUpdateMutation = api.user.updateUser.useMutation()
  const [loading, setLoading] = useState(false)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && (e.target.files[0]?.type.includes("image") || e.target.files[0]?.type.includes("img")) && e.target.files[0].size < 5242880) {
      setImage(e.target.files[0] ? e.target.files[0] : null)
      setOpen(true)
    } else {
      if (!e.target.files) return
      toast.error("Invalid file type")
    }
  }

  const handleSubmitA = async (croppedDataUrl: string) => {
    const userData = {
      id: channel?.id,
      [imageType]: channel[imageType] || undefined,
    }
    if (image) {
      setLoading(true);
      const ImageData = {
        userId: userData.id ,
        fileType: image?.type,
        fileName: imageType === "backgroundImage" ? "coverImage" : "profileImage",
      }
      try {
        const resp = await fetch(`/api/${env.NEXT_PUBLIC_CDN_LINK}`, {
          method: "POST",
          body: JSON.stringify(ImageData),
        })

        const { signedUrl } = await resp.json()

        if (!signedUrl) {
          return toast.error("Error uploading image")
        }

        const blob = await fetch(croppedDataUrl).then((r) => r.blob())

        await axios.put(signedUrl, blob, {
          headers: {
            "Content-Type": image.type
          }
        })
        const url = new URL(signedUrl);
        const imageUrl = url.origin + url.pathname + "?v=" + Date.now();
        userData[imageType] = imageUrl
      } catch (err) {
        toast.error("An error occurred while changing the image")
      }
    }
    addUserUpdateMutation.mutate(userData, {
      onSuccess: () => {
        setOpen(false)
        void refetch()
        setLoading(false);
        toast.success("Image updated successfully")
      },
    })
  }

  return (
    <>
      {imageType === "image" ? (
        <label htmlFor="file-upload-image" className="cursor-pointer">
          <input id="file-upload-image" name="image" type="file" className="sr-only" onChange={onFileChange} />
          <Image
            className="h-24 w-24 rounded-full ring-4 ring-gray-800 sm:h-32 sm:w-32"
            width={128}
            height={128}
            src={channel?.image || "/profile.jpg"}
            alt="Profile"
          />
        </label>
      ) : (
        <label htmlFor="file-upload-backgroundImage" className="cursor-pointer">
          <input
            id="file-upload-backgroundImage"
            name="backgroundImage"
            type="file"
            className="sr-only"
            onChange={onFileChange}
          />
          <Image
            className="h-32 w-full object-cover lg:h-64"
            src={channel.backgroundImage || "/background.jpg"}
            width={1024}
            height={256}
            alt="Background"
          />
        </label>
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
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
                {!loading ? <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <ImageCropper
                    setCroppedImage={setCroppedImage}
                    image={image}
                    imageType={"backgroundImage"}
                    handleSubmit={handleSubmitA}
                    setOpen={setOpen}
                  />
                </Dialog.Panel> : (
                  <Loader state />
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Settings

