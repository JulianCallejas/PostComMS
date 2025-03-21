"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { AuthService } from "@/services/auth-service"
import { setAxiosToken } from "@/services/axios"
import axios from "axios"
import { User } from "@/interfaces/user.interface"
import { validToken } from "@/actions/protected-route-guard"

interface AuthState {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, username: string) => Promise<void>
    logout: () => void
    refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: async (email, password) => {
                try {
                    const response = await AuthService.login(email, password)
                    console.log(response);
                    set({
                        token: response.token,
                        user: {
                            username: response.username,
                            email: response.email,
                        },
                        isAuthenticated: await validToken(response.token),
                    })
                    setAxiosToken(response.token)
                    document.cookie = `token=${response.token}; max-age=99999999; path=/; samesite=lax`
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw new Error(error.response?.data?.message || "Error al iniciar sesión")
                    }
                    throw error
                }
            },
            register: async (email, password, username) => {
                try {
                    const response = await AuthService.register(email, password, username)
                    set({
                        token: response.token,
                        user: {
                            username: response.username,
                            email: response.email,
                        },
                        isAuthenticated: true,
                    })
                    setAxiosToken(response.token)
                    document.cookie = `token=${response.token}; max-age=99999999; path=/; samesite=lax`
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw new Error(error.response?.data?.message || "Error al registrarse")
                    }
                    throw error
                }
            },
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                })
                setAxiosToken(null)
                document.cookie = `token=""; max-age=99999999; path=/; samesite=lax`
            },
            refreshToken: async () => {
                try {
                    const response = await AuthService.refreshToken()
                    set(() => ({
                        token: response.token,
                        isAuthenticated: true,
                    }))
                    setAxiosToken(response.token)
                    document.cookie = `token=${response.token}; max-age=99999999; path=/; samesite=lax`
                } catch (error) {
                    set({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                    })
                    setAxiosToken(null)
                    document.cookie = `token=""; max-age=99999999; path=/; samesite=lax`
                    throw error
                }
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

// Initial token
if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("auth-storage")
    if (storedAuth) {
        try {
            const { state } = JSON.parse(storedAuth)
            
            if (state.token) {
                setAxiosToken(state.token)
                document.cookie = `token=${state.token}; max-age=99999999; path=/; samesite=lax`
            }
        } catch (error) {
            console.error("Error parsing auth storage:", error)
        }
    }
}

