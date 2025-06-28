import json
import random
from datetime import datetime, timedelta
from models import LoreEcho, PlantMutation
from app import db
import logging

logger = logging.getLogger(__name__)

class GameLogic:
    def __init__(self, game_state):
        self.game_state = game_state
        self.load_game_data()
    
    def load_game_data(self):
        """Load game configuration data"""
        try:
            with open('data/lore_echoes.json', 'r') as f:
                self.lore_echoes = json.load(f)
            
            with open('data/plant_types.json', 'r') as f:
                self.plant_types = json.load(f)
            
            with open('data/mutations.json', 'r') as f:
                self.mutations = json.load(f)
        
        except Exception as e:
            logger.error(f"Error loading game data: {e}")
            # Default fallback data
            self.lore_echoes = {
                "weather": ["The rain remembers what you tried to forget."],
                "mutation": ["Something shifts in the digital soil."],
                "supporter": ["The code acknowledges your presence."],
                "time": ["Time fractures. The garden persists."]
            }
            self.plant_types = {"basic_bloom": {"name": "Glitch Bloom", "rarity": "common"}}
            self.mutations = {"purple_glitch": {"name": "Purple Glitch", "trigger": "rain"}}
    
    def update_garden(self, weather_data):
        """Main garden update logic"""
        garden_data = self.game_state.get_garden_data()
        
        # Initialize garden if empty
        if not garden_data:
            garden_data = self.initialize_garden()
        
        # Check for weather-triggered mutations
        if weather_data and self.should_trigger_mutation(weather_data):
            self.trigger_mutation(garden_data, weather_data)
        
        # Autonomous growth updates
        self.update_plant_growth(garden_data)
        
        # Random lore echoes
        if random.random() < 0.15:  # 15% chance
            self.generate_lore_echo("time")
        
        # Save updated garden data
        self.game_state.set_garden_data(garden_data)
        self.game_state.updated_at = datetime.utcnow()
        db.session.commit()
        
        return garden_data
    
    def initialize_garden(self):
        """Initialize a new garden"""
        garden_data = {
            "plants": [
                {
                    "id": "plant_001",
                    "type": "basic_bloom",
                    "stage": 1,
                    "x": 150,
                    "y": 200,
                    "mutations": [],
                    "last_growth": datetime.utcnow().isoformat()
                },
                {
                    "id": "plant_002", 
                    "type": "basic_bloom",
                    "stage": 0,
                    "x": 300,
                    "y": 180,
                    "mutations": [],
                    "last_growth": datetime.utcnow().isoformat()
                }
            ],
            "effects": [],
            "garden_level": 1,
            "total_blooms": 0
        }
        
        # Generate initial lore echo
        self.generate_lore_echo("init")
        
        return garden_data
    
    def should_trigger_mutation(self, weather_data):
        """Check if weather conditions should trigger a mutation"""
        if not weather_data:
            return False
        
        # Check time since last mutation
        if self.game_state.last_mutation:
            time_diff = datetime.utcnow() - self.game_state.last_mutation
            if time_diff < timedelta(hours=1):  # Minimum 1 hour between mutations
                return False
        
        # Weather-based triggers
        weather_main = weather_data.get('weather', {}).get('main', '').lower()
        
        # Map WeatherAPI conditions to mutation chances
        mutation_chances = {}
        if 'rain' in weather_main or 'drizzle' in weather_main:
            mutation_chances['rain'] = 0.4
        elif 'thunderstorm' in weather_main or 'storm' in weather_main:
            mutation_chances['thunderstorm'] = 0.6
        elif 'snow' in weather_main or 'blizzard' in weather_main:
            mutation_chances['snow'] = 0.3
        elif 'clear' in weather_main or 'sunny' in weather_main:
            mutation_chances['clear'] = 0.1
        elif 'cloud' in weather_main or 'overcast' in weather_main:
            mutation_chances['clouds'] = 0.2
        else:
            mutation_chances['other'] = 0.05
        
        # Get the first matching condition
        for condition, chance in mutation_chances.items():
            return random.random() < chance
        
        return random.random() < 0.05
    
    def trigger_mutation(self, garden_data, weather_data):
        """Trigger a plant mutation"""
        if not garden_data.get('plants'):
            return
        
        # Select random plant for mutation
        plant = random.choice(garden_data['plants'])
        
        # Select mutation based on weather
        weather_main = weather_data.get('weather', {}).get('main', '').lower()
        available_mutations = [m for m in self.mutations.values() 
                             if m.get('trigger', '').lower() == weather_main]
        
        if not available_mutations:
            available_mutations = list(self.mutations.values())
        
        mutation = random.choice(available_mutations)
        
        # Apply mutation
        if 'mutations' not in plant:
            plant['mutations'] = []
        
        plant['mutations'].append({
            'type': mutation.get('name', 'Unknown Mutation'),
            'applied_at': datetime.utcnow().isoformat(),
            'weather_trigger': weather_main
        })
        
        # Update counters
        self.game_state.mutation_count += 1
        self.game_state.last_mutation = datetime.utcnow()
        
        # Log mutation
        mutation_record = PlantMutation()
        mutation_record.plant_id = plant['id']
        mutation_record.mutation_type = mutation.get('name', 'Unknown')
        mutation_record.weather_trigger = weather_main
        db.session.add(mutation_record)
        
        # Generate lore echo
        self.generate_lore_echo("mutation")
        
        logger.info(f"Mutation triggered: {mutation.get('name')} on {plant['id']} due to {weather_main}")
    
    def update_plant_growth(self, garden_data):
        """Update autonomous plant growth"""
        for plant in garden_data.get('plants', []):
            last_growth = datetime.fromisoformat(plant.get('last_growth', datetime.utcnow().isoformat()))
            time_diff = datetime.utcnow() - last_growth
            
            # Growth every 30 minutes
            if time_diff > timedelta(minutes=30):
                plant['stage'] = min(plant['stage'] + 1, 5)  # Max stage 5
                plant['last_growth'] = datetime.utcnow().isoformat()
                
                if plant['stage'] >= 3:  # Blooming stage
                    garden_data['total_blooms'] = garden_data.get('total_blooms', 0) + 1
    
    def generate_lore_echo(self, trigger_type):
        """Generate and save a new lore echo"""
        echoes = self.lore_echoes.get(trigger_type, self.lore_echoes.get('time', ['The void whispers.']))
        echo_text = random.choice(echoes)
        
        # Determine rarity
        rarity = 'common'
        if random.random() < 0.1:  # 10% legendary
            rarity = 'legendary'
        elif random.random() < 0.3:  # 30% rare
            rarity = 'rare'
        
        # Save to database
        lore_echo = LoreEcho()
        lore_echo.echo_text = echo_text
        lore_echo.trigger_type = trigger_type
        lore_echo.rarity = rarity
        db.session.add(lore_echo)
        
        # Update archive
        archive = self.game_state.get_lore_archive()
        archive.append({
            'text': echo_text,
            'type': trigger_type,
            'rarity': rarity,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Keep only last 50 echoes in memory
        if len(archive) > 50:
            archive = archive[-50:]
        
        self.game_state.set_lore_archive(archive)
        
        logger.info(f"Generated {rarity} lore echo: {echo_text}")
    
    def spawn_new_plant(self, garden_data, plant_type=None, trigger_reason="natural"):
        """Spawn a new plant in the garden"""
        import random
        
        if not plant_type:
            # Select plant type based on rarity and trigger
            if trigger_reason == "engagement":
                # Favor rarer plants for engaged visitors
                rare_plants = [k for k, v in self.plant_types.items() if v.get('rarity') in ['rare', 'legendary']]
                common_plants = [k for k, v in self.plant_types.items() if v.get('rarity') == 'common']
                plant_type = random.choice(rare_plants + common_plants + common_plants)  # Still mostly common
            else:
                # Normal distribution
                all_plants = list(self.plant_types.keys())
                plant_type = random.choice(all_plants)
        
        # Find available location
        existing_positions = [(p['x'], p['y']) for p in garden_data.get('plants', [])]
        max_attempts = 20
        
        for _ in range(max_attempts):
            x = random.randint(50, 650)
            y = random.randint(150, 350)
            
            # Check if position is too close to existing plants
            too_close = False
            for ex_x, ex_y in existing_positions:
                if abs(x - ex_x) < 80 and abs(y - ex_y) < 80:
                    too_close = True
                    break
            
            if not too_close:
                # Create new plant
                new_plant = {
                    'id': f"plant_{len(garden_data.get('plants', [])) + 1:03d}",
                    'type': plant_type,
                    'stage': 0,
                    'mutations': [],
                    'x': x,
                    'y': y,
                    'last_growth': datetime.utcnow().isoformat(),
                    'spawn_reason': trigger_reason
                }
                
                garden_data.setdefault('plants', []).append(new_plant)
                logger.info(f"Spawned new {plant_type} at ({x}, {y}) due to {trigger_reason}")
                
                # Generate spawn-specific lore echo
                if trigger_reason == "engagement":
                    self.generate_lore_echo('mystery')
                elif trigger_reason == "visitor":
                    self.generate_lore_echo('visitor')
                
                return new_plant
        
        logger.warning("Could not find suitable location for new plant")
        return None
    
    def trigger_supporter_bonus(self):
        """Trigger bonus effects for Ko-fi supporters"""
        self.game_state.supporter_level += 1
        
        # Generate special supporter lore echo
        self.generate_lore_echo("supporter")
        
        # Bonus mutation chance
        garden_data = self.game_state.get_garden_data()
        if garden_data and random.random() < 0.5:  # 50% chance for bonus mutation
            self.trigger_mutation(garden_data, {'weather': {'main': 'supporter_bonus'}})
            self.game_state.set_garden_data(garden_data)
        
        db.session.commit()
        logger.info(f"Supporter bonus triggered. Level: {self.game_state.supporter_level}")
