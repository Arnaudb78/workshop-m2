import { connectToDatabase } from "@/lib/database";
import environmentMetrics from "@/models/environment-metrics";
import Sensor from "@/models/sensor";
import Room from "@/models/room";
import { NextResponse } from "next/server";
import { EnvironmentMetricsType } from "@/utils/types/environment-metrics";

const getStatus = (value: number, acceptableValue: number): "REALLY_BAD" | "BAD" | "GOOD" | "REALLY_GOOD" => {
    if (value < acceptableValue) {
        if (value < acceptableValue * 0.5) {
            return "REALLY_BAD";
        }
        return "BAD";
    } else {
        if (value <= acceptableValue * 1.2) {
            return "GOOD";
        }
        return "REALLY_GOOD";
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const payload: EnvironmentMetricsType = body?.payload;

        if (!payload) {
            return NextResponse.json({ error: "Missing payload" }, { status: 400 });
        }

        await connectToDatabase();

        const saveData = await environmentMetrics.create({
            sensorRef: payload.sensorRef,
            luminos: payload?.luminos,
            humidity: {
                humidityNumber: payload?.humidity?.humidityNumber,
                unit: payload?.humidity?.unit || "%",
            },
            temperature: {
                temperatureReading: payload?.temperature?.temperatureReading,
                unit: payload?.temperature?.unit || "C",
            },
            sound: {
                decibel: payload?.sound?.decibel,
                unit: payload?.sound?.unit || "dB",
            },
            co2: payload?.co2,
            refreshAt: new Date(),
        });

        const sensorWithRoom = await Sensor.aggregate([
            {
                $match: {
                    reference: payload.sensorRef,
                },
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomId",
                    foreignField: "_id",
                    as: "room",
                },
            },
            {
                $unwind: {
                    path: "$room",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        const room = sensorWithRoom[0]?.room || null;

        if (!room) {
            return NextResponse.json({ error: "Pas de salle attribuée." }, { status: 402 });
        }

        if (payload.luminos && payload.luminos > 50) {
            await Room.findByIdAndUpdate(room._id, { $set: { isUsed: true } });
        }

        const { acceptable } = room;
        const statusUpdates: any = {};

        if (payload.co2 && acceptable.co2) {
            const co2Value = parseFloat(payload.co2);
            if (!isNaN(co2Value)) {
                statusUpdates["status.co2"] = getStatus(co2Value, acceptable.co2);
            }
        }

        if (payload.humidity?.humidityNumber && acceptable.humidity) {
            const humidityValue = parseFloat(payload.humidity.humidityNumber);
            if (!isNaN(humidityValue)) {
                statusUpdates["status.humidity"] = getStatus(humidityValue, acceptable.humidity);
            }
        }

        if (payload.temperature?.temperatureReading && acceptable.temperature) {
            const temperatureValue = parseFloat(payload.temperature.temperatureReading);
            if (!isNaN(temperatureValue)) {
                statusUpdates["status.temperature"] = getStatus(temperatureValue, acceptable.temperature);
            }
        }

        if (payload.sound?.decibel !== undefined && acceptable.decibel) {
            const decibelValue = payload.sound.decibel;
            if (!isNaN(decibelValue)) {
                statusUpdates["status.decibel"] = getStatus(decibelValue, acceptable.decibel);
            }
        }

        if (Object.keys(statusUpdates).length > 0) {
            await Room.findByIdAndUpdate(room._id, { $set: statusUpdates });
        }

        return NextResponse.json({ saveData }, { status: 200 });
    } catch (error) {
        console.error("[add-metrics] failed", error);
        const message = "Unexpected error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}