"use server";

import { connectToDatabase } from "@/lib/database";
import { CreateRoomValidation } from "@/utils/validations/create-room.validation";
import Room from "@/models/room";
import { CreateRoomPayload } from "@/utils/types/room";

/**
 * Calcule les valeurs acceptables pour les métriques environnementales
 * en fonction de la taille de la salle (référence : 70 m²)
 * 
 * @param size Taille de la salle en m²
 * @returns Objet contenant les valeurs acceptables pour co2, decibel, humidity, temperature
 */
function calculateAcceptableValues(size: number) {
    const referenceSize = 70; // Taille de référence en m²
    const ratio = size / referenceSize;

    // CO₂ : ~800 ppm pour 70 m² (acceptable 400-1000 ppm)
    // Plus la salle est grande, meilleure est la dilution du CO₂
    // Ajustement proportionnel avec un minimum de 600 ppm pour très petites salles
    const co2 = Math.max(600, Math.round(800 * Math.pow(ratio, 0.7)));

    // Décibels : ~35 dB(A) en bruit de fond (acceptable 30-40 dB(A))
    // Moins dépendant de la taille, légère variation
    const decibel = Math.round(35 + (ratio - 1) * 2);
    const decibelClamped = Math.max(30, Math.min(40, decibel));

    // Humidité : ~45% (acceptable 40-60%)
    // Peu dépendant de la taille, valeur stable
    const humidity = 45;

    // Température : ~21°C (acceptable 19-23°C)
    // Peu dépendant de la taille, valeur optimale pour activités assises
    const temperature = 21;

    return {
        co2,
        decibel: decibelClamped,
        humidity,
        temperature,
    };
}

export async function CreateRoomAction(payload: CreateRoomPayload) {
    const validation = CreateRoomValidation.safeParse(payload);
    if (!validation.success) {
        return {
            success: false,
            message: 
                validation.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") || 
                "Erreur lors de la validation. Merci de vérifier les informations saisies.",
        };
    }

    try {
        await connectToDatabase();

        const roomSize = payload.size || 70;
        const acceptableValues = calculateAcceptableValues(roomSize);

        const createdDoc = await Room.create({
            name: payload.name,
            floor: payload.floor,
            position: payload.position,
            description: payload.description || "",
            type: payload.type,
            isUsed: payload.isUsed,
            sensorId: payload.sensorId || null,
            size: roomSize,
            acceptable: acceptableValues,
        });

        const createdJson = createdDoc.toJSON({ versionKey: false });
        const created = { ...createdJson, _id: createdDoc._id.toString() };

        return {
            success: true,
            data: created,
        };
    } catch (error) {
        console.error("[CreateRoomAction] error creating room", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de la création de la pièce.",
        };
    }
}
