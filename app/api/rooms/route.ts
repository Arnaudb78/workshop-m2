import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import Room from "@/models/room";

export async function GET() {
    try {
        await connectToDatabase();
        
        const rooms = await Room.find({}).lean();
        
        // Convertir les ObjectId en string pour la sérialisation JSON
        const roomsWithStringIds = rooms.map((room) => ({
            ...room,
            _id: room._id?.toString(),
        }));

        return NextResponse.json({ success: true, data: roomsWithStringIds }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/rooms] error fetching rooms", error);
        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération des pièces." },
            { status: 500 }
        );
    }
}