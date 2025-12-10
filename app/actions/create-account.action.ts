"use server";

import { connectToDatabase } from "@/lib/database";
import { CreateAccountValition } from "@/utils/validations/create-account.validation";
import Account from "@/models/account";
import { CreateAccountPayload } from "@/utils/types/account";
import bcrypt from "bcryptjs";

export async function CreateAccountAction(payload: CreateAccountPayload) {
    const validation = CreateAccountValition.safeParse(payload);
    if (!validation.success) {
        return {
            success: false,
            message: validation.error.message,
        };
    }

    try {
        await connectToDatabase();

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const createdDoc = await Account.create({
            name: payload.name,
            lastname: payload.lastname,
            mail: payload.mail,
            password: hashedPassword,
            accessLevel: payload.accessLevel,
        });

        const createdJson = createdDoc.toJSON({ versionKey: false });
        const created = { ...createdJson, _id: createdDoc._id.toString() };

        return {
            success: true,
            data: created,
            pahtParams: "/dashboard"
        };
    } catch (error) {
        console.error("[CreateAccountAction] error creating account", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de la création du compte.",
        };
    }
}
