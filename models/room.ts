import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema({
    room: Schema.ObjectId,
    floor: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
    },
    description: String,
    isUsed: Boolean,
});

export default mongoose.model("Room", RoomSchema);