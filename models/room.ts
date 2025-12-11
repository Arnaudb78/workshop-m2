import mongoose, { Schema, models } from "mongoose";

const RoomSchema = new Schema(
    {
        room: Schema.ObjectId,
        name: String,
        floor: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6],
        },
        position: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
        },
        description: String,
        acceptable: {
            _id: false,
            type: {
                co2: {
                    type: Number,
                    default: 0,
                },
                decibel: {
                    type: Number,
                    default: 0,
                },
                humidity: {
                    type: Number,
                    default: 0,
                },
                temperature: {
                    type: Number,
                    default: 0,
                },
            },
            default: {
                co2: 0,
                decibel: 0,
                humidity: 0,
                temperature: 0,
            },
        },
        status: {
            _id: false,
            co2: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            decibel: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            humidity: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            temperature: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
        },
        type: {
            type: String,
            enum: ["ADMIN", "STUDENT"],
            required: true,
        }, 
        isUsed: Boolean,
        sensorId: String || null,
        size: {
            type: Number,
            required: true,
            default: 70,
        },
        comfortLevel: {
            type: String,
            enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
            required: false,
            default: null,
        },
        needVentilation: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

if (models.Room) {
    delete mongoose.models.Room;
}

export default mongoose.model("Room", RoomSchema);
