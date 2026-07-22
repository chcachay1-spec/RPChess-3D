import { axialToWorld } from '../../logic/hex-grid';
import type { Structure as StructureType } from '../../types/hex';
import { TEAM_COLORS } from '../../data/colors';

interface StructureProps {
  structure: StructureType;
  baseY: number;
}

export default function Structure({ structure, baseY }: StructureProps) {
  const [x, , z] = axialToWorld(structure.position, 1.0);
  const y = baseY + 0.5;

  switch (structure.type) {
    case 'tower':
      return (
        <group position={[x, y, z]}>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.55, 1.4, 8]} />
            <meshStandardMaterial color="#888B8E" />
          </mesh>
          <mesh castShadow position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.15, 8]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} castShadow
              position={[Math.cos((i / 6) * Math.PI * 2) * 0.5, 0.92, Math.sin((i / 6) * Math.PI * 2) * 0.5]}
            >
              <boxGeometry args={[0.15, 0.2, 0.15]} />
              <meshStandardMaterial color="#888B8E" />
            </mesh>
          ))}
          {/* Banderín si tiene team */}
          {structure.team && (
            <mesh castShadow position={[0, 1.3, 0]}>
              <boxGeometry args={[0.4, 0.25, 0.02]} />
              <meshStandardMaterial color={TEAM_COLORS[structure.team]} />
            </mesh>
          )}
        </group>
      );
    case 'banner':
      const color = structure.team === 'enemy' ? '#EF4444' : structure.team === 'ally' ? '#3B82F6' : '#9CA3AF';
      return (
        <group position={[x, y, z]}>
          {/* Base */}
          <mesh castShadow position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.15, 8]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          {/* Palo */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tela */}
          <mesh castShadow position={[0.25, 0.85, 0]}>
            <boxGeometry args={[0.5, 0.35, 0.02]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      );
    case 'chest':
      return (
        <group position={[x, y, z]}>
          <mesh castShadow position={[0, -0.15, 0]}>
            <boxGeometry args={[0.6, 0.4, 0.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh castShadow position={[0, 0.15, 0]}>
            <boxGeometry args={[0.62, 0.2, 0.42]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
          {/* Bandas metálicas */}
          <mesh castShadow position={[0, -0.15, 0.21]}>
            <boxGeometry args={[0.62, 0.05, 0.01]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          <mesh castShadow position={[0, -0.15, -0.21]}>
            <boxGeometry args={[0.62, 0.05, 0.01]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          {/* Cerradura */}
          <mesh castShadow position={[0, 0.05, 0.21]}>
            <boxGeometry args={[0.1, 0.1, 0.02]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}
