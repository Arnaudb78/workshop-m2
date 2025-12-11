import z from "zod";

export const CreateRoomValidation = z.object({
    name: z.string().min(1, "Le nom de la pièce est requis"),
    floor: z.number().int().min(0).max(6),
    position: z.number().int().min(1).max(5),
    description: z.string().optional(),
    type: z.enum(["ADMIN", "STUDENT"], {
        message: "Le type de salle est requis",
    }),
    isUsed: z.boolean().default(false),
    sensorId: z.string().nullable().optional(),
    size: z.number().int().min(1).default(70).optional(),
});
