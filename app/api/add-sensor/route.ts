import { connectToDatabase } from "@/lib/database";
import sensor from "@/models/sensor";
import { SensorEnum } from "@/utils/types/sensor";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const sensorRef = body?.payload?.sensorRef;

        if (!sensorRef) {
            return NextResponse.json(
                { error: "sensorRef est requis" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingSensor = await sensor.findOne({ reference: sensorRef });

        if (!existingSensor) {
            await sensor.create({
                name: sensorRef,
                reference: sensorRef,
                roomId: null,
                source: SensorEnum.ESP32_ENV_V2,
            });

            return NextResponse.json({ isReady: false }, { status: 200 });
        }

        const isReady = !!existingSensor.roomId;

        return NextResponse.json({ isReady }, { status: 200 });
    } catch (error) {
        console.error("[add-sensor] failed", error);
        return NextResponse.json(
            { error: "Erreur lors de la vérification du capteur" },
            { status: 500 }
        );
    }
}