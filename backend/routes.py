from flask import Blueprint, request, jsonify
from backend import db
from backend.models import Game, BoardState, GameEvent, Card
from sqlalchemy import or_

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Radlands API is running"}), 200

@api_bp.route('/games', methods=['POST'])
def create_game():
    import random
    
    data = request.json
    
    player1_camps = data.get('player1_camps', [])
    player2_camps = data.get('player2_camps', [])
    start_player = data.get('start_player', random.choice([1, 2]))
    
    game = Game(
        player1_name=data.get('player1_name', 'Player 1'),
        player2_name=data.get('player2_name', 'Player 2')
    )
    db.session.add(game)
    db.session.flush()
    
    people_cards = Card.query.filter_by(card_type='people').all()
    event_cards = Card.query.filter_by(card_type='event').all()
    
    deck_card_ids = [card.id for card in people_cards + event_cards]
    
    player1_deck = deck_card_ids.copy()
    player2_deck = deck_card_ids.copy()
    random.shuffle(player1_deck)
    random.shuffle(player2_deck)
    
    player1_initial_draw = sum(camp.get('initial_draw', 0) for camp in player1_camps)
    player2_initial_draw = sum(camp.get('initial_draw', 0) for camp in player2_camps)
    
    player1_hand = player1_deck[:player1_initial_draw]
    player1_deck = player1_deck[player1_initial_draw:]
    
    player2_hand = player2_deck[:player2_initial_draw]
    player2_deck = player2_deck[player2_initial_draw:]
    
    raiders_card = Card.query.filter_by(name='Raiders').first()
    water_silo_card = Card.query.filter_by(name='Water Silo').first()
    
    if raiders_card:
        player1_hand.append(raiders_card.id)
        player2_hand.append(raiders_card.id)
    
    if water_silo_card:
        player1_hand.append(water_silo_card.id)
        player2_hand.append(water_silo_card.id)
    
    board_state = BoardState(
        game_id=game.id,
        player1_camps=player1_camps,
        player2_camps=player2_camps,
        player1_columns=[[], [], []],
        player2_columns=[[], [], []],
        player1_deck=player1_deck,
        player2_deck=player2_deck,
        player1_hand=player1_hand,
        player2_hand=player2_hand,
        player1_discard=[],
        player2_discard=[],
        start_player=start_player,
        current_player=start_player
    )
    db.session.add(board_state)
    db.session.commit()
    
    return jsonify({
        "id": game.id,
        "player1_name": game.player1_name,
        "player2_name": game.player2_name,
        "status": game.status,
        "start_player": start_player,
        "player1_hand_count": len(player1_hand),
        "player2_hand_count": len(player2_hand)
    }), 201

@api_bp.route('/games/<int:game_id>', methods=['GET'])
def get_game(game_id):
    game = Game.query.get_or_404(game_id)
    
    return jsonify({
        "id": game.id,
        "player1_name": game.player1_name,
        "player2_name": game.player2_name,
        "status": game.status,
        "board_state": {
            "player1_water": game.board_state.player1_water,
            "player2_water": game.board_state.player2_water,
            "player1_camps": game.board_state.player1_camps,
            "player2_camps": game.board_state.player2_camps,
            "player1_columns": game.board_state.player1_columns,
            "player2_columns": game.board_state.player2_columns,
            "current_player": game.board_state.current_player,
            "turn_number": game.board_state.turn_number
        }
    }), 200

@api_bp.route('/games/<int:game_id>/water', methods=['POST'])
def update_water(game_id):
    game = Game.query.get_or_404(game_id)
    data = request.json
    
    player = data.get('player')
    amount = data.get('amount')
    
    if player == 1:
        game.board_state.player1_water = max(0, game.board_state.player1_water + amount)
    elif player == 2:
        game.board_state.player2_water = max(0, game.board_state.player2_water + amount)
    
    db.session.commit()
    
    return jsonify({
        "player1_water": game.board_state.player1_water,
        "player2_water": game.board_state.player2_water
    }), 200

@api_bp.route('/games/<int:game_id>/events', methods=['POST'])
def add_event(game_id):
    game = Game.query.get_or_404(game_id)
    data = request.json
    
    event = GameEvent(
        game_id=game_id,
        player=data.get('player'),
        event_name=data.get('event_name'),
        position=data.get('position'),
        water_cost=data.get('water_cost', 0),
        effect=data.get('effect', '')
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify({
        "id": event.id,
        "event_name": event.event_name,
        "position": event.position
    }), 201

@api_bp.route('/games/<int:game_id>/events/<int:event_id>', methods=['DELETE'])
def remove_event(game_id, event_id):
    event = GameEvent.query.filter_by(game_id=game_id, id=event_id).first_or_404()
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({"message": "Event removed"}), 200

@api_bp.route('/games/<int:game_id>/board', methods=['PUT'])
def update_board(game_id):
    game = Game.query.get_or_404(game_id)
    data = request.json
    
    if 'player1_columns' in data:
        game.board_state.player1_columns = data['player1_columns']
    if 'player2_columns' in data:
        game.board_state.player2_columns = data['player2_columns']
    if 'player1_camps' in data:
        game.board_state.player1_camps = data['player1_camps']
    if 'player2_camps' in data:
        game.board_state.player2_camps = data['player2_camps']
    
    db.session.commit()
    
    return jsonify({"message": "Board updated"}), 200

@api_bp.route('/games/<int:game_id>/turn', methods=['POST'])
def next_turn(game_id):
    game = Game.query.get_or_404(game_id)
    
    game.board_state.current_player = 2 if game.board_state.current_player == 1 else 1
    if game.board_state.current_player == 1:
        game.board_state.turn_number += 1
    
    game.board_state.player1_water = 3
    game.board_state.player2_water = 3
    
    db.session.commit()
    
    return jsonify({
        "current_player": game.board_state.current_player,
        "turn_number": game.board_state.turn_number
    }), 200

@api_bp.route('/cards', methods=['GET'])
def get_cards():
    search = request.args.get('search', '')
    card_type = request.args.get('type', '')
    
    query = Card.query
    
    if search:
        query = query.filter(or_(
            Card.name.ilike(f'%{search}%'),
            Card.abilities.cast(db.String).ilike(f'%{search}%')
        ))
    
    if card_type:
        query = query.filter_by(card_type=card_type)
    
    cards = query.all()
    
    return jsonify([{
        "id": card.id,
        "name": card.name,
        "type": card.card_type,
        "water_cost": card.water_cost,
        "abilities": card.abilities,
        "traits": card.traits,
        "junk_effect": card.junk_effect,
        "event_effect": card.event_effect,
        "bomb_position": card.bomb_position,
        "initial_draw": card.initial_draw,
        "expansion": card.expansion
    } for card in cards]), 200

@api_bp.route('/cards/seed', methods=['POST'])
def seed_cards_endpoint():
    from backend.seeds import seed_cards
    
    result = seed_cards()
    
    return jsonify({
        "message": "Cards seeded successfully",
        "added": result["added"],
        "updated": result["updated"],
        "total": result["total"]
    }), 201
