import mongoose, { Schema } from "mongoose";

const EnvironmentMetricsSchema = new Schema({
    environmentMetricId: Schema.ObjectId,
    roomId: Schema.ObjectId,
    humidity: {
        humidityNumber: String,
        unit: {
            type: String,
            enum: ["%", "g/m3", "g/kg", "ppmv"],
        },
    },
    temperature: {
        temperatureReading: String,
        unit: {
            type: String,
            enum: ["C", "F", "K", "R"],
        },
    },
    sound: {
        decibel: Number,
        acceptableDecibelNumber: Number,
        unit: {
            type: String,
            enum: ["dB", "dBA", "dBC", "dBSPL"],
        },
    },
    refreshAt: { type: Date, default: Date.now },
    sensorId: Schema.ObjectId,
    comfortLevel: {
        type: String,
        enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
    },
    needVentilation: Boolean,
});

export default mongoose.model("EnvironmentMetrics", EnvironmentMetricsSchema);
