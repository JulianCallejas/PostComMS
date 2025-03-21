"use client"

import { create } from "zustand"
import { UserService } from "../services/user-service"
import { UserProfile } from "@/interfaces/user.interface"

interface UserState {
    profile: UserProfile | null
    loading: boolean
    error: string | null
    getProfile: () => Promise<void>
    updateProfile: (data: { name: string; bio: string }) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
    profile: null,
    loading: false,
    error: null,
    getProfile: async () => {
        set({ loading: true, error: null })
        try {
            const profile = await UserService.getProfile()
            set({ profile, loading: false })
        } catch (error) {
            if (error)
                set({ error: "Failed to fetch profile", loading: false })
        }
    },
    updateProfile: async (data) => {
        set({ loading: true, error: null })
        try {
            const profile = await UserService.updateProfile(data)
            set({ profile, loading: false })
        } catch (error) {
            if (error)
                set({ error: "Failed to update profile", loading: false })
        }
    },
}))

