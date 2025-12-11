import { connectToDatabase } from "@/lib/database";
import { NextResponse } from "next/server";
import Sensor from "@/models/sensor";
import { Types } from "mongoose";

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

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { sensorRef, roomId } = body;

        if (!sensorRef) {
            return NextResponse.json({ success: false, error: "sensorRef est requis" }, { status: 400 });
        }

        await connectToDatabase();

        const sensor = await Sensor.findOne({ reference: sensorRef });

        if (!sensor) {
            return NextResponse.json({ success: false, error: "Capteur non trouvé" }, { status: 404 });
        }

        const updateData: { roomId?: Types.ObjectId | null } = {};
        if (roomId !== undefined) {
            updateData.roomId = roomId && Types.ObjectId.isValid(roomId) ? new Types.ObjectId(roomId) : null;
        }

        await Sensor.findByIdAndUpdate(sensor._id, { $set: updateData });

        const updatedSensor = await Sensor.findById(sensor._id).lean();
        const sensorWithStringId = {
            ...updatedSensor,
            _id: updatedSensor._id?.toString(),
            roomId: updatedSensor.roomId ? updatedSensor.roomId.toString() : null,
        };

        return NextResponse.json({ success: true, data: sensorWithStringId }, { status: 200 });
    } catch (error) {
        console.error("[PATCH /api/sensors] error updating sensor", error);
        return NextResponse.json({ success: false, error: "Erreur lors de la mise à jour du capteur." }, { status: 500 });
    }
}
