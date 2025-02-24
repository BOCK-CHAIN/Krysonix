import type { NextPage } from "next"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { ErrorMessage, Layout, LoadingMessage, ProfileHeader, UserImage } from "~/Components/Components"
import { Button } from "~/Components/ui/button"
import { useSession } from "next-auth/react"
import { Loader2, UserIcon, UsersIcon } from 'lucide-react'
import { toast } from "sonner"
import { useState } from "react"

const ProfileFollowings: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const { data: sessionData } = useSession()
  const [loading, setLoading] = useState(false)
  const unfollowUser = api.user.unfollowUser.useMutation()

  const {
    data: user,
    isLoading,
    error,
    refetch
  } = api.user.getUserFollowings.useQuery({
    id: userId as string,
    viewerId: sessionData?.user.id,
  })

  const errorTypes = !user?.followings || error || user?.followings?.length === 0

  if (isLoading) return <LoadingMessage />

  return (
    <Layout>
      <>
        <ProfileHeader />
        {errorTypes ? (
          <ErrorMessage
            icon={userId == sessionData?.user.id ? "Bell" : "Users"}
            message="No people followed"
            description={
              userId == sessionData?.user.id
                ? "You have yet to follow anyone else. Follow someone now!"
                : "This user has yet to follow anyone."
            }
          />
        ) : (
          <div className="w-full space-y-4 px-4 flex flex-col items-center justify-center">
            {user?.followings.map((following) => (
              <div
                key={following.following.id}
                className="flex w-full items-center justify-between rounded-2xl bg-gray-800 bg-opacity-50 p-4 shadow-md backdrop-blur-md transition-all hover:bg-opacity-70"
              >
                <div className="flex items-center space-x-4">
                  <UserImage className="h-12 w-12 rounded-full border border-indigo-400" image={following.following?.image} />
                  <div>
                    <p className="font-semibold text-indigo-400">{following.following.name}</p>
                    <p className="text-sm text-indigo-300">@{following.following?.handle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1 text-sm text-indigo-400">
                    <UserIcon size={16} />
                    <span>{following.following.followers.length || 0}</span>
                  </div>
                  <Button
                    variant={following.viewerHasFollowed ? "secondary" : "default"}
                    size="sm"
                    onClick={async () => {
                      setLoading(true)
                      await unfollowUser.mutateAsync({ followingId: following.following.id, followerId: following.followerId })
                      void refetch();
                      toast.success(`Unfollowed ${following.following.name}.`)
                      setLoading(false)
                    }}
                    className={`transition-all rounded-lg px-4 py-2 text-indigo-300 shadow-md backdrop-blur-md hover:scale-105 hover:shadow-lg 
                      ${following.viewerHasFollowed ? "bg-gray-700 hover:bg-gray-600" : "bg-indigo-800 hover:bg-indigo-700"}`}
                  >
                    {loading ? <> <Loader2></Loader2> </> :
                      <>
                        {following.viewerHasFollowed ? "Unfollow" : "Follow"}
                      </>
                    }
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>

    </Layout>
  )
}

export default ProfileFollowings