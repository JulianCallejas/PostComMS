"use client"

import { useEffect } from "react"


import { Loader2 } from "lucide-react"
import PostItem from "./post-item"
import { usePostStore } from "@/stores/post-store"

interface PostsListProps {
  myPostsOnly?: boolean
}

export default function PostsList({myPostsOnly}: PostsListProps) {
  const { posts, myPosts, loading, getPosts, getMyPosts } = usePostStore()

  useEffect(() => {
    if (myPostsOnly) {
      getMyPosts()
    } else {
      getPosts()
    }
  }, [myPostsOnly, getPosts, getMyPosts])

  return (
    <>
     
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No hay publicaciones disponibles</p>
        ) : (
            myPostsOnly 
            ? myPosts.map((post) => <PostItem key={post.id} post={post} />)
            : posts.map((post) => <PostItem key={post.id} post={post} />)
        )}
       
    </>
  )
}
