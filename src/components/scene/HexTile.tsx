import { ThreeEvent } from '@react-three/fiber';
import type { AxialCoord, ReliefLevel } from '../../types/hex';
import { axialToWorld } from '../../logic/hex-grid';
import { RELIEF_COLORS, UI_VALID, UI_INVALID } from '../../data/colors';

interface HexTileProps {
  coord: AxialCoord;
  relief: ReliefLevel;
  isValidMove?: boolean;
  isAttackTarget?: 'valid' | 'invalid' | null;
  onClick?: (coord: AxialCoord) => void;
}

export default function HexTile({ coord, relief, isValidMove, isAttackTarget, onClick }: HexTileProps) {
  const [x, , z] = axialToWorld(coord, 1.0);
  const baseY = -0.5;
  const height = relief === 0 ? 0.3 : relief === 1 ? 0.5 : 1.0;
  const topY = baseY + height / 2;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(coord);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group position={[x, 0, z]}>
      {/* Hex base — cylinder con 6 lados */}
      <mesh
        position={[0, topY, 0]}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry args={[0.95, 0.95, height, 6]} />
        <meshStandardMaterial color={RELIEF_COLORS[relief]} roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Highlight overlay para movimientos válidos */}
      {isValidMove && (
        <mesh position={[0, topY + height / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.85, 6]} />
          <meshBasicMaterial color={UI_VALID} transparent opacity={0.7} side={2} />
        </mesh>
      )}

      {/* Highlight overlay para objetivos de ataque */}
      {isAttackTarget && (
        <mesh position={[0, topY + height / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.9, 6]} />
          <meshBasicMaterial
            color={isAttackTarget === 'valid' ? UI_VALID : UI_INVALID}
            transparent
            opacity={0.8}
            side={2}
          />
        </mesh>
      )}
    </group>
  );
}
