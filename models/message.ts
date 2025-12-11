import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
    {
        messageId: Schema.ObjectId,
        title: String,
        description: String,
        studentMail: String,
        roomId: Schema.ObjectId,
    },
    {
        timestamps: true,
    }
);

export default models.Message || mongoose.model("Message", MessageSchema);
