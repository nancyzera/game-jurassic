import { Canvas } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { GameWorld } from "./GameWorld";
import { PlayerController } from "./PlayerController";
import { GameHUD } from "./GameHUD";
import { Inventory } from "./Inventory";
import { GameMenu } from "./GameMenu";
import { WinScreen } from "./WinScreen";
import { toast } from "sonner";

export interface GameItem {
  id: string;
  name: string;
  type: "artifact" | "tool" | "gear";
  position: [number, number, number];
  collected: boolean;
}

export interface GameState {
  health: number;
  stamina: number;
  inventory: GameItem[];
  totalItems: number;
  collectedItems: number;
  gameStarted: boolean;
  gameWon: boolean;
  showInventory: boolean;
}

const TOTAL_ITEMS = 8;

const GAME_ITEMS: GameItem[] = [
  { id: "1", name: "Ancient Compass", type: "tool", position: [15, 0.5, 8], collected: false },
  { id: "2", name: "Fossil Fragment", type: "artifact", position: [-12, 0.5, 15], collected: false },
  { id: "3", name: "Survival Knife", type: "gear", position: [25, 0.5, -10], collected: false },
  { id: "4", name: "Crystal Shard", type: "artifact", position: [-8, 0.5, -20], collected: false },
  { id: "5", name: "Water Filter", type: "gear", position: [30, 0.5, 18], collected: false },
  { id: "6", name: "Amber Stone", type: "artifact", position: [-25, 0.5, 5], collected: false },
  { id: "7", name: "Rope Kit", type: "gear", position: [5, 0.5, -25], collected: false },
  { id: "8", name: "Ancient Map", type: "artifact", position: [-15, 0.5, -5], collected: false },
];

export const GameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    stamina: 100,
    inventory: [],
    totalItems: TOTAL_ITEMS,
    collectedItems: 0,
    gameStarted: false,
    gameWon: false,
    showInventory: false,
  });

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
    toast("Welcome to Jurassic Hack! Find all lost items to escape!");
  }, []);

  const collectItem = useCallback((itemId: string) => {
    const item = GAME_ITEMS.find(i => i.id === itemId);
    if (!item || item.collected) return;

    if (gameState.inventory.length >= 5) {
      toast("Inventory full! Drop an item first.");
      return;
    }

    item.collected = true;
    setGameState(prev => {
      const newCollectedCount = prev.collectedItems + 1;
      const newInventory = [...prev.inventory, item];
      
      toast(`Found: ${item.name}!`);
      
      if (newCollectedCount >= TOTAL_ITEMS) {
        setTimeout(() => {
          setGameState(curr => ({ ...curr, gameWon: true }));
        }, 1000);
      }

      return {
        ...prev,
        inventory: newInventory,
        collectedItems: newCollectedCount,
      };
    });
  }, [gameState.inventory.length]);

  const takeDamage = useCallback((amount: number) => {
    setGameState(prev => {
      const newHealth = Math.max(0, prev.health - amount);
      if (newHealth <= 0) {
        toast("Game Over! Dinosaur caught you!");
        return { ...prev, health: 0, gameStarted: false };
      }
      return { ...prev, health: newHealth };
    });
  }, []);

  const useStamina = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - amount)
    }));
  }, []);

  const restoreStamina = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      stamina: Math.min(100, prev.stamina + amount)
    }));
  }, []);

  const toggleInventory = useCallback(() => {
    setGameState(prev => ({ ...prev, showInventory: !prev.showInventory }));
  }, []);

  const resetGame = useCallback(() => {
    GAME_ITEMS.forEach(item => item.collected = false);
    setGameState({
      health: 100,
      stamina: 100,
      inventory: [],
      totalItems: TOTAL_ITEMS,
      collectedItems: 0,
      gameStarted: false,
      gameWon: false,
      showInventory: false,
    });
  }, []);

  if (!gameState.gameStarted) {
    return <GameMenu onStartGame={startGame} />;
  }

  if (gameState.gameWon) {
    return <WinScreen onRestart={resetGame} />;
  }

  return (
    <div className="w-full h-screen relative game-cursor">
      <Canvas
        camera={{ position: [0, 2, 0], fov: 75 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="forest" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <GameWorld 
            items={GAME_ITEMS}
            onItemCollect={collectItem}
            onPlayerDamage={takeDamage}
          />
          
          <PlayerController 
            health={gameState.health}
            stamina={gameState.stamina}
            onUseStamina={useStamina}
            onRestoreStamina={restoreStamina}
            onToggleInventory={toggleInventory}
          />
        </Suspense>
      </Canvas>

      <GameHUD 
        health={gameState.health}
        stamina={gameState.stamina}
        collectedItems={gameState.collectedItems}
        totalItems={gameState.totalItems}
        onToggleInventory={toggleInventory}
      />

      {gameState.showInventory && (
        <Inventory 
          items={gameState.inventory}
          onClose={() => setGameState(prev => ({ ...prev, showInventory: false }))}
        />
      )}
    </div>
  );
};