"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/database";
import Account from "@/models/account";

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

    // TODO: set auth session/cookie here
    redirect("/dashboard");
  } catch (error) {
    console.error("[LoginAction] error", error);
    return {
      success: false,
      message: "Impossible de se connecter pour le moment.",
    };
  }
}