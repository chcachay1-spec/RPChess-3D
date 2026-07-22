import { useGameStore } from '../../store/game-store';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import Hero from './Hero';
import Structure from './Structure';
import Camera from './Camera';
import { BOARD_COLS, BOARD_ROWS, HEX_SIZE } from '../../constants';
import type { ReliefLevel } from '../../types/hex';
import { coordKey } from '../../logic/hex-grid';
import { canAttackByRelief } from '../../logic/relief-rules';

/**
 * Escena 3D principal de RPChess.
 *
 * Composición:
 * - Cámara isométrica (Camera.tsx)
 * - Iluminación (ambient + directional + hemisphere)
 * - Tablero (Board.tsx)
 * - 12 piezas (Hero.tsx)
 * - 4 estructuras (Structure.tsx)
 * - Suelo base
 */
export default function Scene3D() {
  const pieces = useGameStore((s) => s.pieces);
  const structures = useGameStore((s) => s.structures);
  const reliefs = useGameStore((s) => s.reliefs);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const hoverTargetId = useGameStore((s) => s.hoverTargetId);
  const selectPiece = useGameStore((s) => s.selectPiece);
  const setHoverTarget = useGameStore((s) => s.setHoverTarget);

  // Calcular altura base según relieve en ese punto
  const reliefY = (q: number, r: number): number => {
    const relief = (reliefs.get(`${q},${r}`) ?? 1) as ReliefLevel;
    return relief * 0.2; // ajuste visual
  };

  // Centrar el board en el view
  const centerX = (BOARD_COLS * HEX_SIZE * 1.5) / 2;
  const centerZ = (BOARD_ROWS * HEX_SIZE * Math.sqrt(3)) / 2;

  return (
    <>
      <Camera />

      {/* OrbitControls — arrastra con click izquierdo para rotar, scroll para zoom */}
      <OrbitControls
        target={[centerX, 0, centerZ]}
        enablePan={false}
        minDistance={12}
        maxDistance={55}
        minPolarAngle={Math.PI / 8}     // 22.5° — no permite ir casi cenital
        maxPolarAngle={Math.PI / 2.3}   // ~78° — no permite ir bajo el tablero
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.9}
      />

      {/* Iluminación */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <hemisphereLight color="#aab8d4" groundColor="#1a1a2e" intensity={0.3} />

      <group position={[-centerX, 0, -centerZ]}>
        <Board />

        {/* Piezas */}
        {pieces.map((piece) => {
          if (!piece.position) return null;
          const baseY = reliefY(piece.position.q, piece.position.r);

          // Si hay pieza aliada seleccionada y esta pieza es enemiga, calculamos si se puede atacar
          let hoverState: boolean | undefined = undefined;
          if (
            selectedPieceId &&
            piece.team === 'enemy' &&
            hoverTargetId === piece.id
          ) {
            const attacker = pieces.find((p) => p.id === selectedPieceId);
            if (attacker && attacker.position) {
              const aRelief = (reliefs.get(coordKey(attacker.position)) ?? 1) as ReliefLevel;
              const tRelief = (reliefs.get(coordKey(piece.position)) ?? 1) as ReliefLevel;
              hoverState = canAttackByRelief(aRelief, tRelief);
            }
          }

          return (
            <Hero
              key={piece.id}
              piece={piece}
              baseY={baseY}
              isSelected={piece.id === selectedPieceId}
              isHovered={hoverState}
              onClick={(id) => selectPiece(id)}
              onPointerOver={(id) => setHoverTarget(id)}
              onPointerOut={() => setHoverTarget(null)}
            />
          );
        })}

        {/* Estructuras */}
        {structures.map((s) => {
          const baseY = reliefY(s.position.q, s.position.r);
          return <Structure key={s.id} structure={s} baseY={baseY} />;
        })}
      </group>
    </>
  );
}
