import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Plus, Minus, RotateCcw } from "lucide-react";

interface WaterTrackerProps {
  playerName: string;
  initialWater?: number;
}

const WaterTracker = ({ playerName, initialWater = 3 }: WaterTrackerProps) => {
  const [water, setWater] = useState(initialWater);
  const maxWater = 3;

  const addWater = () => {
    if (water < maxWater + 5) setWater(water + 1);
  };

  const removeWater = () => {
    if (water > 0) setWater(water - 1);
  };

  const resetWater = () => {
    setWater(maxWater);
  };

  return (
    <Card className="p-4 bg-card border-border shadow-card-custom">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-steel" />
          <span className="font-semibold text-sm">{playerName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetWater}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={removeWater}
          disabled={water === 0}
          className="h-10 w-10 border-border hover:bg-destructive/20 hover:border-destructive transition-smooth"
        >
          <Minus className="w-5 h-5" />
        </Button>

        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-metal border-2 border-steel shadow-card-custom">
          <div className="text-center">
            <div className="text-3xl font-bold text-steel">{water}</div>
            <div className="text-xs text-muted-foreground">water</div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={addWater}
          className="h-10 w-10 border-border hover:bg-steel/20 hover:border-steel transition-smooth"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Water dots visualization */}
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: maxWater }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-smooth ${
              i < water
                ? "bg-steel shadow-radioactive"
                : "bg-muted border border-border"
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default WaterTracker;
