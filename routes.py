from flask import render_template, jsonify, request, redirect, url_for, session
from app import app, db
from models import GameState, LoreEcho, PlantMutation, VisitorSession
from game_logic import GameLogic
from weather_service import WeatherService
import logging
import uuid
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def track_visitor():
    """Track visitor session and engagement"""
    # Generate session ID if not exists
    if 'visitor_id' not in session:
        session['visitor_id'] = str(uuid.uuid4())
        session['visit_start'] = datetime.utcnow().isoformat()
    
    # Get or create visitor session
    visitor = VisitorSession.query.filter_by(session_id=session['visitor_id']).first()
    if not visitor:
        visitor = VisitorSession()
        visitor.session_id = session['visitor_id']
        db.session.add(visitor)
    else:
        visitor.page_views += 1
        visitor.update_activity()
        
        # Calculate time spent
        if 'visit_start' in session:
            try:
                start_time = datetime.fromisoformat(session['visit_start'])
                time_spent = (datetime.utcnow() - start_time).seconds
                visitor.total_time_spent = time_spent
                visitor.calculate_engagement()
            except:
                pass
    
    db.session.commit()
    return visitor

@app.route('/')
def index():
    """Main garden interface"""
    try:
        # Track visitor engagement
        visitor = track_visitor()
        
        # Get or create game state
        game_state = GameState.query.first()
        if not game_state:
            game_state = GameState()
            db.session.add(game_state)
            db.session.commit()
        
        # Initialize game logic
        game_logic = GameLogic(game_state)
        
        # Trigger visitor-based echo if new visitor
        if visitor.page_views == 1:
            game_logic.generate_lore_echo('visitor')
        
        # Check for autonomous updates
        weather_service = WeatherService()
        weather_data = weather_service.get_current_weather()
        
        # Trigger mutations and updates
        garden_data = game_logic.update_garden(weather_data)
        
        # Trigger engagement echoes and new plants for devoted visitors
        if visitor.engagement_level in ['engaged', 'devoted']:
            if visitor.page_views % 5 == 0:  # Every 5th page view
                game_logic.generate_lore_echo('engagement')
                
                # Spawn a new plant for highly engaged visitors
                if visitor.page_views % 10 == 0 and len(garden_data.get('plants', [])) < 15:
                    new_plant = game_logic.spawn_new_plant(garden_data, trigger_reason="engagement")
                    if new_plant:
                        game_state.set_garden_data(garden_data)
                        db.session.commit()
        
        return render_template('index.html', 
                             garden_data=garden_data,
                             weather_data=weather_data,
                             mutation_count=game_state.mutation_count,
                             supporter_level=game_state.supporter_level,
                             visitor_engagement=visitor.engagement_level,
                             total_visitors=VisitorSession.query.count())
    
    except Exception as e:
        logger.error(f"Error in index route: {e}")
        return render_template('index.html', 
                             garden_data={},
                             weather_data={},
                             mutation_count=0,
                             supporter_level=0,
                             visitor_engagement='unknown',
                             total_visitors=0)

@app.route('/archive')
def archive():
    """Lore echo archive terminal"""
    try:
        game_state = GameState.query.first()
        lore_archive = []
        
        if game_state:
            lore_archive = game_state.get_lore_archive()
        
        # Get all lore echoes for display
        all_echoes = LoreEcho.query.order_by(LoreEcho.created_at.desc()).all()
        
        return render_template('archive.html', 
                             lore_archive=lore_archive,
                             all_echoes=all_echoes)
    
    except Exception as e:
        logger.error(f"Error in archive route: {e}")
        return render_template('archive.html', 
                             lore_archive=[],
                             all_echoes=[])

@app.route('/thankyou')
def thankyou():
    """Ko-fi supporter thank you page"""
    try:
        # Log supporter visit
        game_state = GameState.query.first()
        if game_state:
            game_logic = GameLogic(game_state)
            game_logic.trigger_supporter_bonus()
        
        return render_template('thankyou.html')
    
    except Exception as e:
        logger.error(f"Error in thankyou route: {e}")
        return render_template('thankyou.html')

@app.route('/api/garden/status')
def api_garden_status():
    """API endpoint for garden status updates"""
    try:
        game_state = GameState.query.first()
        if not game_state:
            return jsonify({'error': 'No game state found'}), 404
        
        return jsonify({
            'garden_data': game_state.get_garden_data(),
            'mutation_count': game_state.mutation_count,
            'supporter_level': game_state.supporter_level,
            'last_mutation': game_state.last_mutation.isoformat() if game_state.last_mutation else None
        })
    
    except Exception as e:
        logger.error(f"Error in api_garden_status: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/lore/latest')
def api_latest_lore():
    """Get latest lore echo"""
    try:
        latest_echo = LoreEcho.query.order_by(LoreEcho.created_at.desc()).first()
        if latest_echo:
            return jsonify({
                'echo_text': latest_echo.echo_text,
                'trigger_type': latest_echo.trigger_type,
                'rarity': latest_echo.rarity,
                'created_at': latest_echo.created_at.isoformat()
            })
        else:
            return jsonify({'echo_text': 'The garden whispers... but you cannot yet hear.', 'trigger_type': 'init', 'rarity': 'common'})
    
    except Exception as e:
        logger.error(f"Error in api_latest_lore: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return render_template('index.html'), 500
