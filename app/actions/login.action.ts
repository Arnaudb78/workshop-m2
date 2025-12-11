"use server";

import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/database";
import Account from "@/models/account";
import { cookies } from "next/headers";

type LoginPayload = {
    mail: string;
    password: string;
};

export async function LoginAction(payload: LoginPayload) {
    if (!payload?.mail || !payload?.password) {
        return {
            success: false,
            message: "Merci de renseigner l'email et le mot de passe.",
        };
    }

    try {
        await connectToDatabase();

        const user = await Account.findOne({ mail: payload.mail }).lean();
        if (!user) {
            return {
                success: false,
                message: "Aucun compte trouvé avec cet email.",
            };
        }

        const isValid = await bcrypt.compare(payload.password, user.password ?? "");
        if (!isValid) {
            return {
                success: false,
                message: "Mot de passe incorrect.",
            };
        }

        const cookieStore = await cookies();

        // Convertir _id en string et exclure le mot de passe
        const { password, _id, ...accountWithoutPassword } = user;
        const accountData = {
            ...accountWithoutPassword,
            _id: _id?.toString() ?? "",
        };

        cookieStore.set("account", JSON.stringify(accountData), {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_APP_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            success: true,
            data: accountData,
        };
    } catch (error) {
        console.error("[LoginAction] error", error);
        return {
            success: false,
            message: "Impossible de se connecter pour le moment.",
        };
    }
}