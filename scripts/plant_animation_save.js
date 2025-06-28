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

// Load or initialize plant data
let plantData = JSON.parse(localStorage.getItem("plantData"));
const now = Date.now();
const oneDay = 1000 * 60 * 60 * 24;

if (!plantData) {
    plantData = {
        plantStage: 0,
        mutationActive: Math.floor(Math.random() * 7) === 0,
        adoptionTime: now,
        lastVisit: now
    };
    localStorage.setItem("plantData", JSON.stringify(plantData));
} else {
    // If it's been more than 24h since last visit, grow the plant
    if (now - plantData.lastVisit > oneDay && plantData.plantStage < totalFrames - 1) {
        plantData.plantStage++;
        plantData.lastVisit = now;
        localStorage.setItem("plantData", JSON.stringify(plantData));
    }
}

// Use stored values
currentFrame = plantData.plantStage;
const mutationActive = plantData.mutationActive;

function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mutationActive) {
        ctx.fillStyle = "rgba(127, 0, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(spriteSheet, currentFrame * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

    if (mutationActive) {
        ctx.drawImage(mutationOverlay, 0, 0);
    }
}

let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        drawFrame();
    }
}

spriteSheet.onload = checkImagesLoaded;
mutationOverlay.onload = checkImagesLoaded;
