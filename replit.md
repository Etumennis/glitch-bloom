# Glitch Bloom - Replit Development Guide

## Overview

Glitch Bloom is an autonomous passive income web application built with Flask that simulates a digital garden. The app creates a self-growing pixel garden where weather data triggers plant mutations and generates cryptic lore echoes. The project combines glitch-core aesthetics with idle game mechanics, designed to run autonomously with minimal user interaction while monetizing through Ko-fi donations.

## System Architecture

### Backend Architecture
- **Framework**: Flask web application with SQLAlchemy ORM
- **Database**: SQLite with fallback to PostgreSQL (configurable via DATABASE_URL)
- **Application Structure**: Modular design with separate files for routes, models, game logic, and weather services
- **Session Management**: Flask sessions with configurable secret key
- **Middleware**: ProxyFix for handling proxy headers in production environments

### Frontend Architecture
- **Template Engine**: Jinja2 templates with base template inheritance
- **Styling**: Custom CSS with glitch-core aesthetics, Bootstrap 5 for responsive layout
- **JavaScript**: Vanilla JavaScript for garden animations and real-time updates
- **Visual Design**: Purple/pink glitch theme with matrix-style effects and pixel art elements

### Data Storage Solutions
- **Primary Models**:
  - `GameState`: Core game state including garden data, lore archive, mutation counts
  - `LoreEcho`: Individual lore entries with trigger types and rarity
  - `PlantMutation`: Plant mutation records with weather triggers
- **JSON Storage**: Game configuration data stored in JSON files (lore echoes, plant types, mutations)
- **Serialization**: JSON serialization for complex data structures stored in database text fields

## Key Components

### Game Logic Engine (`game_logic.py`)
- **Purpose**: Manages autonomous garden updates, mutation triggers, and game state progression
- **Key Features**: Weather-based mutation system, lore echo generation, garden initialization
- **Architecture Decision**: Centralized game logic allows for consistent rule application and easy expansion

### Weather Service (`weather_service.py`)
- **Purpose**: Integrates with OpenWeatherMap API to fetch real-world weather data
- **Caching Strategy**: 30-minute cache duration to minimize API calls and improve performance
- **Fallback System**: Graceful degradation with mock weather data when API is unavailable
- **Rate Limiting**: Built-in throttling to respect API limits

### Template System
- **Base Template**: Unified layout with navigation, glitch effects, and responsive design
- **Page Templates**: 
  - `index.html`: Main garden interface with plant visualization
  - `archive.html`: Terminal-style lore echo archive
  - `thankyou.html`: Ko-fi donation acknowledgment page

### Static Assets
- **CSS Framework**: Custom glitch.css with CSS variables for consistent theming
- **JavaScript Modules**: 
  - `garden.js`: Core garden functionality and auto-updates
  - `glitch-effects.js`: Advanced visual effects and animations

## Data Flow

### Garden Update Cycle
1. **Weather Check**: WeatherService fetches current conditions with caching
2. **Mutation Processing**: GameLogic evaluates weather triggers against mutation rules
3. **State Update**: Database updates with new mutations, lore echoes, and timestamps
4. **Client Refresh**: Frontend polls for updates every 30 seconds via AJAX

### Lore Generation Flow
1. **Trigger Detection**: System identifies trigger events (weather, mutations, supporter actions)
2. **Echo Selection**: Random selection from categorized lore echo pools
3. **Archive Update**: New echoes added to persistent lore archive
4. **Display Update**: Frontend displays latest echoes with terminal aesthetics

### Monetization Flow
1. **Ko-fi Integration**: External donation platform integration
2. **Supporter Recognition**: Donation callbacks trigger supporter level increases
3. **Gameplay Benefits**: Supporter status unlocks enhanced mutation rates and rare echoes

## External Dependencies

### Required APIs
- **OpenWeatherMap API**: Real-world weather data for mutation triggers
- **Ko-fi**: Donation processing and supporter management

### Python Dependencies
- **Flask**: Web framework and routing
- **SQLAlchemy**: Database ORM and migrations
- **Requests**: HTTP client for weather API calls
- **Werkzeug**: WSGI utilities and development server

### Frontend Dependencies
- **Bootstrap 5**: Responsive CSS framework
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: JetBrains Mono for glitch aesthetic
- **jQuery**: DOM manipulation and AJAX requests

## Deployment Strategy

### Environment Configuration
- **Database**: Configurable via DATABASE_URL environment variable
- **API Keys**: OpenWeatherMap API key via OPENWEATHER_API_KEY
- **Security**: Session secret via SESSION_SECRET environment variable

### Production Considerations
- **Proxy Handling**: ProxyFix middleware for reverse proxy deployments
- **Database Pooling**: Connection pool with recycle and ping settings
- **Error Handling**: Comprehensive logging and graceful fallbacks

### Scaling Strategy
- **Stateless Design**: All state stored in database for horizontal scaling
- **Caching**: Weather data caching reduces external API dependencies
- **Asset Optimization**: Static files served efficiently with proper caching headers

## Changelog
- June 28, 2025: Initial setup with complete glitchcore garden application
- June 28, 2025: Added visitor tracking system with engagement-based rewards
- June 28, 2025: Expanded plant types (14 varieties) and lore echoes (100+ messages)
- June 28, 2025: Implemented dynamic plant spawning for engaged visitors
- June 28, 2025: Added comprehensive engagement optimization for passive income

## Current Status
- **Application State**: Fully functional autonomous garden with Ko-fi integration
- **Plant System**: 14 plant types from basic blooms to legendary neural networks
- **Mutation System**: 15+ weather-triggered mutations with visual effects
- **Visitor Tracking**: Session-based engagement monitoring with reward tiers
- **Lore System**: 100+ categorized echoes including visitor, engagement, and mystery types
- **WeatherAPI Key**: 7257a00f01694f05a3755333252806 (pending 24-hour activation)

## User Preferences

Preferred communication style: Simple, everyday language.
WeatherAPI Integration: Test key "7257a00f01694f05a3755333252806" in 24 hours for real weather mutations.