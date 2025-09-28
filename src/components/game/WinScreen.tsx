import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, Star } from "lucide-react";

interface WinScreenProps {
  onRestart: () => void;
  levelName: string;
  isLastLevel: boolean;
}

export const WinScreen = ({ onRestart, levelName, isLastLevel }: WinScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Celebration background */}
      <div className="absolute inset-0 ancient-gradient opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent))_0%,transparent_70%)] opacity-20 animate-pulse"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full opacity-60 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-2xl mx-4 bg-card/90 backdrop-blur-sm border-2 border-accent">
        <div className="p-8 text-center space-y-8">
          {/* Victory Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Trophy className="w-24 h-24 text-accent animate-bounce" />
              <div className="absolute -top-2 -right-2">
                <Star className="w-8 h-8 text-warning animate-spin" />
              </div>
            </div>
          </div>

          {/* Victory Message */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-accent">
              {isLastLevel ? "GAME COMPLETE!" : "LEVEL COMPLETE!"}
            </h1>
            <h2 className="text-2xl font-bold text-primary">
              {levelName} - Cleared!
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {isLastLevel 
                ? "Congratulations! You've completed all levels and escaped the Jurassic world!"
                : "Excellent work! You found all items in this level. Ready for the next challenge?"
              }
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4 text-center bg-muted/30 p-6 rounded-lg">
            <div className="space-y-2">
              <div className="text-accent text-2xl font-bold">8/8</div>
              <div className="text-sm text-muted-foreground">Items Collected</div>
            </div>
            <div className="space-y-2">
              <div className="text-health text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
            <div className="space-y-2">
              <div className="text-warning text-2xl font-bold">★★★</div>
              <div className="text-sm text-muted-foreground">Perfect Score</div>
            </div>
          </div>

          {/* Collected Items Summary */}
          <div className="text-left space-y-3 bg-accent/10 p-6 rounded-lg border border-accent/30">
            <h3 className="text-accent font-semibold text-lg mb-4 text-center">
              🏆 Artifacts Collected
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-accent">📍</span>
                <span className="text-muted-foreground">Ancient Compass</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🦕</span>
                <span className="text-muted-foreground">Fossil Fragment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🔪</span>
                <span className="text-muted-foreground">Survival Knife</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">💎</span>
                <span className="text-muted-foreground">Crystal Shard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">💧</span>
                <span className="text-muted-foreground">Water Filter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🟡</span>
                <span className="text-muted-foreground">Amber Stone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🪢</span>
                <span className="text-muted-foreground">Rope Kit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">🗺️</span>
                <span className="text-muted-foreground">Ancient Map</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={onRestart}
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-6"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {isLastLevel ? "PLAY AGAIN" : "CONTINUE ADVENTURE"}
            </Button>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Share Victory
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-stone-gray text-stone-gray hover:bg-stone-gray hover:text-foreground"
              >
                Main Menu
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-accent/80">
            🦕 Thanks for playing Jurassic Hack! 🦕
          </div>
        </div>
      </Card>
    </div>
  );
};