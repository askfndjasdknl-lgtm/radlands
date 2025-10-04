import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Users, Zap, CheckCircle2, Loader2 } from "lucide-react";

interface CampCard {
  id: number;
  name: string;
  type: string;
  water_cost: number;
  abilities: string[];
  traits: string[];
  initial_draw: number;
  expansion: string;
}

const GameSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'names' | 'camps' | 'creating'>('names');
  const [player1, setPlayer1] = useState("Player 1");
  const [player2, setPlayer2] = useState("Player 2");
  const [selectedCamps, setSelectedCamps] = useState<number[]>([]);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const { data: allCamps, isLoading } = useQuery({
    queryKey: ['camps'],
    queryFn: async () => {
      const response = await fetch('/api/cards?type=camp');
      if (!response.ok) throw new Error('Failed to fetch camps');
      return response.json() as Promise<CampCard[]>;
    }
  });

  const randomCamps = useMemo(() => {
    if (!allCamps || allCamps.length === 0) return [];
    const shuffled = [...allCamps].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [allCamps]);

  const selectedCampObjects = useMemo(() => {
    return randomCamps.filter(camp => selectedCamps.includes(camp.id));
  }, [randomCamps, selectedCamps]);

  const totalInitialDraw = useMemo(() => {
    return selectedCampObjects.reduce((sum, camp) => sum + (camp.initial_draw || 0), 0);
  }, [selectedCampObjects]);

  const handleCampClick = (campId: number) => {
    if (selectedCamps.includes(campId)) {
      setSelectedCamps(selectedCamps.filter(id => id !== campId));
    } else if (selectedCamps.length < 3) {
      setSelectedCamps([...selectedCamps, campId]);
    }
  };

  const handleStartCampSelection = () => {
    if (player1.trim() && player2.trim()) {
      setStep('camps');
    }
  };

  const handleConfirmCamps = async () => {
    if (selectedCamps.length !== 3) return;

    setIsCreatingGame(true);
    
    try {
      const startPlayer = Math.random() < 0.5 ? 1 : 2;
      
      const selectedCampsData = selectedCampObjects.map(camp => ({
        id: camp.id,
        name: camp.name,
        initial_draw: camp.initial_draw,
        abilities: camp.abilities,
        traits: camp.traits
      }));

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1_name: player1,
          player2_name: player2,
          player1_camps: selectedCampsData,
          player2_camps: selectedCampsData,
          start_player: startPlayer
        })
      });

      if (!response.ok) throw new Error('Failed to create game');

      const gameData = await response.json();

      navigate("/game", { 
        state: { 
          player1, 
          player2,
          gameId: gameData.id,
          startPlayer: gameData.start_player,
          camps: selectedCampsData
        } 
      });
    } catch (error) {
      console.error('Error creating game:', error);
      setIsCreatingGame(false);
    }
  };

  if (step === 'names') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-metal">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
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
              onClick={handleStartCampSelection}
              disabled={!player1.trim() || !player2.trim()}
              className="w-full bg-gradient-wasteland hover:shadow-wasteland transition-smooth text-lg font-semibold h-12"
            >
              <Zap className="w-5 h-5 mr-2" />
              Choose Camps
            </Button>
          </Card>

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
  }

  if (step === 'camps') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-metal">
        <div className="w-full max-w-4xl space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-wasteland bg-clip-text text-transparent">
              Select 3 Camps
            </h1>
            <p className="text-muted-foreground">
              Click to select camps for your wasteland
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-wasteland" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {randomCamps.map((camp) => {
                  const isSelected = selectedCamps.includes(camp.id);
                  return (
                    <Card
                      key={camp.id}
                      onClick={() => handleCampClick(camp.id)}
                      className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? 'border-2 border-radioactive shadow-lg shadow-radioactive/50'
                          : 'border-border hover:border-wasteland'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg">{camp.name}</h3>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-radioactive" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-muted rounded text-xs font-semibold">
                            Draw: {camp.initial_draw || 0}
                          </div>
                        </div>

                        {camp.abilities && camp.abilities.length > 0 && (
                          <div className="space-y-1">
                            {camp.abilities.map((ability, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground">
                                • {ability}
                              </p>
                            ))}
                          </div>
                        )}

                        {camp.traits && camp.traits.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {camp.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-steel/20 text-steel text-xs rounded-full"
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-4 bg-card/50 border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedCamps.length}/3 camps
                    </p>
                    {selectedCamps.length === 3 && (
                      <p className="text-lg font-semibold text-radioactive">
                        You will draw {totalInitialDraw} cards + Raiders + Water Silo
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleConfirmCamps}
                    disabled={selectedCamps.length !== 3 || isCreatingGame}
                    className="bg-gradient-wasteland hover:shadow-wasteland transition-smooth font-semibold"
                  >
                    {isCreatingGame ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Game...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Confirm Camps
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default GameSetup;
