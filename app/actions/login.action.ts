"use server";

import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/database";
import Account from "@/models/account";
import { cookies } from "next/headers";
import { AccessLevelEnum } from "@/utils/types/account";

type LoginPayload = {
    mail: string;
    password: string;
    accessLevel?: AccessLevelEnum;
    verificationCode?: string;
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

        // Si connexion admin, vérifier le code de vérification
        if (user.accessLevel === AccessLevelEnum.ADMIN || payload.accessLevel === AccessLevelEnum.ADMIN) {
            const adminLoginCode = process.env.ADMIN_LOGIN_VERIFICATION_CODE;
            if (!adminLoginCode) {
                return {
                    success: false,
                    message: "Configuration serveur invalide. Code de vérification admin manquant.",
                };
            }

            if (!payload.verificationCode || payload.verificationCode !== adminLoginCode) {
                return {
                    success: false,
                    message: "Code de vérification administrateur incorrect.",
                };
            }
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

        // Rediriger vers le bon dashboard selon le niveau d'accès
        const redirectPath = accountData.accessLevel === AccessLevelEnum.ADMIN ? "/dashboard" : "/dashboard-student";

        return {
            success: true,
            data: accountData,
            redirectPath,
        };
    } catch (error) {
        console.error("[LoginAction] error", error);
        return {
            success: false,
            message: "Impossible de se connecter pour le moment.",
        };
    }
}