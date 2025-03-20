'use client'

import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
    const { isAuthenticated } = useAuthStore() 
    const router = useRouter()

  if (!isAuthenticated) {
    router.replace("/login")
  }
  

  return (
    <>
      <main className="container mx-auto py-6 px-4">{children}</main>
    </>
  )
}

