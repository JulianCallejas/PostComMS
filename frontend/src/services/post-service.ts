import { Post } from "@/interfaces/post.interface"
import { ApiClient } from "./axios"

export class PostService {
  static async getPosts(): Promise<Post[]> {
    return ApiClient.get<Post[]>("/posts")
  }

  static async getMyPosts(): Promise<Post[]> {
    return ApiClient.get<Post[]>("/posts/my-posts")
  }

  static async createPost(content: string): Promise<Post> {
    return ApiClient.post<Post>("/posts", { content })
  }

  static async updatePost(id: string, content: string): Promise<Post> {
    return ApiClient.put<Post>(`/posts/${id}`, { content })
  }

  static async likePost(id: string): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(`/posts/${id}/like`)
  }
}

