import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import Sensor from "@/models/sensor";

export async function GET() {
    try {
        await connectToDatabase();
        
        const sensors = await Sensor.find({}).lean();
        
        // Convertir les ObjectId en string pour la sérialisation JSON
        const sensorsWithStringIds = sensors.map((sensor) => ({
            ...sensor,
            _id: sensor._id?.toString(),
            roomId: sensor.roomId ? sensor.roomId.toString() : null,
        }));

        return NextResponse.json({ success: true, data: sensorsWithStringIds }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/sensors] error fetching sensors", error);
        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération des capteurs." },
            { status: 500 }
        );
    }
}
