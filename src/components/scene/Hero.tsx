import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ThreeEvent } from '@react-three/fiber';
import { axialToWorld } from '../../logic/hex-grid';
import type { Piece, HeroRole, Team, AxialCoord } from '../../types/hex';
import { TEAM_COLORS, TEAM_ACCENT } from '../../data/colors';

interface HeroProps {
  piece: Piece;
  baseY: number;
  isSelected?: boolean;
  isHovered?: boolean;
  /** Posicion anterior, para animar el salto de movimiento. */
  fromPos?: AxialCoord | null;
  /** Posicion destino (si difiere de piece.position). */
  toPos?: AxialCoord | null;
  /** Si la pieza esta atacando (animacion de lunge adelante). */
  isAttacking?: boolean;
  onClick?: (id: string) => void;
  onPointerOver?: (id: string) => void;
  onPointerOut?: () => void;
  /** Callback que se llama cuando termina la animacion de salto. */
  onAnimationDone?: () => void;
}

const ANIM_MS = 380;

export default function Hero({
  piece, baseY, isSelected, isHovered,
  fromPos, toPos, isAttacking,
  onClick, onPointerOver, onPointerOut, onAnimationDone,
}: HeroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number>(0);
  const [animDone, setAnimDone] = useState(false);

  // Inicializa anim cuando fromPos cambia
  useEffect(() => {
    if (fromPos && groupRef.current) {
      const [fx, , fz] = axialToWorld(fromPos, 1.0);
      groupRef.current.position.set(fx, baseY + 0.5, fz);
      startTimeRef.current = performance.now();
      setAnimDone(false);
    }
  }, [fromPos, baseY]);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    if (!fromPos || animDone || !piece.position) {
      // No animar, posicion fija
      const [x, , z] = axialToWorld(piece.position ?? { q: 0, r: 0 }, 1.0);
      g.position.set(x, baseY + 0.5, z);
      return;
    }
    const elapsed = performance.now() - startTimeRef.current;
    const t = Math.min(1, elapsed / ANIM_MS);
    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const [fx, , fz] = axialToWorld(fromPos, 1.0);
    const [tx, , tz] = axialToWorld(piece.position, 1.0);
    const x = fx + (tx - fx) * eased;
    const z = fz + (tz - fz) * eased;
    // Salto: arco parabolico (altura pico a t=0.5)
    const arc = Math.sin(eased * Math.PI) * 0.8;
    const y = (baseY + 0.5) + arc;
    g.position.set(x, y, z);
    if (isAttacking && t > 0.7) {
      // Lunge hacia adelante al final del movimiento
      g.rotation.z = Math.sin((t - 0.7) * Math.PI * 3) * 0.15;
    }
    if (t >= 1) {
      setAnimDone(true);
      // Notificamos al padre que la anim termino para limpiar el motion.
      // (board removera la entrada en motions[]).
      if (typeof onAnimationDone === 'function') onAnimationDone();
    }
  });

  if (!piece.position && !toPos) return null;
  const [x, , z] = axialToWorld(piece.position ?? { q: 0, r: 0 }, 1.0);
  const y = baseY + 0.5;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(piece.id);
  };
  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerOver?.(piece.id);
    document.body.style.cursor = 'pointer';
  };
  const handleOut = () => {
    onPointerOut?.();
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={groupRef} position={[x, y, z]} onClick={handleClick} onPointerOver={handleOver} onPointerOut={handleOut}>
      {/* Base oscura contrastante — para que la pieza destaque sobre CUALQUIER hex */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.15, 6]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <RoleModel role={piece.role} team={piece.team} />
      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 6]} />
          <meshBasicMaterial color="#FBBF24" transparent opacity={0.8} side={2} />
        </mesh>
      )}
      {/* Hover ring (verde si se puede atacar, gris si no) */}
      {isHovered && !isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 6]} />
          <meshBasicMaterial color={isHovered === true ? '#10B981' : isHovered === false ? '#6B7280' : '#6B7280'} transparent opacity={0.6} side={2} />
        </mesh>
      )}
    </group>
  );
}

function RoleModel({ role, team }: { role: HeroRole; team: Team }) {
  const baseColor = TEAM_COLORS[team];
  const accent = TEAM_ACCENT[team];
  const skin = '#F5DEB3';
  const gold = '#FFD700';
  const silver = '#C0C0C0';
  const dark = team === 'ally' ? '#1E40AF' : '#991B1B';

  switch (role) {
    case 'king':
      return (
        <>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1.0, 8]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.4, 0.45, 0.15, 8]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          {/* Corona con 4 picos */}
          <mesh castShadow position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
            <meshStandardMaterial color={gold} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} castShadow
              position={[
                Math.cos((i / 4) * Math.PI * 2) * 0.2,
                1.2,
                Math.sin((i / 4) * Math.PI * 2) * 0.2,
              ]}
            >
              <coneGeometry args={[0.06, 0.18, 4]} />
              <meshStandardMaterial color={gold} />
            </mesh>
          ))}
          {/* Espada */}
          <mesh castShadow position={[0.45, 0.2, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.06, 0.9, 0.06]} />
            <meshStandardMaterial color={silver} />
          </mesh>
        </>
      );
    case 'queen':
      return (
        <>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 1.0, 8]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          {/* Corona alta */}
          <mesh castShadow position={[0, 1.1, 0]}>
            <coneGeometry args={[0.18, 0.5, 8]} />
            <meshStandardMaterial color={gold} />
          </mesh>
          <mesh castShadow position={[0, 1.35, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={gold} />
          </mesh>
        </>
      );
    case 'rook':
      return (
        <>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.6, 1.0, 0.6]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          {/* Crenelaciones */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.7]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} castShadow
              position={[(i % 2 === 0 ? -0.25 : 0.25), 0.75, (i < 2 ? -0.25 : 0.25)]}
            >
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial color={dark} />
            </mesh>
          ))}
        </>
      );
    case 'bishop':
      return (
        <>
          <mesh castShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1.0, 8]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          {/* Mitra */}
          <mesh castShadow position={[0, 1.05, 0]}>
            <coneGeometry args={[0.25, 0.5, 8]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh castShadow position={[0, 1.32, 0]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color={gold} />
          </mesh>
        </>
      );
    case 'knight':
      return (
        <>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.9, 0.4]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          {/* Cabeza de caballo simplificada */}
          <mesh castShadow position={[0.2, 0.7, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.3, 0.5, 0.3]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh castShadow position={[0.3, 0.55, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          {/* Pluma */}
          <mesh castShadow position={[0.2, 1.1, 0]}>
            <coneGeometry args={[0.08, 0.3, 4]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        </>
      );
    case 'pawn':
      return (
        <>
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5, 8]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <mesh castShadow position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 8]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </>
      );
  }
}
