"use client"

import Link from "next/link"
import { UserCircle, MessageSquare, LogOut } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/stores/auth-store"
import { redirect } from "next/navigation"

export default function Navbar() {

    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout();
        redirect('/login')
    }

    return (
        <nav className="border-b bg-card rounded-b-lg mb-6">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/posts" className="text-xl font-bold">
                    <Image src="/img/logo100.webp" alt="Logo" width={85} height={85} />
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/posts">
                        <MessageSquare className="h-5 w-5 md:h-7 md:w-7" />
                    </Link>
                    <Link href="/profile">
                        <UserCircle className="h-5 w-5 md:h-7 md:w-7" />
                    </Link>
                    <button type="button" onClick={handleLogout} className="hover:cursor-pointer">
                        <LogOut className="h-5 w-5 md:h-7 md:w-7" />
                    </button>
                </div>
            </div>
        </nav>
    )
}

