import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Package, Target } from "lucide-react";

interface GameHUDProps {
  health: number;
  stamina: number;
  collectedItems: number;
  totalItems: number;
  onToggleInventory: () => void;
  currentLevel: string;
}

export const GameHUD = ({ 
  health, 
  stamina, 
  collectedItems, 
  totalItems, 
  onToggleInventory,
  currentLevel
}: GameHUDProps) => {
  const healthColor = health > 60 ? "bg-health" : health > 30 ? "bg-warning" : "bg-destructive";
  const staminaColor = stamina > 30 ? "bg-stamina" : "bg-warning";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start hud-slide-in">
        {/* Left Stats */}
        <div className="space-y-3 pointer-events-auto">
          {/* Health */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">Health</span>
              <span className="text-sm text-muted-foreground ml-auto">{health}/100</span>
            </div>
            <Progress 
              value={health} 
              className="h-2"
              style={{ 
                background: 'hsl(var(--muted))',
              }}
            >
              <div 
                className={`h-full rounded-full transition-all duration-300 ${healthColor}`}
                style={{ width: `${health}%` }}
              />
            </Progress>
          </div>

          {/* Stamina */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-stamina" />
              <span className="text-sm font-medium text-foreground">Stamina</span>
              <span className="text-sm text-muted-foreground ml-auto">{stamina}/100</span>
            </div>
            <Progress 
              value={stamina} 
              className="h-2"
              style={{ 
                background: 'hsl(var(--muted))',
              }}
            >
              <div 
                className={`h-full rounded-full transition-all duration-300 ${staminaColor}`}
                style={{ width: `${stamina}%` }}
              />
            </Progress>
          </div>
        </div>

        {/* Right Stats */}
        <div className="space-y-3 pointer-events-auto">
          {/* Progress */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{currentLevel}</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {collectedItems}/{totalItems}
              </div>
              <div className="text-xs text-muted-foreground">Items Found</div>
            </div>
          </div>

          {/* Inventory Button */}
          <Button
            onClick={onToggleInventory}
            variant="outline"
            size="sm"
            className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Package className="w-4 h-4 mr-2" />
            Inventory (TAB)
          </Button>
        </div>
      </div>

      {/* Bottom Center - Interaction Prompt */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-card/90 backdrop-blur-sm border border-accent/30 rounded-lg px-4 py-2">
          <div className="text-sm text-accent font-medium">
            Press <span className="text-accent font-bold">E</span> to interact
          </div>
        </div>
      </div>

      {/* Controls Reminder */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 text-xs">
          <div className="space-y-1 text-muted-foreground">
            <div><span className="text-accent">WASD</span> Move</div>
            <div><span className="text-accent">SHIFT</span> Sprint</div>
            <div><span className="text-accent">TAB</span> Inventory</div>
          </div>
        </div>
      </div>
    </div>
  );
};