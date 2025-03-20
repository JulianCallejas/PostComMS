import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Ingrese un email válido"),
    password: z.string().nonempty("Ingrese una contraseña"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Ingrese un email válido"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .refine(
            (value) => /[a-zA-Z]/.test(value) && /[0-9]/.test(value),
            "La contraseña debe contener al menos una letra y un número",
        ),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
