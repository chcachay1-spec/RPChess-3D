import { useGameStore } from '../../store/game-store';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import Structure from './Structure';
import Camera from './Camera';
import { BOARD_COLS, BOARD_ROWS, HEX_SIZE } from '../../constants';
import type { ReliefLevel } from '../../types/hex';

/**
 * Escena 3D principal de RPChess.
 *
 * Las piezas y los hexes los renderiza Board.tsx (con anims + hover).
 * Scene3D solo se encarga de:
 *  - Camara + luces + OrbitControls
 *  - Estructuras (torres, cofres, banderas)
 *
 * Esto evita doble render y centraliza la logica de input en Board.
 */
export default function Scene3D() {
  const structures = useGameStore((s) => s.structures);
  const reliefs = useGameStore((s) => s.reliefs);

  const reliefY = (q: number, r: number): number => {
    const relief = (reliefs.get(`${q},${r}`) ?? 1) as ReliefLevel;
    return relief * 0.2;
  };

  const centerX = (BOARD_COLS * HEX_SIZE * 1.5) / 2;
  const centerZ = (BOARD_ROWS * HEX_SIZE * Math.sqrt(3)) / 2;

  return (
    <>
      <Camera />
      <OrbitControls
        target={[centerX, 0, centerZ]}
        enablePan={false}
        minDistance={12}
        maxDistance={55}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.3}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.9}
      />

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
        {/* Tablero + piezas aliadas/enemigas (Board renderiza ambos) */}
        <Board />

        {/* Estructuras (torres, cofres, banderas) */}
        {structures.map((s) => {
          const baseY = reliefY(s.position.q, s.position.r);
          return <Structure key={s.id} structure={s} baseY={baseY} />;
        })}
      </group>
    </>
  );
}
