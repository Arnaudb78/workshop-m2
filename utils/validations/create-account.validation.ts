import z from "zod";
import { SchoolPromotionEnum } from "@/utils/enums/school-promotion.enum";

const AccessLevelEnumValidation = z.enum(["ADMIN", "STUDENT"]);

const SchoolPromotionEnumValidation = z.nativeEnum(SchoolPromotionEnum);

export const CreateAccountValition = z
    .object({
        name: z.string().min(3),
        lastname: z.string().min(3),
        mail: z.email(),
        password: z.string().min(2, "Le mot de passe doit contenir au moins 8 caractères"),
        accessLevel: AccessLevelEnumValidation,
        schoolPromotion: z.string().optional(),
        poste: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.accessLevel === "STUDENT") {
                if (!data.schoolPromotion || data.schoolPromotion.trim().length === 0) {
                    return false;
                }
                // Vérifier que la valeur fait partie de l'enum
                const validPromotions = Object.values(SchoolPromotionEnum);
                return validPromotions.includes(data.schoolPromotion as SchoolPromotionEnum);
            }
            if (data.accessLevel === "ADMIN") {
                return !!data.poste && data.poste.trim().length > 0;
            }
            return true;
        },
        {
            message: "schoolPromotion est requis pour les étudiants et doit être une promotion valide. poste est requis pour les admins",
            path: ["accessLevel"],
        }
    );