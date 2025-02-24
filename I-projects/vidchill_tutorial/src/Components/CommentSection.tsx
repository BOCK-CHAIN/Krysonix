import { api } from "~/utils/api"
import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "~/Components/ui/button"
import { Textarea } from "~/Components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/Components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/Components/ui/avatar"
import moment from "moment"
import { toast } from "sonner"
import Loader from "./ui/loader"

interface Comment {
  comment: {
    id: string
    message: string
    createdAt: Date
  }
  user: {
    id: string
    name: string | null
    image: string | null
    handle: string | null
  }
}

interface CommentSectionProps {
  videoId: string
  comments: Comment[]
  refetch: () => Promise<unknown>
}

export default function CommentSection({ videoId, comments, refetch }: CommentSectionProps) {
  const [commentInput, setCommentInput] = useState("")
  const addCommentMutation = api.comment.addComment.useMutation()
  const { data: sessionData } = useSession()
  const [loading, setLoading] = useState(false)

  if (!videoId) {
    return <div className="text-neutral-400">Loading...</div>
  }

  const addComment = async (input: {
    videoId: string
    userId: string
    message: string
  }) => {
    setLoading(true)
    await addCommentMutation.mutateAsync(input, {
      onSuccess: () => {
        void refetch()
        setCommentInput("")
      },
    })
    setLoading(false)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sessionData?.user.id) {
      addComment({
        videoId: videoId,
        userId: sessionData.user.id,
        message: commentInput,
      })
    }
  }

  return (
    <Card className="bg-neutral-900 text-neutral-300 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-200">{comments.length} Comments</CardTitle>
      </CardHeader>
      <CardContent>
        {sessionData ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              rows={2}
              name="comment"
              id="comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="mb-2 bg-neutral-800 text-neutral-300 border-neutral-700 focus:ring-neutral-500 rounded-lg"
              placeholder="Add a comment..."
            />
            <Button type="submit" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
              {loading ? <> <Loader state />  </> : <> Post </>}
            </Button>
          </form>
        ) : (
          <Button onClick={() => void signIn()} className="w-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
            Sign in to comment
          </Button>
        )}
        {comments
          .sort((a, b) => new Date(b.comment.createdAt).getTime() - new Date(a.comment.createdAt).getTime())
          .map(({ user, comment }) => (
            <div key={comment.id} className="mb-4 border-t border-neutral-700 pt-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-neutral-700 text-neutral-300">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-neutral-200">{user.name}</p>
                    <span className="text-xs text-neutral-400">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">{user.handle}</p>
                  <p className="text-sm text-neutral-300">{comment.message}</p>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
