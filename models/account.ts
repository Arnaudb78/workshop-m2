import mongoose, { Schema, models } from "mongoose";

const AccountSchema = new Schema({
    accountId: Schema.ObjectId,
    name: String,
    lastname: String,
    mail: String,
    password: String,
    accessLevel: {
        type: String,
        enum: ["ADMIN", "STUDENT"],
    },
});

export default models.Account || mongoose.model("Account", AccountSchema);
