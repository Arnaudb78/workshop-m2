#!/usr/bin/env node

/**
 * Script pour créer toutes les salles à partir du panneau d'affichage
 * 
 * Usage: node scripts/create-room.js
 */

const mongoose = require("mongoose");

// Schéma Room simplifié pour le script
const RoomSchema = new mongoose.Schema(
    {
        room: mongoose.Schema.ObjectId,
        name: String,
        floor: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6],
        },
        position: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
        },
        description: String,
        acceptable: {
            _id: false,
            type: {
                co2: {
                    type: Number,
                    default: 0,
                },
                decibel: {
                    type: Number,
                    default: 0,
                },
                humidity: {
                    type: Number,
                    default: 0,
                },
                temperature: {
                    type: Number,
                    default: 0,
                },
            },
            default: {
                co2: 0,
                decibel: 0,
                humidity: 0,
                temperature: 0,
            },
        },
        status: {
            _id: false,
            co2: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            decibel: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            humidity: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
            temperature: {
                type: String,
                enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
                required: false,
                default: null,
            },
        },
        type: {
            type: String,
            enum: ["ADMIN", "STUDENT"],
            required: true,
        },
        isUsed: Boolean,
        sensorId: String || null,
        size: {
            type: Number,
            required: true,
            default: 70,
        },
        comfortLevel: {
            type: String,
            enum: ["REALLY_GOOD", "GOOD", "BAD", "REALLY_BAD"],
            required: false,
            default: null,
        },
        needVentilation: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

/**
 * Fonction de connexion à MongoDB (version CommonJS)
 * Reproduit la logique de lib/database.ts
 */
const connectionString = process.env.MONGO_DB_CONNECTION_STRING || process.env.MONGODB_URI;
if (!connectionString) {
    throw new Error("Missing Mongo connection string. Set MONGO_DB_CONNECTION_STRING (or MONGODB_URI) in your env.");
}
const MONGO_URI = connectionString;

const cached = global.mongoose || {
    conn: null,
    promise: null,
};

if (!global.mongoose) {
    global.mongoose = cached;
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

/**
 * Calcule les valeurs acceptables pour les métriques environnementales
 * en fonction de la taille de la salle (référence : 70 m²)
 * 
 * @param {number} size Taille de la salle en m²
 * @returns {Object} Objet contenant les valeurs acceptables pour co2, decibel, humidity, temperature
 */
function calculateAcceptableValues(size) {
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

// Toutes les salles du panneau d'affichage
const rooms = [
    // Floor 6 (floor: 0)
    { name: "Direction", floor: 6, position: 1, type: "ADMIN", description: "", size: 70 },
    { name: "Direction pédagogique", floor: 6, position: 2, type: "ADMIN", description: "", size: 70 },

    // Floor 5 (7 salles, positions 1-5 utilisées, certaines salles partagent la position)
    { name: "Coworking", floor: 5, position: 1, type: "ADMIN", description: "", size: 70 },
    { name: "Salle des formateurs", floor: 5, position: 2, type: "ADMIN", description: "", size: 70 },
    { name: "Communication", floor: 5, position: 3, type: "ADMIN", description: "", size: 70 },
    { name: "Administration des ventes", floor: 5, position: 4, type: "ADMIN", description: "", size: 70 },
    { name: "Comptabilité et Finance", floor: 5, position: 5, type: "ADMIN", description: "", size: 70 },
    { name: "Admissions", floor: 5, position: 1, type: "ADMIN", description: "", size: 70 },
    { name: "Relations entreprises", floor: 5, position: 2, type: "ADMIN", description: "", size: 70 },

    // Floor 4
    { name: "Aaron Swartz", floor: 4, position: 1, type: "STUDENT", description: "", size: 70 },
    { name: "Bernard Stiegler", floor: 4, position: 2, type: "STUDENT", description: "", size: 70 },
    { name: "Chelsea Manning", floor: 4, position: 3, type: "STUDENT", description: "", size: 70 },
    { name: "Alan Turing", floor: 4, position: 4, type: "STUDENT", description: "Maker Space", size: 70 },

    // Floor 3
    { name: "Vannevar Bush", floor: 3, position: 1, type: "STUDENT", description: "", size: 70 },
    { name: "Lawrence Lessig", floor: 3, position: 2, type: "STUDENT", description: "", size: 70 },
    { name: "Edward Snowden", floor: 3, position: 3, type: "STUDENT", description: "", size: 70 },
    { name: "Michel Gondry", floor: 3, position: 4, type: "STUDENT", description: "", size: 70 },
    { name: "Mary Shelley", floor: 3, position: 5, type: "STUDENT", description: "", size: 70 },

    // Floor 2
    { name: "Blaise Pascal", floor: 2, position: 1, type: "STUDENT", description: "", size: 70 },
    { name: "Norbert Wiener", floor: 2, position: 2, type: "STUDENT", description: "", size: 70 },
    { name: "Hedy Lamarr", floor: 2, position: 3, type: "STUDENT", description: "", size: 70 },
    { name: "John Perry Barlow", floor: 2, position: 4, type: "STUDENT", description: "", size: 70 },

    // Floor 1
    { name: "Tim Berners-Lee", floor: 1, position: 1, type: "STUDENT", description: "", size: 70 },
    { name: "Richard Stallman", floor: 1, position: 2, type: "STUDENT", description: "", size: 70 },
    { name: "Ada Lovelace", floor: 1, position: 3, type: "STUDENT", description: "Lab IA", size: 70 },
    { name: "Pédagogie et Scolarité", floor: 1, position: 4, type: "ADMIN", description: "", size: 70 },
    { name: "Services support informatique et audiovisuel", floor: 1, position: 5, type: "ADMIN", description: "", size: 70 },
    { name: "Expérience étudiant", floor: 1, position: 1, type: "ADMIN", description: "", size: 70 },
];

async function createRooms() {
    try {
        await connectToDatabase();

        console.log("✓ Connecté à MongoDB\n");

        // Supprimer les anciennes salles si nécessaire (optionnel, commenté par défaut)
        // console.log("Suppression des anciennes salles...");
        // await Room.deleteMany({});
        // console.log("✓ Anciennes salles supprimées\n");

        console.log(`Création de ${rooms.length} salles...\n`);

        let created = 0;
        let skipped = 0;

        for (const roomData of rooms) {
            try {
                // Vérifier si la salle existe déjà (même nom et étage)
                const existing = await Room.findOne({
                    name: roomData.name,
                    floor: roomData.floor,
                });

                if (existing) {
                    console.log(`⚠ Salle déjà existante: ${roomData.name} (Étage ${roomData.floor}, Position ${roomData.position})`);
                    skipped++;
                    continue;
                }

                const roomSize = roomData.size || 70;
                const acceptableValues = calculateAcceptableValues(roomSize);

                const room = await Room.create({
                    name: roomData.name,
                    floor: roomData.floor,
                    position: roomData.position,
                    description: roomData.description || "",
                    type: roomData.type,
                    isUsed: false,
                    sensorId: null,
                    size: roomSize,
                    acceptable: acceptableValues,
                });

                console.log(`✓ Créée: ${room.name} (Étage ${room.floor}, Position ${room.position}, Type: ${room.type})`);
                created++;
            } catch (error) {
                console.error(`✗ Erreur lors de la création de ${roomData.name}:`, error.message);
            }
        }

        console.log(`\n✓ Terminé ! ${created} salles créées, ${skipped} salles ignorées (déjà existantes)`);
    } catch (error) {
        console.error("Erreur:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("\nConnexion fermée");
        process.exit(0);
    }
}

// Exécuter le script
createRooms();
