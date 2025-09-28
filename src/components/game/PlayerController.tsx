import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

interface PlayerControllerProps {
  health: number;
  stamina: number;
  onUseStamina: (amount: number) => void;
  onRestoreStamina: (amount: number) => void;
  onToggleInventory?: () => void;
  onPositionUpdate?: (position: [number, number, number]) => void;
}

export const PlayerController = ({ 
  health, 
  stamina, 
  onUseStamina, 
  onRestoreStamina,
  onToggleInventory,
  onPositionUpdate
}: PlayerControllerProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement(prev => ({ ...prev, right: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement(prev => ({ ...prev, sprint: true }));
          break;
        case 'Tab':
          event.preventDefault();
          onToggleInventory?.();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement(prev => ({ ...prev, right: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement(prev => ({ ...prev, sprint: false }));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onToggleInventory]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const isMoving = movement.forward || movement.backward || movement.left || movement.right;
    const isSprinting = movement.sprint && stamina > 0 && isMoving;
    
    // Calculate movement speed
    const baseSpeed = 5;
    const sprintMultiplier = 2;
    const speed = isSprinting ? baseSpeed * sprintMultiplier : baseSpeed;

    // Handle stamina
    if (isSprinting) {
      onUseStamina(20 * delta); // Drain stamina when sprinting
    } else if (!isMoving && stamina < 100) {
      onRestoreStamina(30 * delta); // Restore stamina when not moving
    } else if (isMoving && stamina < 100) {
      onRestoreStamina(10 * delta); // Slow restore when walking
    }

    // Reset velocity
    velocity.current.x = 0;
    velocity.current.z = 0;

    // Calculate movement direction
    direction.current.set(0, 0, 0);

    if (movement.forward) direction.current.z -= 1;
    if (movement.backward) direction.current.z += 1;
    if (movement.left) direction.current.x -= 1;
    if (movement.right) direction.current.x += 1;

    // Normalize diagonal movement
    if (direction.current.length() > 0) {
      direction.current.normalize();
    }

    // Apply camera rotation to movement direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, camera.up);

    // Calculate final movement vector
    const finalDirection = new THREE.Vector3();
    finalDirection.addScaledVector(cameraDirection, -direction.current.z);
    finalDirection.addScaledVector(cameraRight, direction.current.x);
    finalDirection.y = 0; // Keep movement horizontal
    finalDirection.normalize();

    // Apply movement
    velocity.current.x = finalDirection.x * speed * delta;
    velocity.current.z = finalDirection.z * speed * delta;

    // Update camera position
    camera.position.add(velocity.current);

    // Keep player above ground
    camera.position.y = Math.max(camera.position.y, 2);

    // Keep player within world bounds
    const maxDistance = 45;
    if (camera.position.x > maxDistance) camera.position.x = maxDistance;
    if (camera.position.x < -maxDistance) camera.position.x = -maxDistance;
    if (camera.position.z > maxDistance) camera.position.z = maxDistance;
    if (camera.position.z < -maxDistance) camera.position.z = -maxDistance;

    // Update position for mini-map
    onPositionUpdate?.([camera.position.x, camera.position.y, camera.position.z]);
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera]}
      pointerSpeed={0.5}
      onLock={() => console.log('Mouse locked')}
      onUnlock={() => console.log('Mouse unlocked')}
    />
  );
};
