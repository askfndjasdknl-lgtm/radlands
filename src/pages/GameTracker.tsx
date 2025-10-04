import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import WaterTracker from "@/components/WaterTracker";
import EventQueue from "@/components/EventQueue";
import BoardColumn from "@/components/BoardColumn";
import TurnPhases from "@/components/TurnPhases";

const GameTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    player1 = "Player 1", 
    player2 = "Player 2",
    player1Camps = [],
    player2Camps = []
  } = location.state || {};
  
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isFirstTurn, setIsFirstTurn] = useState(true);

  const handlePhaseChange = (phase: string) => {
    console.log(`Phase changed to: ${phase}`);
  };

  const handleTurnEnd = (nextPlayer: number) => {
    setCurrentPlayer(nextPlayer);
    setIsFirstTurn(false);
  };

  // Mock camp cards for now - will be replaced with actual game state
  const mockCamp = {
    id: 1,
    name: "Base Camp",
    type: "camp" as const,
    water_cost: 0,
    abilities: [{ description: "Draw a card", water_cost: 2 }],
    traits: [],
    junk_effect: "Draw",
    initial_draw: 2
  };

  const handleCardAction = (action: string, cardId: number) => {
    console.log(`Card action: ${action} on card ${cardId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold bg-gradient-wasteland bg-clip-text text-transparent">
            Radlands Tracker
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Turn Phases */}
        <TurnPhases 
          currentPlayer={currentPlayer}
          onPhaseChange={handlePhaseChange}
          onTurnEnd={handleTurnEnd}
          isFirstTurn={isFirstTurn}
        />

        {/* Event Queue */}
        <EventQueue />

        {/* Player 1 Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-wasteland">{player1}</h2>
          </div>
          
          <WaterTracker playerName={player1} />
          
          <div className="grid grid-cols-3 gap-2">
            <BoardColumn 
              columnNumber={1} 
              playerName={player1} 
              campCard={player1Camps[0] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
            <BoardColumn 
              columnNumber={2} 
              playerName={player1} 
              campCard={player1Camps[1] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
            <BoardColumn 
              columnNumber={3} 
              playerName={player1} 
              campCard={player1Camps[2] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
              VS
            </span>
          </div>
        </div>

        {/* Player 2 Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-steel">{player2}</h2>
          </div>
          
          <WaterTracker playerName={player2} />
          
          <div className="grid grid-cols-3 gap-2">
            <BoardColumn 
              columnNumber={1} 
              playerName={player2} 
              campCard={player2Camps[0] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
            <BoardColumn 
              columnNumber={2} 
              playerName={player2} 
              campCard={player2Camps[1] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
            <BoardColumn 
              columnNumber={3} 
              playerName={player2} 
              campCard={player2Camps[2] || mockCamp}
              peopleCards={[]}
              onCardAction={handleCardAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTracker;
