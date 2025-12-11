export type CreateRoomPayload = {
    name: string;
    floor: number;
    position: number;
    description?: string;
    type: "ADMIN" | "STUDENT";
    isUsed: boolean;
    sensorId?: string | null;
    size?: number;
};
