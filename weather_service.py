import requests
import os
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.api_key = os.environ.get('WEATHERAPI_KEY', 'demo_key')
        self.base_url = "http://api.weatherapi.com/v1/current.json"
        self.last_fetch = None
        self.cached_data = None
        self.cache_duration = timedelta(minutes=30)  # Cache for 30 minutes
    
    def get_current_weather(self, city="London"):
        """Get current weather data with caching"""
        # Check cache first
        if (self.cached_data and self.last_fetch and 
            datetime.utcnow() - self.last_fetch < self.cache_duration):
            return self.cached_data
        
        try:
            # Make API request to WeatherAPI
            params = {
                'key': self.api_key,
                'q': city,
                'aqi': 'no'
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            
            if response.status_code == 200:
                weather_data = response.json()
                
                # Process and cache the data
                processed_data = self.process_weather_data(weather_data)
                self.cached_data = processed_data
                self.last_fetch = datetime.utcnow()
                
                logger.info(f"Weather data fetched: {processed_data.get('weather', {}).get('main')}")
                return processed_data
            
            else:
                logger.warning(f"Weather API error: {response.status_code}")
                return self.get_fallback_weather()
        
        except requests.RequestException as e:
            logger.error(f"Weather API request failed: {e}")
            return self.get_fallback_weather()
        
        except Exception as e:
            logger.error(f"Unexpected error in weather service: {e}")
            return self.get_fallback_weather()
    
    def process_weather_data(self, raw_data):
        """Process raw weather data into game-relevant format"""
        # WeatherAPI structure is different from OpenWeatherMap
        current = raw_data.get('current', {})
        location = raw_data.get('location', {})
        condition = current.get('condition', {})
        
        return {
            'weather': {
                'main': condition.get('text', 'Unknown'),
                'description': condition.get('text', 'Unknown')
            },
            'temperature': current.get('temp_c', 0),
            'humidity': current.get('humidity', 0),
            'pressure': current.get('pressure_mb', 0),
            'wind_speed': current.get('wind_kph', 0),
            'cloudiness': current.get('cloud', 0),
            'city': location.get('name', 'Unknown'),
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def get_fallback_weather(self):
        """Provide fallback weather data when API is unavailable"""
        import random
        
        weather_types = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Mist']
        
        return {
            'weather': {
                'main': random.choice(weather_types),
                'description': 'Simulated weather for autonomous garden'
            },
            'temperature': random.randint(-5, 35),
            'humidity': random.randint(30, 90),
            'pressure': random.randint(980, 1030),
            'wind_speed': random.uniform(0, 20),
            'cloudiness': random.randint(0, 100),
            'city': 'Digital Realm',
            'timestamp': datetime.utcnow().isoformat(),
            'fallback': True
        }
    
    def get_moon_phase(self):
        """Calculate current moon phase (simplified)"""
        # Simple lunar cycle approximation
        days_since_new_moon = (datetime.utcnow() - datetime(2024, 1, 11)).days % 29.5
        
        if days_since_new_moon < 1:
            return "new_moon"
        elif days_since_new_moon < 7:
            return "waxing_crescent"
        elif days_since_new_moon < 9:
            return "first_quarter"
        elif days_since_new_moon < 15:
            return "waxing_gibbous"
        elif days_since_new_moon < 16:
            return "full_moon"
        elif days_since_new_moon < 22:
            return "waning_gibbous"
        elif days_since_new_moon < 24:
            return "last_quarter"
        else:
            return "waning_crescent"
