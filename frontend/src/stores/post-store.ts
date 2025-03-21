"use client"

import { create } from "zustand"
import { PostService } from "../services/post-service"
import { Post } from "@/interfaces/post.interface"


interface PostState {
  posts: Post[]
  myPosts: Post[]
  loading: boolean
  error: string | null
  getPosts: () => Promise<void>
  getMyPosts: () => Promise<void>
  createPost: (content: string) => Promise<void>
  updatePost: (id: string, content: string) => Promise<void>
  likePost: (id: string) => Promise<void>
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  myPosts: [],
  loading: false,
  error: null,
  getPosts: async () => {
    set({ loading: true, error: null })
    try {
      const posts = await PostService.getPosts()
      set({ posts, loading: false })
    } catch (error) {
      if (error) 
        set({ error: "Failed to fetch posts", loading: false })
    }
  },
  getMyPosts: async () => {
    set({ loading: true, error: null })
    try {
      const myPosts = await PostService.getMyPosts()
      set({ myPosts, loading: false })
    } catch (error) {
        if (error) 
        set({ error: "Failed to fetch my posts", loading: false })
    }
  },
  createPost: async (content) => {
    set({ loading: true, error: null })
    try {
      const newPost = await PostService.createPost(content)
      set((state) => ({
        myPosts: [newPost, ...state.myPosts],
        posts: [newPost, ...state.posts],
        loading: false,
      }))
    } catch (error) {
        if (error) 
        set({ error: "Failed to create post", loading: false })
    }
  },
  updatePost: async (id, content) => {
    set({ loading: true, error: null })
    try {
      const updatedPost = await PostService.updatePost(id, content)
      set((state) => ({
        myPosts: state.myPosts.map((post) => (post.id === id ? updatedPost : post)),
        posts: state.posts.map((post) => (post.id === id ? updatedPost : post)),
        loading: false,
      }))
    } catch (error) {
        if (error) 
        set({ error: "Failed to update post", loading: false })
    }
  },
  likePost: async (id) => {
    try {
      await PostService.likePost(id)
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? { ...post, _count: { likes: post._count.likes + 1 } } : post,
        ),
        myPosts: state.myPosts.map((post) =>
          post.id === id ? { ...post, _count: { likes: post._count.likes + 1 } } : post,
        ),
      }))
    } catch (error) {
        if (error) 
        set({ error: "Failed to like post" })
    }
  },
}))

