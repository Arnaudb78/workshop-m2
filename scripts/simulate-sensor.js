#!/usr/bin/env node

/**
 * Script de simulation d'un capteur externe
 * 
 * Ce script simule un capteur qui :
 * 1. Contacte /api/add-sensor en boucle jusqu'à recevoir isReady: true
 * 2. Une fois prêt, envoie des métriques toutes les 30 secondes via /api/add-metrics
 * 
 * Usage: node scripts/simulate-sensor.js <sensorRef> [roomId] [apiUrl]
 * Exemples:
 *   node scripts/simulate-sensor.js SENSOR-001
 *   node scripts/simulate-sensor.js SENSOR-001 507f1f77bcf86cd799439011
 *   node scripts/simulate-sensor.js SENSOR-001 507f1f77bcf86cd799439011 http://localhost:3000
 * 
 * Paramètres:
 *   sensorRef (requis): Référence du capteur (ex: SENSOR-001)
 *   roomId (optionnel): ID de la room à assigner au capteur
 *   apiUrl (optionnel): URL de l'API (défaut: http://localhost:3000)
 */

// Parsing des arguments
const args = process.argv.slice(2);
const SENSOR_REF = args[0] || `SENSOR-${Date.now()}`;
const ROOM_ID = args[1] && !args[1].startsWith("http") ? args[1] : null;
const API_URL = process.env.API_URL || (args[1] && args[1].startsWith("http") ? args[1] : args[2]) || "http://localhost:3000";

const CHECK_INTERVAL = 5000; // Vérifier toutes les 5 secondes si le capteur est prêt
const METRICS_INTERVAL = 30000; // Envoyer des métriques toutes les 30 secondes

// Variables de contrôle
let isReady = false;
let metricsInterval = null;
let checkInterval = null;
let shouldStop = false;

/**
 * Génère des valeurs de métriques réalistes avec de légères variations
 */
function generateMetrics(sensorRef) {
    const baseTemp = 20 + Math.random() * 5; // 20-25°C
    const baseHumidity = 40 + Math.random() * 20; // 40-60%
    const baseCO2 = 400 + Math.random() * 200; // 400-600 ppm
    const baseSound = 30 + Math.random() * 20; // 30-50 dB
    const baseLuminos = 200 + Math.random() * 300; // 200-500 lux

    return {
        sensorRef,
        temperature: {
            temperatureReading: baseTemp.toFixed(2),
            unit: "C",
        },
        humidity: {
            humidityNumber: baseHumidity.toFixed(2),
            unit: "%",
        },
        co2: Math.floor(baseCO2).toString(),
        sound: {
            decibel: Math.floor(baseSound),
            unit: "dB",
        },
        luminos: Math.floor(baseLuminos),
    };
}

/**
 * Assigne le capteur à une room si roomId est fourni
 */
async function assignSensorToRoom() {
    if (!ROOM_ID) {
        return false;
    }

    try {
        // D'abord, s'assurer que le capteur existe en appelant /api/add-sensor
        await fetch(`${API_URL}/api/add-sensor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: {
                    sensorRef: SENSOR_REF,
                },
            }),
        });

        // Attendre un peu pour que le capteur soit créé si nécessaire
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Assigner le capteur à la room via l'API PATCH
        const response = await fetch(`${API_URL}/api/sensors`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sensorRef: SENSOR_REF,
                roomId: ROOM_ID,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Erreur lors de l'assignation: ${response.status}`, errorData);
            return false;
        }

        const data = await response.json();
        if (data.success) {
            console.log(`✅ Capteur "${SENSOR_REF}" assigné à la room ${ROOM_ID}`);
            return true;
        } else {
            console.error(`❌ Erreur lors de l'assignation:`, data.error);
            return false;
        }
    } catch (error) {
        console.error(`❌ Erreur lors de l'assignation du capteur:`, error.message);
        return false;
    }
}

/**
 * Vérifie si le capteur est prêt (assigné à une salle)
 */
async function checkSensorReady() {
    try {
        const response = await fetch(`${API_URL}/api/add-sensor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: {
                    sensorRef: SENSOR_REF,
                },
            }),
        });

        if (!response.ok) {
            console.error(`❌ Erreur HTTP: ${response.status}`);
            return false;
        }

        const data = await response.json();
        return data.isReady === true;
    } catch (error) {
        console.error(`❌ Erreur lors de la vérification du capteur:`, error.message);
        return false;
    }
}

/**
 * Envoie des métriques au serveur
 */
async function sendMetrics() {
    try {
        const metrics = generateMetrics(SENSOR_REF);
        
        const response = await fetch(`${API_URL}/api/add-metrics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payload: metrics,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Erreur lors de l'envoi des métriques: ${response.status}`, errorData);
            return;
        }

        const data = await response.json();
        const timestamp = new Date().toLocaleTimeString("fr-FR");
        console.log(`✅ [${timestamp}] Métriques envoyées:`, {
            temp: `${metrics.temperature.temperatureReading}°C`,
            humidity: `${metrics.humidity.humidityNumber}%`,
            co2: `${metrics.co2} ppm`,
            sound: `${metrics.sound.decibel} dB`,
            luminos: `${metrics.luminos} lux`,
        });
    } catch (error) {
        console.error(`❌ Erreur lors de l'envoi des métriques:`, error.message);
    }
}

/**
 * Boucle principale qui vérifie si le capteur est prêt
 */
async function startSensorCheck() {
    console.log(`🔍 Vérification du capteur "${SENSOR_REF}" toutes les ${CHECK_INTERVAL / 1000} secondes...`);
    
    checkInterval = setInterval(async () => {
        if (shouldStop) {
            if (checkInterval) clearInterval(checkInterval);
            return;
        }

        const ready = await checkSensorReady();
        
        if (ready && !isReady) {
            isReady = true;
            console.log(`✅ Capteur "${SENSOR_REF}" est maintenant prêt et assigné à une salle !`);
            console.log(`📊 Début de l'envoi des métriques toutes les ${METRICS_INTERVAL / 1000} secondes...`);
            
            // Arrêter la vérification
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }

            // Commencer à envoyer des métriques
            await sendMetrics(); // Envoyer immédiatement
            metricsInterval = setInterval(sendMetrics, METRICS_INTERVAL);
        } else if (!ready && !isReady) {
            const timestamp = new Date().toLocaleTimeString("fr-FR");
            console.log(`⏳ [${timestamp}] Capteur "${SENSOR_REF}" en attente d'assignation à une salle...`);
        }
    }, CHECK_INTERVAL);
}

/**
 * Nettoyage lors de l'arrêt
 */
function cleanup() {
    console.log("\n🛑 Arrêt du simulateur de capteur...");
    shouldStop = true;
    
    if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
    }
    
    if (metricsInterval) {
        clearInterval(metricsInterval);
        metricsInterval = null;
    }
    
    console.log("✅ Arrêt terminé.");
    process.exit(0);
}

// Gestion des signaux pour arrêt propre
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Point d'entrée
console.log("🚀 Démarrage du simulateur de capteur...");
console.log(`📡 API URL: ${API_URL}`);
console.log(`🔖 Sensor Reference: ${SENSOR_REF}`);
if (ROOM_ID) {
    console.log(`🏠 Room ID: ${ROOM_ID}`);
} else {
    console.log(`🏠 Room ID: Non spécifié (le capteur sera assigné manuellement)`);
}
console.log(`⏹️  Appuyez sur Ctrl+C pour arrêter\n`);

if (ROOM_ID) {
    assignSensorToRoom().then(() => {
        startSensorCheck().catch((error) => {
            console.error("❌ Erreur fatale:", error);
            cleanup();
        });
    });
} else {
    startSensorCheck().catch((error) => {
        console.error("❌ Erreur fatale:", error);
        cleanup();
    });
}

/**
 * 
# Terminal 1
node scripts/simulate-sensor.js SENSOR-001 507f1f77bcf86cd799439011

# Terminal 2
node scripts/simulate-sensor.js SENSOR-002 507f1f77bcf86cd799439012

# Terminal 3
node scripts/simulate-sensor.js SENSOR-003 507f1f77bcf86cd799439013

# Terminal 4
node scripts/simulate-sensor.js SENSOR-004 507f1f77bcf86cd799439014
 */