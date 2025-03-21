"use client"

import { PostFormValues, postSchema } from "@/schemas/post-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"


export default function CreatePostForm() {
  
    const [isSubmitting, setIsSubmitting] = useState(false)
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  })

  const onSubmit = async (data: PostFormValues) => {
  
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold">Nueva publicación</h2>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="mb-4">
          <Textarea placeholder="¿Qué estás pensando?" {...register("content")} rows={4} className="resize-none"/>
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

