import { useEffect, useMemo } from 'react';
import HexTile from './HexTile';
import { useGameStore } from '../../store/game-store';
import { getBoardHexes, coordKey } from '../../logic/hex-grid';
import { BOARD_COLS, BOARD_ROWS } from '../../constants';

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
    </group>
  );
}
