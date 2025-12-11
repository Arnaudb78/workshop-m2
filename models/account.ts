import mongoose, { Schema, models } from "mongoose";

const AccountSchema = new Schema(
    {
        accountId: Schema.ObjectId,
        name: String,
        lastname: String,
        mail: String,
        password: String,
        accessLevel: {
            type: String,
            enum: ["ADMIN", "STUDENT"],
        },
        schoolPromotion: {
            type: String,
            required: false,
        },
        poste: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

if (models.Account) {
    delete mongoose.models.Account;
}

export default mongoose.model("Account", AccountSchema);
