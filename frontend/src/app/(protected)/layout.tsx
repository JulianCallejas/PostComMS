"use server"

import React from "react"
import Navbar from "@/components/ui/navbar";
import { protectRoute } from "@/actions/protected-route-guard";
import { redirect } from "next/navigation";


export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const isAuthorized = await protectRoute();
    if (!isAuthorized) {
        redirect('/login')
    }

    return (
        <>
            <main className="container mx-auto py-6 px-4">
                <Navbar />
                {children}
            </main>
        </>
    )
}

