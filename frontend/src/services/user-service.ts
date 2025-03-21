import { UserProfile } from "@/interfaces/user.interface"
import { ApiClient } from "./axios"

export class UserService {
    static async getProfile(): Promise<UserProfile> {
      return ApiClient.get<UserProfile>("/users/profile")
    }
  
    static async updateProfile(data: {
      name: string
      bio: string
    }): Promise<UserProfile> {
      return ApiClient.put<UserProfile>("/users/profile", data)
    }
  }
  
  