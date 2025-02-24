"use client"

import type { NextPage } from "next"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { ErrorMessage, Layout, LoadingMessage, ProfileHeader } from "~/Components/Components"
import AnnouncementButton from "~/Components/Buttons/AnnoucementButton"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Textarea } from "~/Components/ui/textarea"
import { Button } from "~/Components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { TRPCClientError } from "@trpc/client"
import { Card, CardContent, CardHeader, CardTitle } from "~/Components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/Components/ui/avatar"
import moment from "moment"

const ProfileAnnouncements: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data: sessionData } = useSession()
  const [announcementInput, setAnnouncementInput] = useState("")
  const [loading, setLoading] = useState(false)

  const addAnnouncementMutation = api.announcement.addAnnouncement.useMutation()
  const addAnnouncement = async (input: { userId: string; message: string }) => {
    try {
      await addAnnouncementMutation.mutateAsync(input)
      setAnnouncementInput("")
      void refetch()
      toast.success("Announcement posted successfully!")
    } catch (error) {
      if (error instanceof TRPCClientError) {
        try {
          const parsedError = JSON.parse(error.message)
          const errorMessage = parsedError[0]?.message || "An error occurred.Please try again"
          console.log(parsedError)
          toast.error(errorMessage)
        } catch (parseError) {
          toast.error("Something went wrong, please try again.")
        }
      } else {
        toast.error("Something went wrong, please try again.")
      }
    }
  }

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await addAnnouncement({
      userId: sessionData ? sessionData.user.id : ("none" as string),
      message: announcementInput,
    })
    setLoading(false)
  }

  const { data, isLoading, error, refetch } = api.announcement.getAnnoucementsByUserId.useQuery({
    id: userId as string,
    viewerId: sessionData?.user.id,
  })

  const announcements = data?.annoucements
  const errorTypes = error || announcements?.length == 0 || !data

  return (
    <Layout>
      <>
        <ProfileHeader />
        {errorTypes ? (
          <ErrorMessage
            icon={userId == sessionData?.user.id ? "Bell" : "Users"}
            message="No Announcement yet"
            description={
              userId == sessionData?.user.id
                ? "You have yet to announce . Follow announce now!"
                : "This user has yet to announce."
            }
          />
        ) : (
          <Card className="bg-gray-800 bg-opacity-50 text-gray-300 border border-gray-400 shadow-md backdrop-blur-md  rounded-2xl">
            <CardHeader>
              <CardTitle className="text-gray-400">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {userId == sessionData?.user.id && (
                <form onSubmit={handleAnnouncementSubmit} className="mb-6 space-y-4">
                  <Textarea
                    rows={3}
                    name="announcement"
                    id="announcement"
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    className="w-full border border-gray-500 bg-gray-900 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-gray-700 rounded-lg p-2"
                    placeholder="What would you like to announce?"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="bg-purple-800 text-gray-300 hover:bg-purple-700 transition-all rounded-lg px-4 py-2 shadow-md backdrop-blur-md hover:scale-105 hover:shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Announcement"
                    )}
                  </Button>
                </form>
              )}
              {errorTypes ? (
                <ErrorMessage icon="Bell" message="No Announcements" description="No announcements available." />
              ) : (
                <ul className="space-y-6">
                  {announcements
                    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((announcement, index) => {
                      const user = data?.user[index]
                      if (!user) return null
                      return (
                        <li key={announcement.id} className="border-t border-gray-500 pt-6 first:border-t-0 first:pt-0">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10 border border-gray-500">
                              <AvatarImage src={user.image || ""} alt={user.name || ""} />
                              <AvatarFallback className="bg-gray-800 text-gray-300">
                                {user.name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-400">{user.name}</p>
                                  <p className="text-xs text-gray-300">@{user.handle}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {moment(announcement.createdAt).fromNow()}
                                </p>
                              </div>
                              <p className="text-sm text-gray-300">{announcement.message}</p>
                              <div className="pt-2">
                                <AnnouncementButton
                                  EngagementData={{
                                    id: announcement.id,
                                    likes: announcement.likes,
                                    dislikes: announcement.dislikes,
                                  }}
                                  viewer={{
                                    hasDisliked: announcement.viewer.hasDisliked,
                                    hasLiked: announcement.viewer.hasLiked,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </>
    </Layout>
  )
}

export default ProfileAnnouncements