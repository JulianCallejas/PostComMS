"use client"

import { PostFormValues, postSchema } from "@/schemas/post-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { usePostStore } from "@/stores/post-store"


export default function CreatePostForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createPost } = usePostStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
    })

    const onSubmit = async (data: PostFormValues) => {

        setIsSubmitting(true)
        try {
            await createPost(data.content)
            reset()
            toast.success("Tu publicación ha sido creada correctamente");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al crear la publicación");
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-bold">Nueva publicación</h2>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="mb-4">
                    <Textarea placeholder="¿Qué estás pensando?" {...register("content")} rows={4} className="resize-none" />
                    {errors.content && <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publicando...
                            </>
                        ) : (
                            "Publicar"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

