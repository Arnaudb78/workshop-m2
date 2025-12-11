export enum AccessLevelEnum {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
}

export type CreateAccountPayload = {
    name: string;
    lastname: string;
    mail: string;
    password: string;
    accessLevel: AccessLevelEnum;
    schoolPromotion?: string; // Pour les étudiants (ex: "master 2 TL")
    poste?: string; // Pour les admins (ex: "directeur")
};