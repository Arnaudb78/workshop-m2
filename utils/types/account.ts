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
};