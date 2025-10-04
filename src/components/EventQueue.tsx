import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const defaultEvents = [
  { id: 1, name: "Raiding Parties", turn: 1, active: true },
  { id: 2, name: "Sandstorm", turn: 2, active: false },
  { id: 3, name: "Acid Rain", turn: 3, active: false },
  { id: 4, name: "Raiders Attack", turn: 4, active: false },
];

const EventQueue = () => {
  const [events, setEvents] = useState(defaultEvents);
  const [currentEvent, setCurrentEvent] = useState(0);

  const advanceEvent = () => {
    if (currentEvent < events.length - 1) {
      const nextEvent = currentEvent + 1;
      setCurrentEvent(nextEvent);
      setEvents((prev) =>
        prev.map((event, idx) => ({
          ...event,
          active: idx === nextEvent,
        }))
      );
      toast.success(`Event Advanced: ${events[nextEvent].name}`, {
        icon: <AlertTriangle className="w-5 h-5 text-wasteland" />,
      });
    } else {
      toast.info("Game End - All events completed!");
    }
  };

  const resetQueue = () => {
    setCurrentEvent(0);
    setEvents(defaultEvents);
    toast.info("Event queue reset");
  };

  const activeEvent = events[currentEvent];

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

      {/* Current Event Display */}
      <div className="mb-4 p-4 rounded-lg bg-gradient-wasteland shadow-wasteland animate-pulse-glow">
        <div className="text-sm text-primary-foreground/80 mb-1">Current Event</div>
        <div className="text-xl font-bold text-primary-foreground">
          {activeEvent.name}
        </div>
        <div className="text-sm text-primary-foreground/80 mt-1">
          Turn {activeEvent.turn}
        </div>
      </div>

      {/* Event Timeline */}
      <div className="space-y-2 mb-4">
        {events.map((event, idx) => (
          <div
            key={event.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-smooth ${
              event.active
                ? "bg-muted border-l-4 border-wasteland"
                : idx < currentEvent
                ? "opacity-50 bg-muted/30"
                : "bg-muted/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                event.active
                  ? "bg-wasteland text-primary-foreground"
                  : idx < currentEvent
                  ? "bg-muted-foreground/30 text-muted-foreground"
                  : "bg-muted-foreground/50 text-foreground"
              }`}
            >
              {event.turn}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{event.name}</div>
            </div>
            {event.active && (
              <AlertTriangle className="w-4 h-4 text-wasteland animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Advance Button */}
      <Button
        onClick={advanceEvent}
        disabled={currentEvent >= events.length - 1}
        className="w-full bg-gradient-wasteland hover:shadow-wasteland transition-smooth"
      >
        Advance Turn
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </Card>
  );
};

export default EventQueue;
