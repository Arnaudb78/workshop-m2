import mongoose, { Schema, models } from "mongoose";

const RoomSchema = new Schema({
    room: Schema.ObjectId,
    name: String,
    floor: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    position: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    },
    description: String,
    isUsed: Boolean,
    sensorId: String || null,
});

export default models.Room || mongoose.model("Room", RoomSchema);
