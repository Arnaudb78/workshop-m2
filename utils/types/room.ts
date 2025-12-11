export type CreateRoomPayload = {
    name: string,
    floor: number;
    position: number;
    description?: string;
    isUsed: boolean;
    sensorId?: string | null;
};
