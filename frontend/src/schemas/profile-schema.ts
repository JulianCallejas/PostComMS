import { z } from "zod"

export const profileSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    bio: z.string().max(160, "La biografía no puede exceder los 160 caracteres"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

