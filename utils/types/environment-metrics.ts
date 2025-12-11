export enum HumidityUnit {
  PERCENT = "%",
  GRAMS_PER_M3 = "g/m3",
  GRAMS_PER_KG = "g/kg",
  PARTS_PER_MILLION = "ppmv",
}

export enum TemperatureUnit {
  CELSIUS = "C",
  FAHRENHEIT = "F",
  KELVIN = "K",
  RANKINE = "R",
}

export enum SoundUnit {
  DB = "dB",
  DBA = "dBA",
  DBC = "dBC",
  DB_SPL = "dBSPL",
}

export enum ComfortLevel {
  REALLY_GOOD = "REALLY_GOOD",
  GOOD = "GOOD",
  BAD = "BAD",
  REALLY_BAD = "REALLY_BAD",
}

export type EnvironmentMetricsType = {
  sensorRef: string;
  luminos?: number;
  humidity?: {
    humidityNumber?: string;
    unit?: HumidityUnit;
  };
  temperature?: {
    temperatureReading?: string;
    unit?: TemperatureUnit;
  };
  sound?: {
    decibel?: number;
    unit?: SoundUnit;
  };
  co2?: string;
  refreshAt?: Date | string;
};