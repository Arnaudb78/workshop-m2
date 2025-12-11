import z from "zod";

export const CreateRoomValidation = z.object({
    name: z.string().min(1, "Le nom de la pièce est requis"),
    floor: z.number().int().min(0).max(5),
    position: z.number().int().min(1).max(5),
    description: z.string().optional(),
    isUsed: z.boolean().default(false),
    sensorId: z.string().nullable().optional(),
});
