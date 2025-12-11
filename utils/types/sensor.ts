export enum SensorEnum {
    ESP_32 = "ESP-32",
    ESP32_ENV_V2 = "ESP32-ENV-V2",
};

export type SensorType = {
    name: string;
    reference: string;
    roomId?: string;
    source:  SensorEnum,
};