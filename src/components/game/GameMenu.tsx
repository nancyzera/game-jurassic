import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameMenuProps {
  onStartGame: () => void;
}

export const GameMenu = ({ onStartGame }: GameMenuProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 jungle-gradient opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--jungle-primary))_0%,transparent_50%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--ancient-gold))_0%,transparent_50%)] opacity-20"></div>

      <Card className="w-full max-w-2xl mx-4 bg-card/90 backdrop-blur-sm border-2 border-accent/30">
        <div className="p-8 text-center space-y-8">
          {/* Game Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-accent tracking-wider">
              JURASSIC
            </h1>
            <h2 className="text-4xl font-bold text-primary">
              HACK
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Survive the prehistoric world and collect ancient artifacts before the dinosaurs find you!
            </p>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-accent text-xl font-bold">8</div>
              <div className="text-sm text-muted-foreground">Lost Items</div>
            </div>
            <div className="space-y-2">
              <div className="text-health text-xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Environments</div>
            </div>
            <div className="space-y-2">
              <div className="text-warning text-xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Dinosaurs</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left space-y-3 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-accent font-semibold text-lg mb-4">How to Play:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="text-accent font-medium">WASD</span> - Move around</p>
              <p><span className="text-accent font-medium">Mouse</span> - Look around</p>
              <p><span className="text-accent font-medium">E</span> - Collect items</p>
              <p><span className="text-accent font-medium">TAB</span> - Toggle inventory</p>
              <p><span className="text-accent font-medium">SHIFT</span> - Sprint (uses stamina)</p>
            </div>
            <div className="mt-4 p-3 bg-warning/20 rounded border-l-4 border-warning">
              <p className="text-warning text-sm font-medium">
                ⚠️ Avoid dinosaurs! They will chase and attack you if spotted.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={onStartGame}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-6"
            >
              START ADVENTURE
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Instructions
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-stone-gray text-stone-gray hover:bg-stone-gray hover:text-foreground"
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-xs text-muted-foreground opacity-60">
            Jurassic Hack v1.0 - Survive, Explore, Escape
          </div>
        </div>
      </Card>
    </div>
  );
};