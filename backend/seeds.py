from backend import db
from backend.models import Card

def seed_cards():
    """Seed the database with Radlands cards from the rulebook"""
    
    cards_data = []
    
    cards_data.extend([
        {
            "name": "Mechanic",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Restore a damaged card", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Restore",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Sniper",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [{"description": "Damage any target", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Raider",
            "card_type": "person",
            "water_cost": 1,
            "abilities": [{"description": "Damage unprotected card", "water_cost": 0}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Medic",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Draw a card", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Draw",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Scout",
            "card_type": "person",
            "water_cost": 1,
            "abilities": [],
            "traits": [],
            "junk_effect": "Draw",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Guard",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [],
            "traits": ["Protected"],
            "junk_effect": "Gain punk",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Engineer",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [{"description": "Gain 2 extra water", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Extra water",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Warrior",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Defender",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [],
            "traits": ["Shield"],
            "junk_effect": "Restore",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Assassin",
            "card_type": "person",
            "water_cost": 4,
            "abilities": [{"description": "Destroy unprotected person", "water_cost": 3}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Gunner",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Damage any person", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Tank",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [],
            "traits": ["Protected", "Shield"],
            "junk_effect": "Gain punk",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Demolisher",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [{"description": "Destroy a damaged card", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Commando",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [{"description": "Damage 2 unprotected cards", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Hoarder",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Draw 2 cards", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Draw",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Bomber",
            "card_type": "person",
            "water_cost": 3,
            "abilities": [{"description": "Damage all people in a column", "water_cost": 2}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Saboteur",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Damage a camp", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Supplier",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Gain 1 extra water", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Extra water",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Recruiter",
            "card_type": "person",
            "water_cost": 2,
            "abilities": [{"description": "Gain a punk", "water_cost": 1}],
            "traits": [],
            "junk_effect": "Gain punk",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Lookout",
            "card_type": "person",
            "water_cost": 1,
            "abilities": [{"description": "Look at opponent's hand", "water_cost": 0}],
            "traits": [],
            "junk_effect": "Draw",
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": None,
            "expansion": "base"
        },
    ])
    
    cards_data.extend([
        {
            "name": "Sandstorm",
            "card_type": "event",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": "All players discard 1 card",
            "bomb_position": 2,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Acid Rain",
            "card_type": "event",
            "water_cost": 3,
            "abilities": [],
            "traits": [],
            "junk_effect": "Restore",
            "event_effect": "Damage all people",
            "bomb_position": 3,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Supply Drop",
            "card_type": "event",
            "water_cost": 1,
            "abilities": [],
            "traits": [],
            "junk_effect": "Draw",
            "event_effect": "Draw 2 cards",
            "bomb_position": 1,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Raid",
            "card_type": "event",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": "Damage any camp",
            "bomb_position": 2,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Scavenge",
            "card_type": "event",
            "water_cost": 3,
            "abilities": [],
            "traits": [],
            "junk_effect": "Extra water",
            "event_effect": "Gain 3 extra water",
            "bomb_position": 3,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Ambush",
            "card_type": "event",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": "Damage 2 unprotected cards",
            "bomb_position": 1,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Fortify",
            "card_type": "event",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Gain punk",
            "event_effect": "Gain 2 punks",
            "bomb_position": 2,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Betrayal",
            "card_type": "event",
            "water_cost": 4,
            "abilities": [],
            "traits": [],
            "junk_effect": "Destroy",
            "event_effect": "Destroy a person",
            "bomb_position": 3,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Rally",
            "card_type": "event",
            "water_cost": 2,
            "abilities": [],
            "traits": [],
            "junk_effect": "Restore",
            "event_effect": "Restore all your damaged cards",
            "bomb_position": 2,
            "initial_draw": None,
            "expansion": "base"
        },
        {
            "name": "Firestorm",
            "card_type": "event",
            "water_cost": 3,
            "abilities": [],
            "traits": [],
            "junk_effect": "Damage",
            "event_effect": "Damage all camps",
            "bomb_position": 1,
            "initial_draw": None,
            "expansion": "base"
        },
    ])
    
    cards_data.extend([
        {
            "name": "Base Camp",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Draw a card", "water_cost": 2}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
        {
            "name": "Supply Depot",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Gain 2 extra water", "water_cost": 1}],
            "traits": ["Water"],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
        {
            "name": "Sniper Tower",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Damage any target", "water_cost": 2}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 1,
            "expansion": "base"
        },
        {
            "name": "Medical Bay",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Restore a card", "water_cost": 1}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
        {
            "name": "Armory",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Damage unprotected card", "water_cost": 1}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 1,
            "expansion": "base"
        },
        {
            "name": "Garage",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Gain a punk", "water_cost": 1}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
        {
            "name": "Railgun",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Damage any 2 targets", "water_cost": 3}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 1,
            "expansion": "base"
        },
        {
            "name": "Arcade",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Draw 2 cards", "water_cost": 3}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
        {
            "name": "Victory Totem",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Damage camp", "water_cost": 2}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 1,
            "expansion": "base"
        },
        {
            "name": "Mercenary Camp",
            "card_type": "camp",
            "water_cost": 0,
            "abilities": [{"description": "Play person for -1 cost", "water_cost": 0}],
            "traits": [],
            "junk_effect": None,
            "event_effect": None,
            "bomb_position": None,
            "initial_draw": 2,
            "expansion": "base"
        },
    ])
    
    added_count = 0
    updated_count = 0
    
    for card_data in cards_data:
        existing = Card.query.filter_by(name=card_data['name']).first()
        if existing:
            for key, value in card_data.items():
                setattr(existing, key, value)
            updated_count += 1
        else:
            card = Card(**card_data)
            db.session.add(card)
            added_count += 1
    
    db.session.commit()
    
    return {
        "added": added_count,
        "updated": updated_count,
        "total": len(cards_data)
    }
