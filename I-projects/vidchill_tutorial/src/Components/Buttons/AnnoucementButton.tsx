import { api } from "~/utils/api"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "~/Components/ui/button"
import { cn } from "~/lib/utils"
import { useEngagementButton } from "~/Hooks/useEngagement"

interface AnnouncementButtonProps {
  EngagementData: {
    id: string
    likes: number
    dislikes: number
  }
  viewer: {
    hasLiked: boolean
    hasDisliked: boolean
  }
}

export default function AnnouncementButton({ EngagementData, viewer }: AnnouncementButtonProps) {
  const { likeCount, dislikeCount, userChoice, handleLike, handleDislike } = useEngagementButton({
    EngagementData,
    viewer,
    addLikeMutation: api.announcement.addLikeAnnouncement.useMutation(),
    addDislikeMutation: api.announcement.addDislikeAnnouncement.useMutation(),
  })

  const { data: sessionData } = useSession()

  return (
    <div className="inline-flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={
          sessionData
            ? () =>
                handleLike({
                  id: EngagementData ? EngagementData.id : "",
                  userId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className={cn(
          "rounded-full",
          userChoice.like
            ? "bg-neutral-800 text-blue-400 hover:bg-neutral-700 hover:text-blue-300"
            : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300",
        )}
      >
        <ThumbsUp className={cn("mr-2 h-4 w-4", userChoice.like ? "fill-current" : "stroke-current")} />
        {likeCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={
          sessionData
            ? () =>
                handleDislike({
                  id: EngagementData ? EngagementData.id : "",
                  userId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className={cn(
          "rounded-full",
          userChoice.dislike
            ? "bg-neutral-800 text-red-400 hover:bg-neutral-700 hover:text-red-300"
            : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300",
        )}
      >
        <ThumbsDown className={cn("mr-2 h-4 w-4", userChoice.dislike ? "fill-current" : "stroke-current")} />
        {dislikeCount}
      </Button>
    </div>
  )
}

