import { Card as UICard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Zap, Heart, Droplet, X, ArrowDown, AlertTriangle } from "lucide-react";

interface CardData {
  id: number;
  name: string;
  card_type: 'camp' | 'person' | 'event';
  water_cost: number;
  abilities: Array<{ name: string; cost?: number; effect: string }>;
  traits: string[];
  junk_effect?: string;
  event_effect?: string;
  bomb_position?: number;
  initial_draw?: number;
  expansion: string;
}

interface CardState {
  card: CardData;
  isReady?: boolean;
  isDamaged?: boolean;
  waterOnCard?: number;
  isDestroyed?: boolean;
}

interface BoardColumnProps {
  columnNumber: number;
  playerName: string;
  campCard: CardState;
  peopleCards: CardState[];
  onCardAction?: (action: string, cardId: number, slotType: 'camp' | 'front' | 'behind') => void;
}

const BoardColumn = ({ 
  columnNumber, 
  playerName, 
  campCard, 
  peopleCards = [],
  onCardAction 
}: BoardColumnProps) => {
  const frontPerson = peopleCards.find((_, idx) => idx === 0);
  const behindPerson = peopleCards.find((_, idx) => idx === 1);

  const isCampUnprotected = !frontPerson;
  const isFrontUnprotected = true;
  const isBehindProtected = !!frontPerson;

  const handleCardClick = (action: string, cardId: number, slotType: 'camp' | 'front' | 'behind') => {
    if (onCardAction) {
      onCardAction(action, cardId, slotType);
    }
  };

  const renderPersonCard = (
    cardState: CardState | undefined, 
    slotType: 'front' | 'behind',
    isUnprotected: boolean
  ) => {
    if (!cardState) {
      return (
        <div className="relative p-4 rounded-lg border-2 border-dashed border-border bg-background/30 min-h-[120px] flex items-center justify-center transition-smooth">
          <div className="text-center">
            <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <div className="text-xs text-muted-foreground">
              {slotType === 'behind' ? 'Behind Slot (Empty)' : 'Front Slot (Empty)'}
            </div>
          </div>
        </div>
      );
    }

    const { card, isReady = true, isDamaged = false, waterOnCard = 0 } = cardState;

    return (
      <div
        className={`relative p-4 rounded-lg border-2 transition-smooth ${
          isUnprotected
            ? 'border-destructive bg-destructive/10 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
            : 'border-radioactive bg-radioactive/10 shadow-radioactive'
        } ${
          !isReady ? 'opacity-70 grayscale-[0.3]' : ''
        }`}
      >
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          {slotType === 'behind' && isBehindProtected && (
            <Badge className="bg-radioactive text-background text-xs px-2 py-0.5 shadow-radioactive">
              <Shield className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          )}
          {isUnprotected && (
            <Badge className="bg-destructive text-white text-xs px-2 py-0.5 animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Exposed
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-wasteland">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground leading-tight">
                  {card.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-wasteland text-wasteland">
                    <Droplet className="w-3 h-3 mr-0.5" />
                    {card.water_cost}
                  </Badge>
                  {card.traits.map((trait, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {isDamaged && (
              <div className="flex items-center justify-center w-8 h-8 rounded bg-destructive/20 animate-shake">
                <Heart className="w-4 h-4 text-destructive transform rotate-90" />
              </div>
            )}
          </div>

          {card.abilities && card.abilities.length > 0 && (
            <div className="space-y-1 p-2 bg-background/50 rounded border border-border/50">
              {card.abilities.map((ability, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-wasteland">{ability.name}</span>
                  {ability.cost !== undefined && (
                    <span className="text-muted-foreground ml-1">({ability.cost} <Droplet className="w-2 h-2 inline" />)</span>
                  )}
                  <span className="text-muted-foreground">: {ability.effect}</span>
                </div>
              ))}
            </div>
          )}

          {waterOnCard > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Water on card:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: waterOnCard }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardClick('toggle-ready', card.id, slotType)}
              className={`flex-1 h-8 text-xs ${
                isReady
                  ? 'bg-radioactive/20 border-radioactive text-radioactive'
                  : 'border-muted text-muted-foreground'
              }`}
            >
              {isReady ? (
                <>
                  <Zap className="w-3 h-3 mr-1" />
                  Ready
                </>
              ) : (
                'Exhausted'
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardClick('toggle-damage', card.id, slotType)}
              className={`h-8 w-8 p-0 ${
                isDamaged
                  ? 'bg-destructive/20 border-destructive'
                  : 'border-muted'
              }`}
            >
              <Heart className={`w-3 h-3 ${isDamaged ? 'text-destructive' : 'text-muted-foreground'}`} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCampCard = () => {
    const { card, waterOnCard = 0, isDestroyed = false } = campCard;

    return (
      <div
        className={`relative p-4 rounded-lg border-2 transition-smooth ${
          isCampUnprotected
            ? 'border-destructive bg-destructive/10 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
            : 'border-steel bg-steel/10 shadow-md'
        } ${
          isDestroyed ? 'opacity-50' : ''
        }`}
      >
        {isDestroyed && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 rounded-lg">
            <X className="w-16 h-16 text-destructive" strokeWidth={3} />
          </div>
        )}

        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          {isCampUnprotected && (
            <Badge className="bg-destructive text-white text-xs px-2 py-0.5 animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unprotected
            </Badge>
          )}
          {!isCampUnprotected && (
            <Badge className="bg-radioactive text-background text-xs px-2 py-0.5">
              <Shield className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-metal">
                <Shield className="w-4 h-4 text-steel" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-foreground leading-tight">
                  {card.name}
                </div>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 mt-1">
                  CAMP
                </Badge>
              </div>
            </div>
          </div>

          {card.abilities && card.abilities.length > 0 && (
            <div className="space-y-1 p-2 bg-background/50 rounded border border-steel/30">
              {card.abilities.map((ability, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-steel">{ability.name}</span>
                  {ability.cost !== undefined && (
                    <span className="text-muted-foreground ml-1">({ability.cost} <Droplet className="w-2 h-2 inline" />)</span>
                  )}
                  <span className="text-muted-foreground">: {ability.effect}</span>
                </div>
              ))}
            </div>
          )}

          {card.junk_effect && (
            <div className="text-xs p-2 bg-muted/30 rounded border border-border/50">
              <span className="font-semibold text-rust">Junk:</span>{' '}
              <span className="text-muted-foreground">{card.junk_effect}</span>
            </div>
          )}

          {waterOnCard > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Water on card:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: waterOnCard }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardClick('toggle-destroy', card.id, 'camp')}
              className={`flex-1 h-8 text-xs ${
                isDestroyed
                  ? 'bg-destructive/20 border-destructive text-destructive'
                  : 'border-steel text-steel'
              }`}
              disabled={isDestroyed}
            >
              {isDestroyed ? (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Destroyed
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Active
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <UICard className="p-4 bg-card border-border shadow-card-custom">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-2 py-1 border-wasteland">
            Column {columnNumber}
          </Badge>
          <span className="text-xs text-muted-foreground">{playerName}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {peopleCards.length}/2 People
        </div>
      </div>

      <div className="space-y-3">
        {renderPersonCard(behindPerson, 'behind', false)}

        {(behindPerson || frontPerson) && (
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-muted-foreground animate-bounce" />
          </div>
        )}

        {renderPersonCard(frontPerson, 'front', isFrontUnprotected)}

        {frontPerson && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-xs text-radioactive">
              <Shield className="w-4 h-4" />
              <span>Protecting Camp</span>
              <ArrowDown className="w-3 h-3" />
            </div>
          </div>
        )}

        {renderCampCard()}
      </div>
    </UICard>
  );
};

export default BoardColumn;
