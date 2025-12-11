#!/usr/bin/env node

/**
 * Script de simulation d'un capteur externe
 * 
 * Ce script simule un capteur qui :
 * 1. Contacte /api/add-sensor en boucle jusqu'à recevoir isReady: true
 * 2. Une fois prêt, envoie des métriques toutes les 30 secondes via /api/add-metrics
 * 
 * Usage: node scripts/simulate-sensor.js [sensorRef] [apiUrl]
 * Exemple: node scripts/simulate-sensor.js SENSOR-001 http://localhost:3000
 */

const API_URL = process.env.API_URL || process.argv[3] || "http://localhost:3000";
const SENSOR_REF = process.argv[2] || `SENSOR-${Date.now()}`; // automatic 
// const SENSOR_REF = "SENSOR-1765466256599";
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
console.log(`⏹️  Appuyez sur Ctrl+C pour arrêter\n`);

startSensorCheck().catch((error) => {
    console.error("❌ Erreur fatale:", error);
    cleanup();
});
