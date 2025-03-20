import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Ingrese un email válido"),
    password: z.string().nonempty("Ingrese una contraseña"),
  })