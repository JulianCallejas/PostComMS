export interface Author {
    id: string
    username: string
    name: string
  }
  
  export interface Post {
    id: string
    content: string
    authorId: string
    createdAt: string
    updatedAt: string
    author: Author
    _count: {
      likes: number
    }
  }
  
  