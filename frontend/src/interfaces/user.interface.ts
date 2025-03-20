export interface User {
    username: string
    email: string
  }
  
  export interface UserProfile {
    id: string
    email: string
    username: string
    name: string | null
    bio: string | null
    createdAt: string
  }