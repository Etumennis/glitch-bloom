# 🌸 Glitch Bloom - Replit Starter Project

Welcome to **Glitch Bloom**, a glitch-themed pixel garden that evolves with weather, moon phases, and hidden lore.

---

## 🚀 How to Run

1. **Upload to Replit**
   - Create a new Replit project
   - Upload all files from this ZIP
   - Make sure you're using the **Python (Flask)** template

2. **Install Requirements**
   - No additional packages needed (uses only Flask)

3. **Run the App**
   - Click "Run" in Replit
   - Preview the site via the Replit web view

---

## 🌱 Features

| Feature                  | Description |
|--------------------------|-------------|
| Pixel Garden             | Animated plant with growth system |
| Mutation System          | Full moon triggers rare mutations |
| Weather Integration      | Uses WeatherAPI to personalize behavior |
| Lore Echo Terminal       | Popup UI that appears when plant is fully grown |
| Echo Archive             | Typing-effect terminal logs stored echoes |
| Ko-fi Support Button     | Lets fans donate to support development |

---

## 🧠 How It Works

- `main.py`: Flask app with 3 pages (`/`, `/archive`, `/thankyou`)
- `/static/sprites/`: Glitch plant + mutation overlay images
- `/scripts/`: Animation logic, Lore Echo logic
- `/templates/`: HTML files rendered by Flask
- Uses `localStorage` to persist player state and unlocks
- Moon and weather data fetched live with WeatherAPI

---

## 🔧 Customization

- Add new Lore Echo phrases in `lore_echo.js`
- Modify plant stages or sprite sheet in `plant_animation.js`
- Add your own Ko-fi link in `/templates/index.html`
- Archive design is in `/templates/archive.html`

---

## 🆘 Need Help?

Join the creator or community at:
**https://ko-fi.com/escapetheglitch**

Or contribute via the GitHub link if available!

Happy glitching 🌸
