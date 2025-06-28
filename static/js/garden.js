// Glitch Bloom Garden JavaScript
let gardenState = {};
let weatherData = {};
let autoUpdateInterval;
let echoTimeout;

// Initialize garden
function initializeGarden(initialGardenData, initialWeatherData) {
    gardenState = initialGardenData || {};
    weatherData = initialWeatherData || {};
    
    console.log('Initializing Glitch Bloom Garden...', gardenState);
    
    // Start automatic updates
    startAutoUpdate();
    
    // Initialize plant animations
    initializePlantAnimations();
    
    // Initialize weather effects
    initializeWeatherEffects();
    
    // Load latest lore echo
    loadLatestEcho();
    
    // Start glitch effects
    startGlitchEffects();
}

// Auto-update garden state
function startAutoUpdate() {
    // Update every 30 seconds
    autoUpdateInterval = setInterval(() => {
        updateGardenStatus();
    }, 30000);
    
    // Initial update after 5 seconds
    setTimeout(() => {
        updateGardenStatus();
    }, 5000);
}

// Update garden status from server
async function updateGardenStatus() {
    try {
        showLoading();
        
        const response = await fetch('/api/garden/status');
        if (response.ok) {
            const data = await response.json();
            
            // Update local state
            gardenState = data.garden_data || {};
            
            // Update UI elements
            updateStatsDisplay(data);
            updatePlantsDisplay();
            
            // Show update notification
            showUpdateNotification();
            
            console.log('Garden updated:', data);
        }
    } catch (error) {
        console.error('Failed to update garden:', error);
    } finally {
        hideLoading();
    }
}

// Update stats display
function updateStatsDisplay(data) {
    const mutationCount = document.getElementById('mutation-count');
    const supporterLevel = document.getElementById('supporter-level');
    const plantCount = document.getElementById('plant-count');
    const gardenLevel = document.getElementById('garden-level');
    const totalBlooms = document.getElementById('total-blooms');
    
    if (mutationCount) mutationCount.textContent = data.mutation_count || 0;
    if (supporterLevel) supporterLevel.textContent = data.supporter_level || 0;
    if (plantCount) plantCount.textContent = gardenState.plants ? gardenState.plants.length : 0;
    if (gardenLevel) gardenLevel.textContent = gardenState.garden_level || 1;
    if (totalBlooms) totalBlooms.textContent = gardenState.total_blooms || 0;
}

// Update plants display
function updatePlantsDisplay() {
    const container = document.getElementById('plants-container');
    if (!container || !gardenState.plants) return;
    
    // Clear existing plants
    container.innerHTML = '';
    
    // Add plants
    gardenState.plants.forEach(plant => {
        const plantElement = createPlantElement(plant);
        container.appendChild(plantElement);
    });
    
    // Reinitialize animations
    initializePlantAnimations();
}

// Create plant element
function createPlantElement(plant) {
    const plantDiv = document.createElement('div');
    plantDiv.className = 'plant-sprite';
    plantDiv.dataset.plantId = plant.id;
    plantDiv.dataset.plantType = plant.type;
    plantDiv.dataset.plantStage = plant.stage;
    plantDiv.style.left = plant.x + 'px';
    plantDiv.style.top = plant.y + 'px';
    
    // Plant visual
    const visual = document.createElement('div');
    visual.className = `plant-visual stage-${plant.stage}`;
    
    const base = document.createElement('div');
    base.className = 'plant-base';
    visual.appendChild(base);
    
    const bloom = document.createElement('div');
    bloom.className = 'plant-bloom';
    visual.appendChild(bloom);
    
    // Mutations
    if (plant.mutations && plant.mutations.length > 0) {
        const mutationEffects = document.createElement('div');
        mutationEffects.className = 'mutation-effects';
        
        plant.mutations.forEach(mutation => {
            const effect = document.createElement('div');
            effect.className = `mutation-effect ${mutation.type.toLowerCase().replace(/\s+/g, '-')}`;
            mutationEffects.appendChild(effect);
        });
        
        visual.appendChild(mutationEffects);
    }
    
    plantDiv.appendChild(visual);
    
    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'plant-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">${plant.type.replace(/_/g, ' ').toUpperCase()}</div>
        <div class="tooltip-stage">Stage: ${plant.stage}/5</div>
        ${plant.mutations ? `<div class="tooltip-mutations">Mutations: ${plant.mutations.length}</div>` : ''}
    `;
    plantDiv.appendChild(tooltip);
    
    return plantDiv;
}

// Initialize plant animations
function initializePlantAnimations() {
    const plants = document.querySelectorAll('.plant-sprite');
    
    plants.forEach((plant, index) => {
        // Stagger animation start
        setTimeout(() => {
            plant.style.opacity = '0';
            plant.style.transform = 'translateY(10px)';
            plant.style.transition = 'all 0.5s ease-out';
            
            requestAnimationFrame(() => {
                plant.style.opacity = '1';
                plant.style.transform = 'translateY(0)';
            });
        }, index * 100);
        
        // Add subtle sway animation
        if (parseInt(plant.dataset.plantStage) >= 2) {
            plant.style.animation = `plantSway ${2 + Math.random() * 2}s infinite ease-in-out`;
            plant.style.animationDelay = Math.random() * 2 + 's';
        }
    });
}

// Initialize weather effects
function initializeWeatherEffects() {
    const weatherEffects = document.getElementById('weather-effects');
    if (!weatherEffects || !weatherData.weather) return;
    
    const weatherType = weatherData.weather.main.toLowerCase();
    
    // Clear existing effects
    weatherEffects.innerHTML = '';
    
    switch (weatherType) {
        case 'rain':
            createRainEffect(weatherEffects);
            break;
        case 'snow':
            createSnowEffect(weatherEffects);
            break;
        case 'thunderstorm':
            createStormEffect(weatherEffects);
            break;
    }
}

// Create rain effect
function createRainEffect(container) {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-effect';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
        container.appendChild(drop);
    }
}

// Create snow effect
function createSnowEffect(container) {
    for (let i = 0; i < 15; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-effect';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDelay = Math.random() * 3 + 's';
        flake.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(flake);
    }
}

// Create storm effect
function createStormEffect(container) {
    const storm = document.createElement('div');
    storm.className = 'storm-effect';
    container.appendChild(storm);
}

// Load latest lore echo
async function loadLatestEcho() {
    try {
        const response = await fetch('/api/lore/latest');
        if (response.ok) {
            const data = await response.json();
            showEcho(data.echo_text, data.rarity);
        }
    } catch (error) {
        console.error('Failed to load lore echo:', error);
    }
}

// Show echo in terminal
function showEcho(text, rarity = 'common') {
    const terminal = document.getElementById('echo-terminal');
    const echoText = document.getElementById('echo-text');
    
    if (!terminal || !echoText) return;
    
    // Clear any existing timeout
    if (echoTimeout) {
        clearTimeout(echoTimeout);
    }
    
    // Update text and show terminal
    echoText.textContent = text;
    terminal.classList.add('active');
    
    // Add rarity styling
    terminal.className = `echo-terminal active rarity-${rarity}`;
    
    // Hide after 5 seconds
    echoTimeout = setTimeout(() => {
        terminal.classList.remove('active');
    }, 5000);
}

// Start glitch effects
function startGlitchEffects() {
    // Random glitch text effects (much less frequent)
    setInterval(() => {
        const glitchTexts = document.querySelectorAll('.glitch-text');
        glitchTexts.forEach(text => {
            if (Math.random() < 0.02) { // 2% chance instead of 10%
                text.style.animation = 'none';
                text.offsetHeight; // Trigger reflow
                text.style.animation = 'textGlitch 0.3s ease-out';
            }
        });
    }, 5000); // Every 5 seconds instead of 2
    
    // Random screen glitch (much less frequent)
    setInterval(() => {
        if (Math.random() < 0.01) { // 1% chance instead of 5%
            document.body.style.filter = 'hue-rotate(90deg) saturate(2)';
            setTimeout(() => {
                document.body.style.filter = '';
            }, 50); // Shorter duration
        }
    }, 10000); // Every 10 seconds instead of 3
    
    // Glitch overlay shift (less frequent and subtle)
    const overlay = document.querySelector('.glitch-overlay');
    if (overlay) {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance instead of 20%
                overlay.style.opacity = Math.random() * 0.02 + 0.03;
                setTimeout(() => {
                    overlay.style.opacity = '0.03';
                }, 100); // Shorter duration
            }
        }, 8000); // Every 8 seconds instead of 1.5
    }
}

// Show loading overlay
function showLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.classList.add('active');
    }
}

// Hide loading overlay
function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        setTimeout(() => {
            loading.classList.remove('active');
        }, 500);
    }
}

// Show update notification
function showUpdateNotification() {
    const notification = document.getElementById('refresh-notification');
    if (notification) {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Add CSS animation for plant sway
const style = document.createElement('style');
style.textContent = `
    @keyframes plantSway {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(1deg); }
        75% { transform: rotate(-1deg); }
    }
`;
document.head.appendChild(style);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, reduce update frequency
        if (autoUpdateInterval) {
            clearInterval(autoUpdateInterval);
        }
    } else {
        // Page is visible, resume normal updates
        startAutoUpdate();
        updateGardenStatus(); // Immediate update when returning
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('Garden error:', event.error);
    // Could show a glitch effect or error message
});

// Export functions for debugging
window.gardenDebug = {
    gardenState,
    weatherData,
    updateGardenStatus,
    showEcho,
    startGlitchEffects
};
