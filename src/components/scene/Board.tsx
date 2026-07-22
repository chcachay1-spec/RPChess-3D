import { useEffect, useMemo, useRef, useState } from 'react';
import HexTile from './HexTile';
import Hero from './Hero';
import { useGameStore } from '../../store/game-store';
import { getBoardHexes, coordKey } from '../../logic/hex-grid';
import { BOARD_COLS, BOARD_ROWS } from '../../constants';

interface PieceMotion {
  id: string;
  from: { q: number; r: number };
}

export default function Board() {
  const reliefs = useGameStore((s) => s.reliefs);
  const pieces = useGameStore((s) => s.pieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const validMoves = useGameStore((s) => s.validMoves);
  const init = useGameStore((s) => s.init);
  const movePiece = useGameStore((s) => s.movePiece);
  const selectPiece = useGameStore((s) => s.selectPiece);
  const attackPiece = useGameStore((s) => s.attackPiece);
  const getReliefAt = useGameStore((s) => s.getReliefAt);

  // Ref que guarda la snapshot de pieces ANTES del ultimo render.
  // Esto nos permite detectar diffs y emitir "motions" (animaciones de salto).
  const prevPiecesRef = useRef<Piece[]>([]);
  const [motions, setMotions] = useState<PieceMotion[]>([]);

  useEffect(() => {
    const prev = prevPiecesRef.current;
    const newMotions: PieceMotion[] = [];
    for (const p of pieces) {
      if (!p.position) continue;
      const prevPiece = prev.find((x) => x.id === p.id);
      const prevPos = prevPiece?.position;
      if (prevPos && (prevPos.q !== p.position.q || prevPos.r !== p.position.r)) {
        newMotions.push({ id: p.id, from: { q: prevPos.q, r: prevPos.r } });
      }
    }
    if (newMotions.length > 0) {
      setMotions((cur) => [...cur, ...newMotions]);
    }
    prevPiecesRef.current = pieces;
  }, [pieces]);

  const hexes = useMemo(() => getBoardHexes(BOARD_COLS, BOARD_ROWS), []);

  useEffect(() => {
    if (reliefs.size === 0) init();
  }, [reliefs.size, init]);

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  return (
    <group>
      {hexes.map((hex) => {
        const key = coordKey(hex);
        const relief = reliefs.get(key) ?? 1;
        const isValidMove = validMoves.some((m) => m.q === hex.q && m.r === hex.r);

        // Determinar si este hex tiene un enemigo target para ataque
        const enemyHere = pieces.find(
          (p) => p.position && p.position.q === hex.q && p.position.r === hex.r && p.team === 'enemy',
        );
        let isAttackTarget: 'valid' | 'invalid' | null = null;
        if (enemyHere && selectedPiece && selectedPiece.position) {
          const aRelief = getReliefAt(selectedPiece.position);
          const tRelief = getReliefAt(hex);
          const diff = aRelief - tRelief;
          isAttackTarget = diff === 0 || diff === 1 ? 'valid' : 'invalid';
        }

        return (
          <HexTile
            key={key}
            coord={hex}
            relief={relief}
            isValidMove={isValidMove && !enemyHere}
            isAttackTarget={isAttackTarget}
            onClick={(target) => {
              if (!selectedPiece) return;

              if (enemyHere) {
                attackPiece(selectedPiece.id, enemyHere.id);
                return;
              }

              if (isValidMove) {
                movePiece(selectedPiece.id, target);
                return;
              }

              // Click en hex no válido: deseleccionar
              selectPiece(null);
            }}
          />
        );
      })}

      {/* Heroes: piezas aliadas/enemigas con animacion de salto */}
      {pieces.filter((p) => p.position).map((p) => {
        const motion = motions.find((m) => m.id === p.id);
        return (
          <Hero
            key={p.id}
            piece={p}
            baseY={0}
            isSelected={selectedPieceId === p.id}
            fromPos={motion ? motion.from : null}
            onClick={(id) => selectPiece(id)}
            onPointerOver={() => { /* hover via HexTile */ }}
            onPointerOut={() => {}}
            onAnimationDone={() => {
              // Al terminar, removemos la motion para que la pieza quede
              // en su nueva posicion sin re-animar.
              setMotions((cur) => cur.filter((m) => m.id !== p.id));
            }}
          />
        );
      })}
    </group>
  );
}
