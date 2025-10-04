import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Droplet, 
  Zap, 
  ArrowRight, 
  User,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

type Phase = "EVENTS" | "REPLENISH" | "ACTIONS";

interface TurnPhasesProps {
  currentPlayer?: number;
  onPhaseChange?: (phase: Phase) => void;
  onTurnEnd?: (nextPlayer: number) => void;
  isFirstTurn?: boolean;
}

const TurnPhases = ({ 
  currentPlayer = 1, 
  onPhaseChange,
  onTurnEnd,
  isFirstTurn = false 
}: TurnPhasesProps) => {
  const [phase, setPhase] = useState<Phase>("EVENTS");
  const [player, setPlayer] = useState(currentPlayer);

  useEffect(() => {
    setPlayer(currentPlayer);
  }, [currentPlayer]);

  const phaseConfig = {
    EVENTS: {
      color: "wasteland",
      gradient: "bg-gradient-wasteland",
      icon: AlertTriangle,
      label: "Events Phase",
      description: "Resolve events from the queue",
      progress: 1,
    },
    REPLENISH: {
      color: "steel",
      gradient: "bg-gradient-metal",
      icon: Droplet,
      label: "Replenish Phase",
      description: "Draw cards and collect water",
      progress: 2,
    },
    ACTIONS: {
      color: "radioactive",
      gradient: "bg-gradient-radioactive",
      icon: Zap,
      label: "Actions Phase",
      description: "Play cards and use abilities",
      progress: 3,
    },
  };

  const config = phaseConfig[phase];
  const PhaseIcon = config.icon;

  const changePhase = (newPhase: Phase) => {
    setPhase(newPhase);
    onPhaseChange?.(newPhase);
  };

  const handleStartEvents = () => {
    changePhase("EVENTS");
    toast.info("Events Phase Started", {
      description: "Resolve any events in the queue",
      icon: <AlertTriangle className="w-5 h-5 text-wasteland" />,
    });
  };

  const handleEventsComplete = () => {
    toast.success("Events Resolved", {
      description: "Moving to Replenish Phase",
      icon: <CheckCircle2 className="w-5 h-5 text-steel" />,
    });
    
    setTimeout(() => {
      changePhase("REPLENISH");
      handleAutoReplenish();
    }, 500);
  };

  const handleAutoReplenish = () => {
    setTimeout(() => {
      toast.info("Draw 1 Card", {
        description: "Add a card to your hand",
        icon: <Droplet className="w-5 h-5 text-steel" />,
      });
    }, 300);

    setTimeout(() => {
      const waterAmount = isFirstTurn && player === 1 ? 1 : 3;
      toast.info(`Collect ${waterAmount} Water`, {
        description: isFirstTurn && player === 1 
          ? "First turn: start player gets 1 water" 
          : "Collect your water for the turn",
        icon: <Droplet className="w-5 h-5 text-steel" />,
      });
    }, 1000);

    setTimeout(() => {
      changePhase("ACTIONS");
      toast.success("Ready for Actions", {
        description: "You can now play cards and use abilities",
        icon: <Zap className="w-5 h-5 text-radioactive" />,
      });
    }, 2000);
  };

  const handleStartActions = () => {
    if (phase === "REPLENISH") {
      handleAutoReplenish();
    } else {
      changePhase("ACTIONS");
      toast.info("Actions Phase Started", {
        description: "Play cards and use abilities",
        icon: <Zap className="w-5 h-5 text-radioactive" />,
      });
    }
  };

  const handleEndTurn = () => {
    toast.success("Turn Ended", {
      description: "Returning water to the pool",
      icon: <CheckCircle2 className="w-5 h-5" />,
    });

    const nextPlayer = player === 1 ? 2 : 1;
    
    setTimeout(() => {
      setPlayer(nextPlayer);
      changePhase("EVENTS");
      onTurnEnd?.(nextPlayer);
      
      toast.info(`Player ${nextPlayer}'s Turn`, {
        description: "Starting Events Phase",
        icon: <User className="w-5 h-5 text-wasteland" />,
      });
    }, 800);
  };

  return (
    <Card className="p-4 bg-card border-border shadow-card-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PhaseIcon className={`w-5 h-5 text-${config.color}`} />
          <h3 className="font-semibold">Turn Phases</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
          <User className="w-4 h-4" />
          <span className="text-sm font-semibold">Player {player}</span>
        </div>
      </div>

      {/* Phase Indicator */}
      <div className={`p-4 rounded-lg ${config.gradient} mb-4 shadow-lg transition-smooth`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PhaseIcon className="w-6 h-6 text-white" />
            <div>
              <div className="text-lg font-bold text-white">{config.label}</div>
              <div className="text-xs text-white/80">{config.description}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white/90">
            {config.progress}/3
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 mt-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition-smooth ${
                step <= config.progress
                  ? "bg-white shadow-lg"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Phase-specific Buttons */}
      <div className="space-y-2">
        {phase === "EVENTS" && (
          <>
            <Button
              onClick={handleStartEvents}
              variant="outline"
              className="w-full border-wasteland hover:bg-wasteland/20 transition-smooth"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Start Events Phase
            </Button>
            <Button
              onClick={handleEventsComplete}
              className="w-full bg-gradient-wasteland hover:shadow-wasteland transition-smooth"
            >
              Events Complete
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}

        {phase === "REPLENISH" && (
          <div className="p-4 rounded-lg bg-steel/20 border-2 border-steel">
            <div className="text-center space-y-2">
              <Droplet className="w-8 h-8 text-steel mx-auto" />
              <div className="text-sm font-semibold text-steel">
                Auto-Replenishing...
              </div>
              <div className="text-xs text-muted-foreground">
                Drawing card and collecting water
              </div>
            </div>
          </div>
        )}

        {phase === "ACTIONS" && (
          <>
            <Button
              onClick={handleStartActions}
              variant="outline"
              className="w-full border-radioactive hover:bg-radioactive/20 transition-smooth"
            >
              <Zap className="w-4 h-4 mr-2" />
              Ready for Actions
            </Button>
            <Button
              onClick={handleEndTurn}
              className="w-full bg-gradient-radioactive hover:shadow-radioactive transition-smooth"
            >
              End Turn
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}
      </div>

      {/* Phase Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2 rounded ${phase === "EVENTS" ? "bg-wasteland/20" : "bg-muted/50"}`}>
            <AlertTriangle className={`w-4 h-4 mx-auto mb-1 ${phase === "EVENTS" ? "text-wasteland" : "text-muted-foreground"}`} />
            <div className={`text-xs font-medium ${phase === "EVENTS" ? "text-wasteland" : "text-muted-foreground"}`}>
              Events
            </div>
          </div>
          <div className={`p-2 rounded ${phase === "REPLENISH" ? "bg-steel/20" : "bg-muted/50"}`}>
            <Droplet className={`w-4 h-4 mx-auto mb-1 ${phase === "REPLENISH" ? "text-steel" : "text-muted-foreground"}`} />
            <div className={`text-xs font-medium ${phase === "REPLENISH" ? "text-steel" : "text-muted-foreground"}`}>
              Replenish
            </div>
          </div>
          <div className={`p-2 rounded ${phase === "ACTIONS" ? "bg-radioactive/20" : "bg-muted/50"}`}>
            <Zap className={`w-4 h-4 mx-auto mb-1 ${phase === "ACTIONS" ? "text-radioactive" : "text-muted-foreground"}`} />
            <div className={`text-xs font-medium ${phase === "ACTIONS" ? "text-radioactive" : "text-muted-foreground"}`}>
              Actions
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TurnPhases;
