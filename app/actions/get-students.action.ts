"use server";

import { connectToDatabase } from "@/lib/database";
import Account from "@/models/account";
import { AccessLevelEnum } from "@/utils/types/account";

export async function GetStudentsAction() {
    try {
        await connectToDatabase();

        const students = await Account.find({ accessLevel: AccessLevelEnum.STUDENT })
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        const studentsWithStringIds = students.map((student) => ({
            ...student,
            _id: student._id?.toString() ?? "",
            createdAt: student.createdAt ? new Date(student.createdAt).toISOString() : null,
        }));

        return {
            success: true,
            data: studentsWithStringIds,
        };
    } catch (error) {
        console.error("[GetStudentsAction] error fetching students", error);
        return {
            success: false,
            message: "Erreur lors de la récupération des étudiants.",
        };
    }
}
