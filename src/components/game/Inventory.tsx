import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Package, Trophy, Wrench, Shield } from "lucide-react";
import { GameItem } from "./GameEngine";

interface InventoryProps {
  items: GameItem[];
  onClose: () => void;
}

const getItemIcon = (type: GameItem["type"]) => {
  switch (type) {
    case "artifact":
      return <Trophy className="w-5 h-5 text-accent" />;
    case "tool":
      return <Wrench className="w-5 h-5 text-stamina" />;
    case "gear":
      return <Shield className="w-5 h-5 text-health" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

const getItemDescription = (name: string) => {
  const descriptions: Record<string, string> = {
    "Ancient Compass": "Points to magnetic north, useful for navigation",
    "Fossil Fragment": "A piece of prehistoric history",
    "Survival Knife": "Essential tool for cutting and protection",
    "Crystal Shard": "Mysterious crystal with unknown properties",
    "Water Filter": "Purifies water from natural sources",
    "Amber Stone": "Prehistoric tree resin containing ancient secrets",
    "Rope Kit": "Strong rope for climbing and securing items",
    "Ancient Map": "Shows hidden paths through the wilderness",
  };
  return descriptions[name] || "A valuable item found in the wilderness";
};

export const Inventory = ({ items, onClose }: InventoryProps) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50">
      <Card className="w-full max-w-2xl mx-4 bg-card border-2 border-accent/30">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-accent">Inventory</h2>
              <span className="text-sm text-muted-foreground">({items.length}/5)</span>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {Array.from({ length: 5 }).map((_, index) => {
              const item = items[index];
              return (
                <div
                  key={index}
                  className={`
                    aspect-square border-2 rounded-lg p-3 flex flex-col items-center justify-center
                    transition-all duration-200 inventory-item
                    ${item 
                      ? 'border-accent bg-accent/10 hover:bg-accent/20' 
                      : 'border-border bg-muted/30'
                    }
                  `}
                >
                  {item ? (
                    <>
                      {getItemIcon(item.type)}
                      <span className="text-xs text-center mt-1 text-muted-foreground">
                        {item.name.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <div className="w-5 h-5 border border-dashed border-muted-foreground/50 rounded"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Item Details */}
          {items.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Collected Items:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getItemDescription(item.name)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${item.type === 'artifact' ? 'bg-accent/20 text-accent' : ''}
                          ${item.type === 'tool' ? 'bg-stamina/20 text-stamina' : ''}
                          ${item.type === 'gear' ? 'bg-health/20 text-health' : ''}
                        `}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Your inventory is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Explore the world to find lost items!
              </p>
            </div>
          )}

          {/* Controls Info */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground text-center">
              Press <span className="text-accent font-medium">TAB</span> to close inventory • 
              <span className="text-accent font-medium"> E</span> to collect items
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};