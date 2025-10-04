import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Shield, Zap, Users } from "lucide-react";

// Mock card data - will be replaced with real data later
const mockCards = [
  {
    id: 1,
    name: "Mechanic",
    type: "person",
    cost: 2,
    damage: 1,
    traits: ["Repair"],
    description: "Can repair damaged cards",
  },
  {
    id: 2,
    name: "Sniper Tower",
    type: "camp",
    cost: 3,
    damage: 2,
    traits: ["Protected"],
    description: "Deal 2 damage to any target",
  },
  {
    id: 3,
    name: "Raider",
    type: "person",
    cost: 1,
    damage: 1,
    traits: ["Raider"],
    description: "Basic raider unit",
  },
  {
    id: 4,
    name: "Water Purifier",
    type: "camp",
    cost: 2,
    damage: 0,
    traits: ["Water"],
    description: "Generate extra water each turn",
  },
];

const CardDatabase = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cards] = useState(mockCards);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.traits.some((trait) => trait.toLowerCase().includes(search.toLowerCase()))
  );

  const getCardIcon = (type: string) => {
    switch (type) {
      case "camp":
        return <Shield className="w-4 h-4" />;
      case "person":
        return <Users className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-lg">
        <div className="flex items-center gap-4 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Card Database</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards by name or trait..."
            className="pl-10 bg-muted border-border focus:border-wasteland transition-smooth"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-card/50 text-center">
            <div className="text-2xl font-bold text-wasteland">{filteredCards.length}</div>
            <div className="text-xs text-muted-foreground">Results</div>
          </Card>
          <Card className="p-3 bg-card/50 text-center">
            <div className="text-2xl font-bold text-steel">
              {filteredCards.filter((c) => c.type === "camp").length}
            </div>
            <div className="text-xs text-muted-foreground">Camps</div>
          </Card>
          <Card className="p-3 bg-card/50 text-center">
            <div className="text-2xl font-bold text-radioactive">
              {filteredCards.filter((c) => c.type === "person").length}
            </div>
            <div className="text-xs text-muted-foreground">People</div>
          </Card>
        </div>

        {/* Card List */}
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              className="p-4 bg-card border-border shadow-card-custom hover:border-wasteland transition-smooth"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    card.type === "camp"
                      ? "bg-steel/20 text-steel"
                      : "bg-wasteland/20 text-wasteland"
                  }`}
                >
                  {getCardIcon(card.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{card.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Cost: {card.cost}
                      </span>
                      {card.damage > 0 && (
                        <span className="text-sm font-medium text-destructive">
                          DMG: {card.damage}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {card.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {card.traits.map((trait, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No cards found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDatabase;
