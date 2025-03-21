import { z } from "zod"

export const postSchema = z.object({
  content: z.string().min(1, "El contenido es requerido").max(280, "El contenido no puede exceder los 280 caracteres"),
})

export type PostFormValues = z.infer<typeof postSchema>

