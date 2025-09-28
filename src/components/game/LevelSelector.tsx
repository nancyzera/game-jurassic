import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, Mountain, Waves, ArrowRight, Lock } from "lucide-react";

export interface Level {
  id: number;
  name: string;
  description: string;
  environment: "jungle" | "cave" | "river";
  difficulty: "Easy" | "Medium" | "Hard";
  items: number;
  dinosaurs: number;
  unlocked: boolean;
  completed: boolean;
}

interface LevelSelectorProps {
  levels: Level[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const levelIcons = {
  jungle: Trees,
  cave: Mountain,
  river: Waves,
};

const difficultyColors = {
  Easy: "bg-health text-foreground",
  Medium: "bg-warning text-foreground",
  Hard: "bg-destructive text-foreground",
};

export const LevelSelector = ({ levels, onSelectLevel, onBack }: LevelSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 jungle-gradient opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--jungle-primary))_0%,transparent_60%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--ancient-gold))_0%,transparent_60%)] opacity-20"></div>

      <div className="w-full max-w-6xl mx-4 space-y-6">
        {/* Header */}
        <Card className="bg-card/90 backdrop-blur-sm border-2 border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-accent">Select Level</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Choose your adventure in the prehistoric world
              </p>
            </div>
            <Button 
              onClick={onBack}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Back to Menu
            </Button>
          </div>
        </Card>

        {/* Level Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level) => {
            const IconComponent = levelIcons[level.environment];
            const isAccessible = level.unlocked;
            
            return (
              <Card 
                key={level.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  isAccessible 
                    ? 'bg-card/90 backdrop-blur-sm border-2 border-accent/30 hover:border-accent/60 hover:scale-105 cursor-pointer' 
                    : 'bg-card/50 backdrop-blur-sm border-2 border-muted/30 cursor-not-allowed opacity-60'
                }`}
                onClick={() => isAccessible && onSelectLevel(level.id)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`w-full h-full ${level.environment === 'jungle' ? 'bg-jungle-primary' : level.environment === 'cave' ? 'bg-stone-gray' : 'bg-stamina'}`}></div>
                </div>

                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isAccessible ? 'bg-accent/20' : 'bg-muted/20'}`}>
                        {isAccessible ? (
                          <IconComponent className="w-6 h-6 text-accent" />
                        ) : (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{level.name}</h3>
                        <Badge className={difficultyColors[level.difficulty]}>
                          {level.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {level.completed && (
                      <Badge className="bg-health text-foreground">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {level.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{level.items}</div>
                      <div className="text-xs text-muted-foreground">Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-warning">{level.dinosaurs}</div>
                      <div className="text-xs text-muted-foreground">Threats</div>
                    </div>
                  </div>

                  {/* Action */}
                  {isAccessible && (
                    <div className="pt-2">
                      <Button 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        size="sm"
                      >
                        Enter Level
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {!isAccessible && (
                    <div className="pt-2">
                      <div className="text-center text-sm text-muted-foreground">
                        Complete previous levels to unlock
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary */}
        <Card className="bg-card/90 backdrop-blur-sm border-2 border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Progress</h3>
              <p className="text-sm text-muted-foreground">
                {levels.filter(l => l.completed).length} of {levels.length} levels completed
              </p>
            </div>
            <div className="flex gap-2">
              {levels.map(level => (
                <div 
                  key={level.id}
                  className={`w-3 h-3 rounded-full ${
                    level.completed ? 'bg-health' : 
                    level.unlocked ? 'bg-warning' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};