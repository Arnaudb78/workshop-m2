"use server";

import { connectToDatabase } from "@/lib/database";
import { CreateAccountValition } from "@/utils/validations/create-account.validation";
import Account from "@/models/account";
import { CreateAccountPayload } from "@/utils/types/account";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AccessLevelEnum } from "@/utils/types/account";

type CreateAccountActionPayload = CreateAccountPayload & {
    verificationCode?: string;
};

export async function CreateAccountAction(payload: CreateAccountActionPayload) {
    const validation = CreateAccountValition.safeParse(payload);
    if (!validation.success) {
        return {
            success: false,
            message: validation.error.message,
        };
    }

    if (payload.accessLevel === AccessLevelEnum.ADMIN) {
        const adminSignupCode = process.env.ADMIN_SIGNUP_VERIFICATION_CODE;
        if (!adminSignupCode) {
            return {
                success: false,
                message: "Configuration serveur invalide. Code de vérification admin manquant.",
            };
        }

        if (!payload.verificationCode || payload.verificationCode !== adminSignupCode) {
            return {
                success: false,
                message: "Code de vérification administrateur incorrect.",
            };
        }
    }

    try {
        await connectToDatabase();

        // Vérifier si le mail existe déjà
        const existingAccount = await Account.findOne({ mail: payload.mail });
        if (existingAccount) {
            return {
                success: false,
                message: "Cette adresse email est déjà utilisée.",
            };
        }

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

        const cookieStore = await cookies();

        const { password, ...accountWithoutPassword } = created;

        cookieStore.set("account", JSON.stringify(accountWithoutPassword), {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        // Rediriger vers le bon dashboard selon le niveau d'accès
        const redirectPath = payload.accessLevel === AccessLevelEnum.ADMIN ? "/dashboard" : "/dashboard-student";

        return {
            success: true,
            data: created,
            pahtParams: redirectPath,
        };
    } catch (error) {
        console.error("[CreateAccountAction] error creating account", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de la création du compte.",
        };
    }
}
