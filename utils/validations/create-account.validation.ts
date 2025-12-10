import z from "zod";

const AccessLevelEnumValidation = z.enum([
    "ADMIN",
    "STUDENT",
]);

export const CreateAccountValition = z.object({
    name: z.string().min(3),
    lastname: z.string().min(3),
    mail: z.email(),
    password: z.string().min(2, "Le mot de passe doit contenir au moins 8 caractères"),
    accessLevel: AccessLevelEnumValidation,
});