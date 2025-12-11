import mongoose, { Schema, models } from "mongoose";

const SensorSchema = new Schema({
    sensorId: Schema.ObjectId,
    name: String,
    reference: String,
    roomId: {
        type: Schema.Types.ObjectId,
        required: false,
        default: null,
    },
    source: {
        type: String,
        enum: ["ESP-32", "ESP32-ENV-V2"],
    },
});

export default models.Sensor || mongoose.model("Sensor", SensorSchema);
