"use client";

import type { NextPage } from "next";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  ErrorMessage,
  Layout,
  LoadingMessage,
  ProfileHeader,
} from "~/Components/Components";
import AnnouncementButton from "~/Components/Buttons/AnnoucementButton";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Textarea } from "~/Components/ui/textarea";
import { Button } from "~/Components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/Components/ui/avatar";
import moment from "moment";

const ProfileAnnouncements: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  const [announcementInput, setAnnouncementInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addAnnouncementMutation =
    api.announcement.addAnnouncement.useMutation();
  const addAnnouncement = async (input: {
    userId: string;
    message: string;
  }) => {
    try {
      await addAnnouncementMutation.mutateAsync(input);
      setAnnouncementInput("");
      void refetch();
      toast.success("Announcement posted successfully!");
    } catch (error) {
      if (error instanceof TRPCClientError) {
        try {
          const parsedError = JSON.parse(error.message);
          const errorMessage =
            parsedError[0]?.message || "An error occurred.Please try again";
          toast.error(errorMessage);
        } catch (parseError) {
          toast.error("Something went wrong, please try again.");
        }
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addAnnouncement({
      userId: sessionData ? sessionData.user.id : ("none" as string),
      message: announcementInput,
    });
    setLoading(false);
  };

  const { data, isLoading, error, refetch } =
    api.announcement.getAnnoucementsByUserId.useQuery({
      id: userId as string,
      viewerId: sessionData?.user.id,
    });

  const announcements = data?.annoucements;
  const errorTypes = error || announcements?.length == 0 || !data;

  if (!sessionData) {
    return <div className="h-full w-screen flex items-center justify-center text-center text-red-500">
      Not authorised
    </div>
  }

  return (
    <Layout>
      <>
        <ProfileHeader />
        <Card className="rounded-2xl border border-gray-400 bg-gray-800 bg-opacity-50 text-gray-300 shadow-md  backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-gray-200">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {userId == sessionData.user.id && (
              <form
                onSubmit={handleAnnouncementSubmit}
                className="mb-6 space-y-4"
              >
                <Textarea
                  rows={3}
                  name="announcement"
                  id="announcement"
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-500 bg-zinc-900 p-2 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-gray-700"
                  placeholder="What would you like to announce?"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="rounded-lg bg-purple-800 px-4 py-2 text-gray-300 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-purple-700 hover:shadow-lg"
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
              <ErrorMessage
                icon={userId == sessionData?.user.id ? "Bell" : "Users"}
                message="No Announcement yet"
                description={
                  userId == sessionData.user.id
                    ? "You have yet to announce . Announce now!"
                    : "This user has yet to announce."
                }
              />
            ) : (
              <ul className="space-y-6">
                {announcements
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((announcement, index) => {
                    const user = data?.user[index];
                    if (!user) return null;
                    return (
                      <li
                        key={announcement.id}
                        className="border-t border-gray-500 pt-6 first:border-t-0 first:pt-0"
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10 border border-gray-500">
                            <AvatarImage
                              src={user.image || ""}
                              alt={user.name || ""}
                            />
                            <AvatarFallback className="bg-zinc-800 text-gray-200">
                              {user.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-300">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-200">
                                  @{user.handle}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {moment(announcement.createdAt).fromNow()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-100">
                              {announcement.message}
                            </p>
                            <div className="pt-2">
                              <AnnouncementButton
                                EngagementData={{
                                  id: announcement.id,
                                  likes: announcement.likes,
                                  dislikes: announcement.dislikes,
                                }}
                                viewer={{
                                  hasDisliked:
                                    announcement.viewer.hasDisliked,
                                  hasLiked: announcement.viewer.hasLiked,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </CardContent>
        </Card>
      </>
    </Layout>
  );
};

export default ProfileAnnouncements;
