import z from "zod";

export const CreateMessageValidation = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(1000, "La description ne peut pas dépasser 1000 caractères"),
    roomId: z.string().min(1, "La salle est requise"),
    studentMail: z.string().email("L'adresse email est invalide"),
});
