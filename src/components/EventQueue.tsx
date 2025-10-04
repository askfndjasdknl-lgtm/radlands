import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, RotateCcw, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface GameEvent {
  id: number;
  name: string;
}

type EventSlot = GameEvent | null;

const EventQueue = () => {
  // 3 slots: index 0 = slot 3 (back), index 1 = slot 2 (middle), index 2 = slot 1 (front/resolve)
  const [slots, setSlots] = useState<EventSlot[]>([null, null, null]);
  const [eventCounter, setEventCounter] = useState(1);
  const [newEventName, setNewEventName] = useState("");
  const [bombPosition, setBombPosition] = useState<string>("1");

  const advanceTurn = () => {
    const newSlots: EventSlot[] = [null, null, null];
    
    // Resolve event in slot 1 (index 2)
    if (slots[2]) {
      toast.success(`Event Resolved: ${slots[2].name}`, {
        icon: <AlertTriangle className="w-5 h-5 text-wasteland" />,
        description: "Event removed from queue"
      });
    }
    
    // Move slot 2 to slot 1
    if (slots[1]) {
      newSlots[2] = slots[1];
    }
    
    // Move slot 3 to slot 2
    if (slots[0]) {
      newSlots[1] = slots[0];
    }
    
    setSlots(newSlots);
    
    const hasEvents = newSlots.some(slot => slot !== null);
    if (hasEvents) {
      toast.info("Turn Advanced - All events moved forward");
    }
  };

  const addEvent = () => {
    if (!newEventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }

    const newEvent: GameEvent = {
      id: eventCounter,
      name: newEventName.trim(),
    };

    const targetSlot = parseInt(bombPosition);
    const targetIndex = 3 - targetSlot; // Convert slot number to array index (3→0, 2→1, 1→2)
    
    const newSlots = [...slots];
    
    // Try to place in target slot
    if (newSlots[targetIndex] === null) {
      newSlots[targetIndex] = newEvent;
      toast.success(`Event added to slot ${targetSlot}`);
    } else {
      // Find first available slot behind target (higher slot number = lower index)
      let placed = false;
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (newSlots[i] === null) {
          newSlots[i] = newEvent;
          const slotNum = 3 - i;
          toast.success(`Event added to slot ${slotNum} (slot ${targetSlot} was occupied)`);
          placed = true;
          break;
        }
      }
      
      if (!placed) {
        toast.error("No available slots behind target position");
        return;
      }
    }
    
    setSlots(newSlots);
    setEventCounter(eventCounter + 1);
    setNewEventName("");
  };

  const resetQueue = () => {
    setSlots([null, null, null]);
    setEventCounter(1);
    setNewEventName("");
    setBombPosition("1");
    toast.info("Event queue reset");
  };

  const renderSlot = (slotNumber: number, slotIndex: number) => {
    const event = slots[slotIndex];
    const isResolveZone = slotNumber === 1;
    
    return (
      <div
        key={slotNumber}
        className={`flex-1 p-4 rounded-lg border-2 transition-smooth ${
          isResolveZone
            ? "border-wasteland bg-gradient-wasteland/20 shadow-wasteland"
            : "border-border bg-muted/30"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`text-2xl font-bold ${
            isResolveZone ? "text-wasteland" : "text-muted-foreground"
          }`}>
            {slotNumber === 3 ? "③" : slotNumber === 2 ? "②" : "①"}
          </div>
          {isResolveZone && (
            <div className="text-xs text-wasteland font-semibold uppercase">
              Resolve
            </div>
          )}
        </div>
        
        {event ? (
          <div className={`p-3 rounded-lg ${
            isResolveZone 
              ? "bg-wasteland/80 text-primary-foreground animate-pulse-glow" 
              : "bg-card"
          }`}>
            <div className="text-sm font-medium">{event.name}</div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <div className="text-xs text-muted-foreground">Empty</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-4 bg-card border-border shadow-card-custom">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-wasteland" />
          <h3 className="font-semibold">Event Queue</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetQueue}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* 3 Fixed Slots */}
      <div className="flex gap-3 mb-4">
        {renderSlot(3, 0)}
        {renderSlot(2, 1)}
        {renderSlot(1, 2)}
      </div>

      {/* Add Event Section */}
      <div className="space-y-3 p-3 rounded-lg bg-muted/50 mb-3">
        <div className="text-sm font-medium">Add Event</div>
        <Input
          placeholder="Event name..."
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addEvent();
            }
          }}
          className="bg-background"
        />
        <div className="flex gap-2">
          <Select value={bombPosition} onValueChange={setBombPosition}>
            <SelectTrigger className="flex-1 bg-background">
              <SelectValue placeholder="Bomb Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">① Front (Resolve Next)</SelectItem>
              <SelectItem value="2">② Middle</SelectItem>
              <SelectItem value="3">③ Back</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={addEvent}
            variant="outline"
            className="hover:bg-wasteland hover:text-primary-foreground transition-smooth"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advance Turn Button */}
      <Button
        onClick={advanceTurn}
        className="w-full bg-gradient-wasteland hover:shadow-wasteland transition-smooth"
      >
        Advance Turn
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </Card>
  );
};

export default EventQueue;
