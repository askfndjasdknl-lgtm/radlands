import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Users, Zap } from "lucide-react";

const GameSetup = () => {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");

  const handleStartGame = () => {
    // In future, this will initialize game state
    navigate("/game", { state: { player1, player2 } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-metal">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Flame className="w-20 h-20 text-wasteland animate-pulse-glow" />
              <Zap className="w-8 h-8 text-radioactive absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-wasteland bg-clip-text text-transparent">
            Radlands
          </h1>
          <p className="text-muted-foreground text-lg">
            Game Companion App
          </p>
        </div>

        {/* Setup Card */}
        <Card className="p-6 shadow-card-custom border-border space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-steel" />
            <h2 className="text-xl font-semibold">Setup New Game</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1">Player 1 Name</Label>
              <Input
                id="player1"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="bg-muted border-border focus:border-wasteland transition-smooth"
                placeholder="Enter player 1 name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2">Player 2 Name</Label>
              <Input
                id="player2"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="bg-muted border-border focus:border-steel transition-smooth"
                placeholder="Enter player 2 name"
              />
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            className="w-full bg-gradient-wasteland hover:shadow-wasteland transition-smooth text-lg font-semibold h-12"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Game
          </Button>
        </Card>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <Card className="p-3 bg-card/50 border-border">
            <div className="text-2xl font-bold text-wasteland">3</div>
            <div className="text-xs text-muted-foreground">Water</div>
          </Card>
          <Card className="p-3 bg-card/50 border-border">
            <div className="text-2xl font-bold text-steel">3</div>
            <div className="text-xs text-muted-foreground">Columns</div>
          </Card>
          <Card className="p-3 bg-card/50 border-border">
            <div className="text-2xl font-bold text-radioactive">5</div>
            <div className="text-xs text-muted-foreground">Hand</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
