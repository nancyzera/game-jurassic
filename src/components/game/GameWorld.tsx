import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { GameItem } from "./GameEngine";

interface GameWorldProps {
  items: GameItem[];
  onItemCollect: (itemId: string) => void;
  onPlayerDamage: (damage: number) => void;
  environment: "jungle" | "cave" | "river";
}

// Dinosaur component with basic AI
const Dinosaur = ({ position, onPlayerDamage }: { 
  position: [number, number, number]; 
  onPlayerDamage: (damage: number) => void;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [direction, setDirection] = useState(Math.random() * Math.PI * 2);
  const [speed] = useState(0.5 + Math.random() * 0.5);
  const [lastDamageTime, setLastDamageTime] = useState(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Simple roaming AI
    meshRef.current.position.x += Math.cos(direction) * speed * 0.01;
    meshRef.current.position.z += Math.sin(direction) * speed * 0.01;

    // Change direction occasionally
    if (Math.random() < 0.002) {
      setDirection(Math.random() * Math.PI * 2);
    }

    // Keep within bounds
    if (Math.abs(meshRef.current.position.x) > 40) {
      setDirection(direction + Math.PI);
    }
    if (Math.abs(meshRef.current.position.z) > 40) {
      setDirection(direction + Math.PI);
    }

    // Rotate to face movement direction
    meshRef.current.rotation.y = direction;

    // Check collision with player (camera position)
    const playerPos = state.camera.position;
    const dinoPos = meshRef.current.position;
    const distance = playerPos.distanceTo(dinoPos);

    if (distance < 3 && state.clock.elapsedTime - lastDamageTime > 2) {
      onPlayerDamage(10);
      setLastDamageTime(state.clock.elapsedTime);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Dinosaur body (simplified) */}
      <Box args={[2, 1.5, 4]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#4a7c59" />
      </Box>
      {/* Head */}
      <Box args={[1, 1, 1.5]} position={[0, 1.5, 2]}>
        <meshStandardMaterial color="#3d6b4a" />
      </Box>
      {/* Tail */}
      <Cylinder args={[0.3, 0.8, 3]} position={[0, 1, -3]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#4a7c59" />
      </Cylinder>
      {/* Eyes */}
      <Sphere args={[0.1]} position={[-0.3, 1.7, 2.7]}>
        <meshStandardMaterial color="#ff4444" />
      </Sphere>
      <Sphere args={[0.1]} position={[0.3, 1.7, 2.7]}>
        <meshStandardMaterial color="#ff4444" />
      </Sphere>
    </group>
  );
};

// Collectible item component
const CollectibleItem = ({ item, onCollect }: { 
  item: GameItem; 
  onCollect: (id: string) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [playerNear, setPlayerNear] = useState(false);

  useFrame((state) => {
    if (!meshRef.current || item.collected) return;

    // Floating animation
    meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    meshRef.current.rotation.y += 0.02;

    // Check if player is near
    const playerPos = state.camera.position;
    const itemPos = meshRef.current.position;
    const distance = playerPos.distanceTo(itemPos);

    if (distance < 2) {
      setPlayerNear(true);
      // Auto-collect when very close
      if (distance < 1.5) {
        onCollect(item.id);
      }
    } else {
      setPlayerNear(false);
    }
  });

  if (item.collected) return null;

  const getItemColor = () => {
    switch (item.type) {
      case "artifact": return "#ffd700"; // Gold
      case "tool": return "#4a90e2"; // Blue
      case "gear": return "#50c878"; // Green
      default: return "#ffffff";
    }
  };

  return (
    <group>
      <mesh ref={meshRef} position={item.position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={getItemColor()} 
          emissive={getItemColor()}
          emissiveIntensity={playerNear ? 0.3 : 0.1}
        />
      </mesh>
      
      {playerNear && (
        <Text
          position={[item.position[0], item.position[1] + 2, item.position[2]]}
          fontSize={0.3}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
        >
          {item.name}
        </Text>
      )}
    </group>
  );
};

// Terrain and environment
const Terrain = () => {
  return (
    <group>
      {/* Ground */}
      <Box args={[100, 0.1, 100]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#2d5016" />
      </Box>

      {/* Trees */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        const height = 3 + Math.random() * 4;
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Trunk */}
            <Cylinder args={[0.3, 0.4, height]} position={[0, height / 2, 0]}>
              <meshStandardMaterial color="#4a2c1a" />
            </Cylinder>
            {/* Leaves */}
            <Sphere args={[1.5]} position={[0, height + 1, 0]}>
              <meshStandardMaterial color="#1a5c1a" />
            </Sphere>
          </group>
        );
      })}

      {/* Rocks */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        const size = 0.5 + Math.random() * 1;
        
        return (
          <Box 
            key={i} 
            args={[size, size * 0.7, size * 0.8]} 
            position={[x, size * 0.35, z]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <meshStandardMaterial color="#666666" />
          </Box>
        );
      })}

      {/* Grass patches */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 90;
        const z = (Math.random() - 0.5) * 90;
        
        return (
          <Box 
            key={i} 
            args={[0.1, 0.5, 0.1]} 
            position={[x, 0.25, z]}
          >
            <meshStandardMaterial color="#2d7016" />
          </Box>
        );
      })}
    </group>
  );
};

export const GameWorld = ({ items, onItemCollect, onPlayerDamage, environment }: GameWorldProps) => {
  
  // Environment-specific terrain rendering
  const TerrainByEnvironment = () => {
    switch (environment) {
      case "cave":
        return (
          <group>
            {/* Cave floor */}
            <Box args={[100, 0.1, 100]} position={[0, -0.05, 0]}>
              <meshStandardMaterial color="#2a1f1a" />
            </Box>
            {/* Cave walls and stalactites */}
            {Array.from({ length: 40 }).map((_, i) => {
              const x = (Math.random() - 0.5) * 80;
              const z = (Math.random() - 0.5) * 80;
              const height = 2 + Math.random() * 6;
              
              return (
                <Cylinder key={i} args={[0.3, 0.6, height]} position={[x, height / 2, z]}>
                  <meshStandardMaterial color="#4a4037" />
                </Cylinder>
              );
            })}
          </group>
        );
      
      case "river":
        return (
          <group>
            {/* River ground */}
            <Box args={[100, 0.1, 100]} position={[0, -0.05, 0]}>
              <meshStandardMaterial color="#2d4a2a" />
            </Box>
            {/* Water areas */}
            <Box args={[20, 0.05, 100]} position={[0, 0.02, 0]}>
              <meshStandardMaterial color="#4a7c99" transparent opacity={0.7} />
            </Box>
            {/* Riverside rocks */}
            {Array.from({ length: 35 }).map((_, i) => {
              const x = (Math.random() - 0.5) * 90;
              const z = (Math.random() - 0.5) * 90;
              const size = 0.8 + Math.random() * 1.5;
              
              return (
                <Box 
                  key={i} 
                  args={[size, size * 0.8, size * 0.9]} 
                  position={[x, size * 0.4, z]}
                  rotation={[0, Math.random() * Math.PI, 0]}
                >
                  <meshStandardMaterial color="#5a5a5a" />
                </Box>
              );
            })}
          </group>
        );
      
      default: // jungle
        return (
          <group>
            {/* Ground */}
            <Box args={[100, 0.1, 100]} position={[0, -0.05, 0]}>
              <meshStandardMaterial color="#2d5016" />
            </Box>

            {/* Trees */}
            {Array.from({ length: 50 }).map((_, i) => {
              const x = (Math.random() - 0.5) * 80;
              const z = (Math.random() - 0.5) * 80;
              const height = 3 + Math.random() * 4;
              
              return (
                <group key={i} position={[x, 0, z]}>
                  {/* Trunk */}
                  <Cylinder args={[0.3, 0.4, height]} position={[0, height / 2, 0]}>
                    <meshStandardMaterial color="#4a2c1a" />
                  </Cylinder>
                  {/* Leaves */}
                  <Sphere args={[1.5]} position={[0, height + 1, 0]}>
                    <meshStandardMaterial color="#1a5c1a" />
                  </Sphere>
                </group>
              );
            })}

            {/* Rocks */}
            {Array.from({ length: 30 }).map((_, i) => {
              const x = (Math.random() - 0.5) * 70;
              const z = (Math.random() - 0.5) * 70;
              const size = 0.5 + Math.random() * 1;
              
              return (
                <Box 
                  key={i} 
                  args={[size, size * 0.7, size * 0.8]} 
                  position={[x, size * 0.35, z]}
                  rotation={[0, Math.random() * Math.PI, 0]}
                >
                  <meshStandardMaterial color="#666666" />
                </Box>
              );
            })}

            {/* Grass patches */}
            {Array.from({ length: 100 }).map((_, i) => {
              const x = (Math.random() - 0.5) * 90;
              const z = (Math.random() - 0.5) * 90;
              
              return (
                <Box 
                  key={i} 
                  args={[0.1, 0.5, 0.1]} 
                  position={[x, 0.25, z]}
                >
                  <meshStandardMaterial color="#2d7016" />
                </Box>
              );
            })}
          </group>
        );
    }
  };
  return (
    <group>
      <TerrainByEnvironment />
      
      {/* Collectible items */}
      {items.map(item => (
        <CollectibleItem
          key={item.id}
          item={item}
          onCollect={onItemCollect}
        />
      ))}

      {/* Dinosaurs - dynamically positioned */}
      <Dinosaur position={[10, 0, 5]} onPlayerDamage={onPlayerDamage} />
      <Dinosaur position={[-15, 0, -10]} onPlayerDamage={onPlayerDamage} />
      <Dinosaur position={[20, 0, -20]} onPlayerDamage={onPlayerDamage} />
      {environment !== "jungle" && <Dinosaur position={[-25, 0, 15]} onPlayerDamage={onPlayerDamage} />}
      {environment === "river" && <Dinosaur position={[5, 0, 25]} onPlayerDamage={onPlayerDamage} />}
    </group>
  );
};
