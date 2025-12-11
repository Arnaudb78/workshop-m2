"use server";

import { connectToDatabase } from "@/lib/database";
import Account from "@/models/account";

type DeleteStudentPayload = {
    studentId: string;
};

export async function DeleteStudentAction(payload: DeleteStudentPayload) {
    if (!payload?.studentId) {
        return {
            success: false,
            message: "ID étudiant manquant.",
        };
    }

    try {
        await connectToDatabase();

        const deletedAccount = await Account.findByIdAndDelete(payload.studentId);

        if (!deletedAccount) {
            return {
                success: false,
                message: "Étudiant non trouvé.",
            };
        }

        return {
            success: true,
            message: "Étudiant supprimé avec succès.",
        };
    } catch (error) {
        console.error("[DeleteStudentAction] error deleting student", error);
        return {
            success: false,
            message: "Erreur lors de la suppression de l'étudiant.",
        };
    }
}
