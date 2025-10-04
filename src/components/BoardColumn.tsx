import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Zap, Users } from "lucide-react";

interface BoardColumnProps {
  columnNumber: number;
  playerName: string;
}

interface SlotState {
  occupied: boolean;
  type?: "camp" | "person";
  name?: string;
  damaged: boolean;
  ready: boolean;
}

const BoardColumn = ({ columnNumber, playerName }: BoardColumnProps) => {
  const [slots, setSlots] = useState<SlotState[]>([
    { occupied: true, type: "camp", name: "Base Camp", damaged: false, ready: true },
    { occupied: false, damaged: false, ready: false },
    { occupied: false, damaged: false, ready: false },
  ]);

  const toggleReady = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, ready: !slot.ready } : slot
      )
    );
  };

  const toggleDamage = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, damaged: !slot.damaged } : slot
      )
    );
  };

  return (
    <Card className="p-3 bg-card border-border shadow-card-custom">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-muted-foreground">
          Column {columnNumber}
        </div>
        <div className="flex gap-1">
          <Shield className="w-4 h-4 text-steel" />
        </div>
      </div>

      <div className="space-y-2">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`relative p-3 rounded-lg border-2 transition-smooth ${
              slot.occupied
                ? slot.ready
                  ? "border-radioactive bg-radioactive/10 shadow-radioactive"
                  : "border-muted bg-muted/50"
                : "border-dashed border-border bg-background/50"
            } ${slot.damaged ? "border-destructive animate-shake" : ""}`}
          >
            {slot.occupied ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slot.type === "camp" ? (
                      <Shield className="w-4 h-4 text-steel" />
                    ) : (
                      <Users className="w-4 h-4 text-wasteland" />
                    )}
                    <span className="text-sm font-medium">{slot.name}</span>
                  </div>
                  {slot.ready && (
                    <Zap className="w-4 h-4 text-radioactive" />
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleReady(index)}
                    className={`flex-1 h-7 text-xs ${
                      slot.ready
                        ? "bg-radioactive/20 border-radioactive"
                        : "border-border"
                    }`}
                  >
                    {slot.ready ? "Ready" : "Exhausted"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDamage(index)}
                    className={`h-7 w-7 p-0 ${
                      slot.damaged
                        ? "bg-destructive/20 border-destructive"
                        : "border-border"
                    }`}
                  >
                    <Heart
                      className={`w-3 h-3 ${
                        slot.damaged ? "text-destructive" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="text-xs text-muted-foreground">Empty Slot</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BoardColumn;
