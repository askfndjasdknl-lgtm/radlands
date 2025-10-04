from backend import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON

class Game(db.Model):
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    player1_name = db.Column(db.String(100), nullable=False)
    player2_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    board_state = db.relationship('BoardState', backref='game', uselist=False, cascade='all, delete-orphan')
    events = db.relationship('GameEvent', backref='game', cascade='all, delete-orphan')

class BoardState(db.Model):
    __tablename__ = 'board_states'
    
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    
    player1_water = db.Column(db.Integer, default=3)
    player2_water = db.Column(db.Integer, default=3)
    
    player1_camps = db.Column(JSON, default=list)
    player2_camps = db.Column(JSON, default=list)
    
    player1_columns = db.Column(JSON, default=list)
    player2_columns = db.Column(JSON, default=list)
    
    player1_deck = db.Column(JSON, default=list)
    player2_deck = db.Column(JSON, default=list)
    
    player1_hand = db.Column(JSON, default=list)
    player2_hand = db.Column(JSON, default=list)
    
    player1_discard = db.Column(JSON, default=list)
    player2_discard = db.Column(JSON, default=list)
    
    start_player = db.Column(db.Integer, default=1)
    current_player = db.Column(db.Integer, default=1)
    turn_number = db.Column(db.Integer, default=1)

class GameEvent(db.Model):
    __tablename__ = 'game_events'
    
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    player = db.Column(db.Integer, nullable=False)
    
    event_name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    water_cost = db.Column(db.Integer, default=0)
    effect = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Card(db.Model):
    __tablename__ = 'cards'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    card_type = db.Column(db.String(20), nullable=False)
    water_cost = db.Column(db.Integer, default=0)
    
    abilities = db.Column(JSON, default=list)
    traits = db.Column(JSON, default=list)
    junk_effect = db.Column(db.Text)
    
    event_effect = db.Column(db.Text)
    bomb_position = db.Column(db.Integer)
    initial_draw = db.Column(db.Integer)
    
    expansion = db.Column(db.String(50), default='base')
