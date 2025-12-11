import { connectToDatabase } from "@/lib/database";
import environmentMetrics from "@/models/environment-metrics";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { EnvironmentMetricsType } from "@/utils/types/environment-metrics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload: EnvironmentMetricsType = body?.payload;

    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    await connectToDatabase();

    const saveData = await environmentMetrics.create({
      roomId: payload.roomId ? new Types.ObjectId(payload.roomId) : undefined,
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
        acceptableDecibelNumber: payload?.sound?.acceptableDecibelNumber,
        unit: payload?.sound?.unit || "dB",
      },
      co2: payload?.co2,
      refreshAt: new Date(),
      sensorId: payload?.sensorId ? new Types.ObjectId(payload.sensorId) : undefined,
      comfortLevel: payload?.comfortLevel,
      needVentilation: payload?.needVentilation ?? false,
    });

    return NextResponse.json({ saveData }, { status: 200 });
  } catch (error) {
    console.error("[add-metrics] failed", error);
    const message = "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}