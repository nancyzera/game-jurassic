import { Canvas } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { GameWorld } from "./GameWorld";
import { PlayerController } from "./PlayerController";
import { GameHUD } from "./GameHUD";
import { Inventory } from "./Inventory";
import { GameMenu } from "./GameMenu";
import { LevelSelector, Level } from "./LevelSelector";
import { WinScreen } from "./WinScreen";
import { MiniMap } from "./MiniMap";
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
  showLevelSelector: boolean;
  currentLevel: number;
  playerPosition: [number, number, number];
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Jungle Outskirts",
    description: "A dense jungle filled with ancient secrets. Perfect for beginners to learn survival basics.",
    environment: "jungle",
    difficulty: "Easy",
    items: 3,
    dinosaurs: 2,
    unlocked: true,
    completed: false,
  },
  {
    id: 2,
    name: "Deep Caverns",
    description: "Dark underground caves where ancient civilizations once thrived. Watch for lurking predators.",
    environment: "cave",
    difficulty: "Medium",
    items: 4,
    dinosaurs: 3,
    unlocked: false,
    completed: false,
  },
  {
    id: 3,
    name: "Primordial Rivers",
    description: "Treacherous waterways guarded by the most dangerous prehistoric beasts.",
    environment: "river",
    difficulty: "Hard",
    items: 5,
    dinosaurs: 4,
    unlocked: false,
    completed: false,
  },
];

const LEVEL_ITEMS: { [key: number]: GameItem[] } = {
  1: [
    { id: "1-1", name: "Ancient Compass", type: "tool", position: [15, 0.5, 8], collected: false },
    { id: "1-2", name: "Fossil Fragment", type: "artifact", position: [-12, 0.5, 15], collected: false },
    { id: "1-3", name: "Survival Knife", type: "gear", position: [25, 0.5, -10], collected: false },
  ],
  2: [
    { id: "2-1", name: "Crystal Shard", type: "artifact", position: [-8, 0.5, -20], collected: false },
    { id: "2-2", name: "Water Filter", type: "gear", position: [30, 0.5, 18], collected: false },
    { id: "2-3", name: "Cave Torch", type: "tool", position: [-20, 0.5, -8], collected: false },
    { id: "2-4", name: "Stone Tablet", type: "artifact", position: [18, 0.5, -15], collected: false },
  ],
  3: [
    { id: "3-1", name: "Amber Stone", type: "artifact", position: [-25, 0.5, 5], collected: false },
    { id: "3-2", name: "Rope Kit", type: "gear", position: [5, 0.5, -25], collected: false },
    { id: "3-3", name: "Ancient Map", type: "artifact", position: [-15, 0.5, -5], collected: false },
    { id: "3-4", name: "River Pearls", type: "artifact", position: [22, 0.5, 12], collected: false },
    { id: "3-5", name: "Waterproof Pouch", type: "gear", position: [-18, 0.5, 20], collected: false },
  ],
};

export const GameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    health: 100,
    stamina: 100,
    inventory: [],
    totalItems: 0,
    collectedItems: 0,
    gameStarted: false,
    gameWon: false,
    showInventory: false,
    showLevelSelector: false,
    currentLevel: 1,
    playerPosition: [0, 2, 0],
  });

  const [levels, setLevels] = useState<Level[]>(LEVELS);
  const [currentLevelItems, setCurrentLevelItems] = useState<GameItem[]>([]);

  const showLevelSelector = useCallback(() => {
    setGameState(prev => ({ ...prev, showLevelSelector: true }));
  }, []);

  const startLevel = useCallback((levelId: number) => {
    const levelItems = LEVEL_ITEMS[levelId] || [];
    levelItems.forEach(item => item.collected = false); // Reset items
    
    setCurrentLevelItems(levelItems);
    setGameState(prev => ({ 
      ...prev, 
      gameStarted: true, 
      showLevelSelector: false,
      currentLevel: levelId,
      totalItems: levelItems.length,
      collectedItems: 0,
      health: 100,
      stamina: 100,
      inventory: [],
      gameWon: false,
    }));
    
    const currentLevel = levels.find(l => l.id === levelId);
    toast(`Welcome to ${currentLevel?.name}! Find all ${levelItems.length} items to complete this level!`);
  }, [levels]);

  const collectItem = useCallback((itemId: string) => {
    const item = currentLevelItems.find(i => i.id === itemId);
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
      
      if (newCollectedCount >= prev.totalItems) {
        // Mark level as completed
        setLevels(currentLevels => 
          currentLevels.map(level => {
            if (level.id === prev.currentLevel) {
              return { ...level, completed: true };
            }
            if (level.id === prev.currentLevel + 1) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        );
        
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
  }, [gameState.inventory.length, currentLevelItems, gameState.currentLevel]);

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
    currentLevelItems.forEach(item => item.collected = false);
    setGameState(prev => ({
      ...prev,
      health: 100,
      stamina: 100,
      inventory: [],
      collectedItems: 0,
      gameStarted: false,
      gameWon: false,
      showInventory: false,
      showLevelSelector: true,
    }));
  }, [currentLevelItems]);

  const backToMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      gameWon: false,
      showInventory: false,
      showLevelSelector: false,
    }));
  }, []);

  const updatePlayerPosition = useCallback((position: [number, number, number]) => {
    setGameState(prev => ({ ...prev, playerPosition: position }));
  }, []);

  if (!gameState.gameStarted && !gameState.showLevelSelector) {
    return <GameMenu onStartGame={showLevelSelector} />;
  }

  if (gameState.showLevelSelector) {
    return (
      <LevelSelector 
        levels={levels}
        onSelectLevel={startLevel}
        onBack={backToMenu}
      />
    );
  }

  if (gameState.gameWon) {
    const currentLevel = levels.find(l => l.id === gameState.currentLevel);
    return (
      <WinScreen 
        onRestart={resetGame}
        levelName={currentLevel?.name || "Unknown Level"}
        isLastLevel={gameState.currentLevel === levels.length}
      />
    );
  }

  const currentLevel = levels.find(l => l.id === gameState.currentLevel);
  const dinosaurPositions = Array.from({ length: currentLevel?.dinosaurs || 2 }, (_, i) => ({
    position: [
      Math.cos(i * 2.5) * 20 + Math.random() * 10,
      0,
      Math.sin(i * 2.5) * 20 + Math.random() * 10,
    ] as [number, number, number]
  }));

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 0], fov: 75 }}
        className="w-full h-full"
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="forest" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <fog attach="fog" args={['#ffffff', 50, 200]} />
          
          <GameWorld 
            items={currentLevelItems}
            onItemCollect={collectItem}
            onPlayerDamage={takeDamage}
            environment={currentLevel?.environment || "jungle"}
          />
          
          <PlayerController 
            health={gameState.health}
            stamina={gameState.stamina}
            onUseStamina={useStamina}
            onRestoreStamina={restoreStamina}
            onToggleInventory={toggleInventory}
            onPositionUpdate={updatePlayerPosition}
          />
        </Suspense>
      </Canvas>

      <GameHUD 
        health={gameState.health}
        stamina={gameState.stamina}
        collectedItems={gameState.collectedItems}
        totalItems={gameState.totalItems}
        onToggleInventory={toggleInventory}
        currentLevel={currentLevel?.name || "Unknown Level"}
      />

      <MiniMap 
        playerPosition={gameState.playerPosition}
        items={currentLevelItems}
        dinosaurs={dinosaurPositions}
        mapSize={60}
        currentLevel={currentLevel?.name || "Unknown Level"}
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