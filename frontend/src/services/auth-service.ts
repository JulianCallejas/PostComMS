import { ApiClient } from "./axios"


interface AuthResponse {
  token: string
  username: string
  email: string
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>("/auth/login", { email, password })
  }

  static async register(email: string, password: string, username: string): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>("/auth/register", {
      email,
      password,
      username,
    })
  }

  static async refreshToken(): Promise<{ token: string }> {
    return ApiClient.post<{ token: string }>("/auth/refresh")
  }
}
