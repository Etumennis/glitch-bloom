const canvas = document.getElementById("plantCanvas");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "/static/sprites/glitch_bloom_sheet.png";

const mutationOverlay = new Image();
mutationOverlay.src = "/static/sprites/mutation_overlay.png";

const frameWidth = 64;
const frameHeight = 64;
const totalFrames = 3;
let currentFrame = 0;

const API_KEY = "a679b9ce43e54db384b30425252806";
const LOCATION = "Seattle";
const WEATHER_CACHE_KEY = "weatherData";
const WEATHER_TIME_KEY = "weatherTimestamp";
const oneDay = 1000 * 60 * 60 * 24;

let plantData = JSON.parse(localStorage.getItem("plantData"));
const now = Date.now();

if (!plantData) {
    plantData = {
        plantStage: 0,
        mutationActive: Math.floor(Math.random() * 7) === 0,
        lunarMutation: false,
        weatherEffect: null,
        adoptionTime: now,
        lastVisit: now
    };
} else {
    if (now - plantData.lastVisit > oneDay && plantData.plantStage < totalFrames - 1) {
        plantData.plantStage++;
        plantData.lastVisit = now;
    }
}

// Store locally
localStorage.setItem("plantData", JSON.stringify(plantData));

// Use stored values
currentFrame = plantData.plantStage;
const mutationActive = plantData.mutationActive;
let lunarMutation = plantData.lunarMutation;
let weatherEffect = plantData.weatherEffect;

function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply weather and moon effects
    if (mutationActive || lunarMutation || weatherEffect === "Rain") {
        ctx.fillStyle = "rgba(127, 0, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(spriteSheet, currentFrame * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

    if (mutationActive || lunarMutation || weatherEffect === "Rain") {
        ctx.drawImage(mutationOverlay, 0, 0);
    }
}

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        drawFrame();
    }
}

// Caching weather data
function fetchWeatherAndMoonData() {
    const lastFetch = localStorage.getItem(WEATHER_TIME_KEY);
    const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);

    if (cachedData && now - lastFetch < oneDay) {
        applyWeatherEffects(JSON.parse(cachedData));
        drawFrame();
        return;
    }

    fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${LOCATION}`)
        .then(response => response.json())
        .then(astroData => {
            const isFullMoon = astroData.astronomy.astro.moon_phase === "Full Moon";
            if (isFullMoon) {
                plantData.lunarMutation = true;
            }

            return fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${LOCATION}`);
        })
        .then(response => response.json())
        .then(weatherData => {
            const condition = weatherData.current.condition.text;
            if (condition.includes("Rain")) {
                plantData.weatherEffect = "Rain";
            } else {
                plantData.weatherEffect = "Clear";
            }

            localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(plantData));
            localStorage.setItem(WEATHER_TIME_KEY, Date.now());
            localStorage.setItem("plantData", JSON.stringify(plantData));
            drawFrame();
        })
        .catch(error => {
            console.error("Weather fetch failed:", error);
            drawFrame(); // Fallback render
        });
}

let imagesLoaded = 0;
spriteSheet.onload = checkImagesLoaded;
mutationOverlay.onload = checkImagesLoaded;

fetchWeatherAndMoonData();
