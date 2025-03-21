"use client"

import { ProfileFormValues, profileSchema } from "@/schemas/profile-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { useAuthStore } from "@/stores/auth-store"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useUserStore } from "@/stores/user-store"
import { toast } from "sonner"


export default function ProfileForm() {

    const [isUpdating, setIsUpdating] = useState(false)
    const { user } = useAuthStore()
    const { profile, loading, updateProfile, getProfile } = useUserStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.name || "",
            bio: profile?.bio || "",
        },
    })

    useEffect(() => {
        getProfile()
    }, [getProfile])


    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                bio: profile.bio || "",
            })
        }
    }, [profile, reset])


    const onSubmit = async (data: ProfileFormValues) => {

        setIsUpdating(true)
        try {
            await updateProfile(data)
            toast.success("Tu perfil ha sido actualizado correctamente")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al actualizar el perfil")
        } finally {
            setIsUpdating(false)
        }

    }

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <Card className="animate-fade" >
            <CardHeader>
                <CardTitle>{user?.username || ""}</CardTitle>
                <CardDescription>{user?.email || ""}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea id="bio" {...register("bio")} rows={4} className="resize-none" />
                        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            "Guardar cambios"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

