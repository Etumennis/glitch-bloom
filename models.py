from app import db
from datetime import datetime
import json

class GameState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    garden_data = db.Column(db.Text, nullable=False, default='{}')
    lore_archive = db.Column(db.Text, nullable=False, default='[]')
    mutation_count = db.Column(db.Integer, default=0)
    supporter_level = db.Column(db.Integer, default=0)
    last_weather_check = db.Column(db.DateTime, default=datetime.utcnow)
    last_mutation = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_garden_data(self):
        """Parse garden data from JSON string"""
        try:
            return json.loads(self.garden_data)
        except:
            return {}
    
    def set_garden_data(self, data):
        """Set garden data as JSON string"""
        self.garden_data = json.dumps(data)
    
    def get_lore_archive(self):
        """Parse lore archive from JSON string"""
        try:
            return json.loads(self.lore_archive)
        except:
            return []
    
    def set_lore_archive(self, data):
        """Set lore archive as JSON string"""
        self.lore_archive = json.dumps(data)

class LoreEcho(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    echo_text = db.Column(db.Text, nullable=False)
    trigger_type = db.Column(db.String(50), nullable=False)  # weather, mutation, supporter, time
    rarity = db.Column(db.String(20), default='common')  # common, rare, legendary
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class PlantMutation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plant_id = db.Column(db.String(50), nullable=False)
    mutation_type = db.Column(db.String(50), nullable=False)
    weather_trigger = db.Column(db.String(30))
    moon_phase = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VisitorSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(128), unique=True, nullable=False)
    first_visit = db.Column(db.DateTime, default=datetime.utcnow)
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    total_time_spent = db.Column(db.Integer, default=0)  # seconds
    page_views = db.Column(db.Integer, default=1)
    interactions = db.Column(db.Integer, default=0)
    engagement_level = db.Column(db.String(20), default='casual')  # casual, interested, engaged, devoted
    
    def update_activity(self):
        """Update last activity timestamp"""
        self.last_activity = datetime.utcnow()
        
    def calculate_engagement(self):
        """Calculate engagement level based on behavior"""
        if self.total_time_spent > 1800:  # 30+ minutes
            self.engagement_level = 'devoted'
        elif self.total_time_spent > 600:  # 10+ minutes
            self.engagement_level = 'engaged'
        elif self.total_time_spent > 180:  # 3+ minutes
            self.engagement_level = 'interested'
        else:
            self.engagement_level = 'casual'
