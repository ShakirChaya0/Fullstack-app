import z from 'zod'

export const AuthSchema = z.object({
    email: z.string({ required_error: "El email es obligatorio" }).email('El email debe ser válido').nonempty("El email no puede estar vacía"),
    password: z.string({ required_error: "La contraseña es obligatoria" }).nonempty("La contraseña no puede estar vacía")
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;

export function ValidateAuth(data: AuthSchemaType){
    return AuthSchema.safeParse(data)
}