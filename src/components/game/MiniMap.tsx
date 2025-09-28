import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Eye } from "lucide-react";

interface MiniMapProps {
  playerPosition: [number, number, number];
  items: Array<{
    id: string;
    position: [number, number, number];
    collected: boolean;
    name: string;
  }>;
  dinosaurs: Array<{
    position: [number, number, number];
  }>;
  mapSize: number;
  currentLevel: string;
}

export const MiniMap = ({ 
  playerPosition, 
  items, 
  dinosaurs, 
  mapSize = 60,
  currentLevel 
}: MiniMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapScale = 120; // Mini-map size in pixels
  const worldScale = mapSize; // World size

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, mapScale, mapScale);

    // Set canvas size
    canvas.width = mapScale;
    canvas.height = mapScale;

    // Draw background (terrain)
    const gradient = ctx.createRadialGradient(
      mapScale / 2, mapScale / 2, 0,
      mapScale / 2, mapScale / 2, mapScale / 2
    );
    
    // Different colors based on level
    if (currentLevel.includes('Jungle')) {
      gradient.addColorStop(0, 'hsl(110, 50%, 20%)');
      gradient.addColorStop(1, 'hsl(95, 40%, 15%)');
    } else if (currentLevel.includes('Cave')) {
      gradient.addColorStop(0, 'hsl(25, 10%, 25%)');
      gradient.addColorStop(1, 'hsl(25, 10%, 15%)');
    } else {
      gradient.addColorStop(0, 'hsl(200, 70%, 35%)');
      gradient.addColorStop(1, 'hsl(200, 70%, 25%)');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, mapScale, mapScale);

    // Helper function to convert world coordinates to mini-map coordinates
    const worldToMap = (worldX: number, worldZ: number) => {
      const x = ((worldX + worldScale / 2) / worldScale) * mapScale;
      const z = ((worldZ + worldScale / 2) / worldScale) * mapScale;
      return [x, z];
    };

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    const gridSize = mapScale / 8;
    for (let i = 0; i <= mapScale; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, mapScale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(mapScale, i);
      ctx.stroke();
    }

    // Draw items
    items.forEach(item => {
      const [x, z] = worldToMap(item.position[0], item.position[2]);
      
      if (item.collected) {
        // Collected items - gray circle
        ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.strokeStyle = 'rgba(128, 128, 128, 0.8)';
      } else {
        // Uncollected items - golden circle with pulse
        ctx.fillStyle = 'hsl(45, 85%, 55%)';
        ctx.strokeStyle = 'hsl(45, 85%, 65%)';
      }
      
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, z, item.collected ? 2 : 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Add glow for uncollected items
      if (!item.collected) {
        ctx.shadowColor = 'hsl(45, 85%, 55%)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, z, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw dinosaurs
    dinosaurs.forEach(dinosaur => {
      const [x, z] = worldToMap(dinosaur.position[0], dinosaur.position[2]);
      
      ctx.fillStyle = 'hsl(0, 75%, 50%)';
      ctx.strokeStyle = 'hsl(0, 75%, 60%)';
      ctx.lineWidth = 1;
      
      // Draw triangle for dinosaur
      ctx.beginPath();
      ctx.moveTo(x, z - 3);
      ctx.lineTo(x - 2, z + 2);
      ctx.lineTo(x + 2, z + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Add red glow
      ctx.shadowColor = 'hsl(0, 75%, 50%)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw player
    const [playerX, playerZ] = worldToMap(playerPosition[0], playerPosition[2]);
    
    // Player circle
    ctx.fillStyle = 'hsl(120, 60%, 45%)';
    ctx.strokeStyle = 'hsl(120, 60%, 55%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerX, playerZ, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Player direction indicator (small line)
    ctx.strokeStyle = 'hsl(120, 60%, 55%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playerX, playerZ);
    ctx.lineTo(playerX, playerZ - 6);
    ctx.stroke();
    
    // Add glow to player
    ctx.shadowColor = 'hsl(120, 60%, 45%)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(playerX, playerZ, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [playerPosition, items, dinosaurs, mapScale, worldScale, currentLevel]);

  const uncollectedItems = items.filter(item => !item.collected).length;
  const totalItems = items.length;

  return (
    <Card className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-accent/30 p-3 w-48">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-accent flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Map
          </h3>
          <Badge variant="outline" className="text-xs border-accent/50 text-accent">
            {currentLevel}
          </Badge>
        </div>

        {/* Mini-map canvas */}
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-30 rounded border border-accent/20"
            style={{ aspectRatio: '1' }}
          />
          
          {/* Legend overlay */}
          <div className="absolute bottom-1 left-1 right-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <div className="flex justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-health"></div>
                <span className="text-muted-foreground">You</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                <span className="text-muted-foreground">{uncollectedItems}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-destructive" style={{ 
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                }}></div>
                <span className="text-muted-foreground">{dinosaurs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Progress: {totalItems - uncollectedItems}/{totalItems}
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
            <div 
              className="bg-accent h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${((totalItems - uncollectedItems) / totalItems) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};