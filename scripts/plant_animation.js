const canvas = document.getElementById("plantCanvas");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "/static/sprites/glitch_bloom_sheet.png";

const mutationOverlay = new Image();
mutationOverlay.src = "/static/sprites/mutation_overlay.png";

const frameWidth = 64;
const frameHeight = 64;
let currentFrame = 0;
const totalFrames = 3;

// Determine if mutation should occur (1 in 7 chance)
const mutationActive = Math.floor(Math.random() * 7) === 0;

function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Optionally apply tint before drawing sprite
    if (mutationActive) {
        ctx.fillStyle = "rgba(127, 0, 255, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw plant frame
    ctx.drawImage(spriteSheet, currentFrame * frameWidth, 0, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

    // If mutation is active, draw glitch overlay on top
    if (mutationActive) {
        ctx.drawImage(mutationOverlay, 0, 0);
    }

    currentFrame = (currentFrame + 1) % totalFrames;
}

// Wait for both images to load before starting
let imagesLoaded = 0;
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        setInterval(drawFrame, 1000);
    }
}

spriteSheet.onload = checkImagesLoaded;
mutationOverlay.onload = checkImagesLoaded;
