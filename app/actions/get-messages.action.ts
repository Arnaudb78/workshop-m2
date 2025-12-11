"use server";

import { connectToDatabase } from "@/lib/database";
import Message from "@/models/message";
import Room from "@/models/room";

export async function GetMessagesAction() {
    try {
        await connectToDatabase();

        const messages = await Message.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Récupérer les informations des salles pour chaque message
        const messagesWithRoomInfo = await Promise.all(
            messages.map(async (message) => {
                let roomName = "Salle inconnue";
                if (message.roomId) {
                    const room = await Room.findById(message.roomId).lean();
                    if (room) {
                        roomName = room.name || "Salle inconnue";
                    }
                }

                return {
                    ...message,
                    _id: message._id?.toString() ?? "",
                    roomId: message.roomId?.toString() ?? null,
                    roomName,
                    createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : null,
                    updatedAt: message.updatedAt ? new Date(message.updatedAt).toISOString() : null,
                };
            })
        );

        return {
            success: true,
            data: messagesWithRoomInfo,
        };
    } catch (error) {
        console.error("[GetMessagesAction] error fetching messages", error);
        return {
            success: false,
            message: "Erreur lors de la récupération des messages.",
        };
    }
}
