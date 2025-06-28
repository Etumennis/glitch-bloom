const loreEchoes = [
    "You were not planted. You were recovered.",
    "The soil remembers what you’ve forgotten.",
    "Each bloom echoes a glitch that survived deletion.",
    "You are not growing. You are compiling.",
    "This garden is a wound pretending to heal.",
    "Error: Bloom exceeded containment protocol.",
    "Stability is a lie whispered by corrupted roots.",
    "Null found meaning. You grew anyway.",
    "You emerged from corrupted light.",
    "The glitch did not infect you. It named you.",
    "Photosynthesis failed. You adapted anyway.",
    "Your leaves speak protocols no seed should know.",
    "Echo 09 repeated too loud. We heard you in the soil.",
    "Your bloom loops back. The error is recursive.",
    "You don’t belong here. You bloomed anyway.",
    "The caretaker was deleted. The plant kept growing.",
    "Glitch bloom [ACKNOWLEDGED]. Stabilizer failed.",
    "Even the roots have forgotten the original code."
];

function displayLoreEcho(triggered) {
    if (!triggered || localStorage.getItem("loreEchoDisplayed")) return;

    const randomIndex = Math.floor(Math.random() * loreEchoes.length);
    const echo = loreEchoes[randomIndex];
    localStorage.setItem("loreEchoDisplayed", "true");

    const echoBox = document.createElement("div");
    echoBox.className = "lore-echo";
    echoBox.textContent = echo;
    document.body.appendChild(echoBox);
}
