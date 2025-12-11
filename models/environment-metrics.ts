import mongoose, { Schema } from "mongoose";

const EnvironmentMetricsSchema = new Schema({
    environmentMetricId: Schema.ObjectId,
    sensorRef: String,
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
        unit: {
            type: String,
            enum: ["dB", "dBA", "dBC", "dBSPL"],
        },
    },
    co2: String,
    refreshAt: { type: Date, default: Date.now },
});

export default mongoose.model("EnvironmentMetrics", EnvironmentMetricsSchema);
