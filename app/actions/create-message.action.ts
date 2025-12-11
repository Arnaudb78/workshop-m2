"use server";

import { connectToDatabase } from "@/lib/database";
import { CreateMessageValidation } from "@/utils/validations/create-message.validation";
import Message from "@/models/message";
import { Types } from "mongoose";

type CreateMessagePayload = {
    title: string;
    description: string;
    roomId: string;
    studentMail: string;
};

export async function CreateMessageAction(payload: CreateMessagePayload) {
    const validation = CreateMessageValidation.safeParse(payload);
    if (!validation.success) {
        return {
            success: false,
            message: validation.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") || "Erreur lors de la validation.",
        };
    }

    try {
        await connectToDatabase();

        if (!Types.ObjectId.isValid(payload.roomId)) {
            return {
                success: false,
                message: "L'identifiant de la salle est invalide.",
            };
        }

        const createdDoc = await Message.create({
            title: payload.title,
            description: payload.description,
            studentMail: payload.studentMail,
            roomId: new Types.ObjectId(payload.roomId),
        });

        const createdJson = (createdDoc as any).toJSON({ versionKey: false });
        const created = { ...createdJson, _id: (createdDoc as any)._id.toString() };

        return {
            success: true,
            data: created,
        };
    } catch (error) {
        console.error("[CreateMessageAction] error creating message", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de l'envoi du message.",
        };
    }
}
