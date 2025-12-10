import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema({
    accountId: Schema.ObjectId,
    name: String,
    lastname: String,
    password: String,
    accessLevel: {
        type: String,
        enum: ["ADMIN", "STUDENT"],
    },
});

export default mongoose.model("Account", AccountSchema);