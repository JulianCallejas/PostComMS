"use client"

import { Post } from "@/interfaces/post.interface"
import { usePostStore } from "@/stores/post-store"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface PostItemProps {
  post: Post
}

export default function PostItem({ post }: PostItemProps) {
  const { likePost } = usePostStore()
  

  const handleLike = async () => {
    try {
      await likePost(post.id)
    } catch (error) {
      toast( error instanceof Error ? error.message : "Error al dar like");
    }
  }

  return (
    <Card className="mb-4 animate-fade">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{post.author.name || post.author.username}</p>
            <p className="text-sm text-muted-foreground">@{post.author.username}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={handleLike}>
          <Heart className={`h-4 w-4 mr-1 transition-all ${post.isLiked && "text-red-600 fill-red-800"}`}  />
          {post._count.likes}
        </Button>
      </CardFooter>
    </Card>
  )
}

