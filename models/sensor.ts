import { Schema } from "mongoose";

const SensorSchema = new Schema({
    sensorId: Schema.ObjectId,
    name: String,
    source: {
        type: String,
        enum: ["ESP-32", "ESP32-ENV-V2"]
    }
})