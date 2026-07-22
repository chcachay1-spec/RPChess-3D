import { useEffect, useMemo, useRef } from 'react';
import HexTile from './HexTile';
import Hero from './Hero';
import { useGameStore } from '../../store/game-store';
import { getBoardHexes, coordKey } from '../../logic/hex-grid';
import { getValidMoves } from '../../logic/movement';
import type { AxialCoord } from '../../types/hex';
import { BOARD_COLS, BOARD_ROWS } from '../../constants';

export default function Board() {
  const reliefs = useGameStore((s) => s.reliefs);
  const pieces = useGameStore((s) => s.pieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const init = useGameStore((s) => s.init);
  const movePiece = useGameStore((s) => s.movePiece);
  const selectPiece = useGameStore((s) => s.selectPiece);
  const attackPiece = useGameStore((s) => s.attackPiece);
  const getReliefAt = useGameStore((s) => s.getReliefAt);

  const prevPiecesRef = useRef<Piece[]>([]);

  // Detectar cambios de position (de momento solo loggeamos; la anim de salto
  // se hace en Hero cuando arrastramos la pieza desde su posicion previa).
  useEffect(() => {
    const prev = prevPiecesRef.current;
    for (const p of pieces) {
      if (!p.position) continue;
      const prevPiece = prev.find((x) => x.id === p.id);
      const prevPos = prevPiece?.position;
      // Si la pieza se movio, queda como "dirty" para que Hero la anime
      // cuando reciba un nuevo position.
      if (prevPos && (prevPos.q !== p.position.q || prevPos.r !== p.position.r)) {
        // Aqui hariamos un dispatch al store para que Hero sepa su "from".
        // Por ahora esta info se mantiene como side-effect (futuro).
      }
    }
    prevPiecesRef.current = pieces;
  }, [pieces]);

  const hexes = useMemo(() => getBoardHexes(BOARD_COLS, BOARD_ROWS), []);

  useEffect(() => {
    if (reliefs.size === 0) init();
  }, [reliefs.size, init]);

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  // Calculo del set de movimientos validos cuando hay pieza aliada seleccionada
  const validMoveKeys = useMemo(() => {
    if (!selectedPiece || selectedPiece.team !== 'ally' || !selectedPiece.position) {
      return new Set<string>();
    }
    const occupied = new Set<string>();
    for (const p of pieces) {
      if (p.position) occupied.add(coordKey(p.position));
    }
    occupied.delete(coordKey(selectedPiece.position));
    const moves = getValidMoves(selectedPiece.position, selectedPiece.role, occupied, 1);
    return new Set(moves.map(coordKey));
  }, [selectedPiece, pieces]);

  // Calculo de hexes atacables: cualquier enemigo adyacente a los movimientos validos
  // cuyo ataque sea valido por la regla de relieve.
  const attackKeys = useMemo(() => {
    const targets = new Set<string>();
    if (!selectedPiece || selectedPiece.team !== 'ally' || !selectedPiece.position) {
      return targets;
    }
    const attackerRelief = getReliefAt(selectedPiece.position);
    // Buscar todas las piezas enemigas adyacentes (1 hex) al atacante
    for (const p of pieces) {
      if (p.team !== 'enemy' || !p.position) continue;
      const dq = Math.abs(p.position.q - selectedPiece.position.q);
      const dr = Math.abs(p.position.r - selectedPiece.position.r);
      // Vecino axiales (distancia hex <= 1 y no son el mismo hex)
      const dist = Math.max(dq, dr, Math.abs(dq - dr));
      if (dist === 1) {
        const targetRelief = getReliefAt(p.position);
        // Solo si attacker puede atacar a este target (regla relieve)
        const diff = attackerRelief - targetRelief;
        if (diff >= 0 && diff <= 1) {
          targets.add(coordKey(p.position));
        }
      }
    }
    return targets;
  }, [selectedPiece, pieces, getReliefAt]);

  const handleHexClick = (target: AxialCoord): void => {
    if (!selectedPiece) {
      selectPiece(null);
      return;
    }
    const key = coordKey(target);

    const enemyHere = pieces.find(
      (p) => p.team === 'enemy' && p.position && p.position.q === target.q && p.position.r === target.r,
    );
    if (enemyHere && attackKeys.has(key)) {
      attackPiece(selectedPiece.id, enemyHere.id);
      return;
    }
    if (validMoveKeys.has(key)) {
      movePiece(selectedPiece.id, target);
      return;
    }
    selectPiece(null);
  };

  const handlePieceClick = (id: string): void => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;
    if (piece.team === 'ally') {
      selectPiece(id);
    } else if (selectedPiece && attackKeys.has(coordKey(piece.position!))) {
      // Click en pieza enemiga = ataque directo
      attackPiece(selectedPiece.id, id);
    }
  };

  return (
    <group>
      {/* Hex tiles */}
      {hexes.map((hex) => {
        const key = coordKey(hex);
        const relief = reliefs.get(key) ?? 1;
        const isValidMove = validMoveKeys.has(key);
        const enemyHere = pieces.find(
          (p) => p.team === 'enemy' && p.position && p.position.q === hex.q && p.position.r === hex.r,
        );
        const isAttackTarget =
          enemyHere && attackKeys.has(key) ? ('valid' as const) : null;

        return (
          <HexTile
            key={key}
            coord={hex}
            relief={relief}
            isValidMove={isValidMove}
            isAttackTarget={isAttackTarget}
            onClick={(target) => handleHexClick(target)}
          />
        );
      })}

      {/* Hero pieces (con anim de salto) */}
      {pieces.filter((p) => p.position).map((p) => {
        const baseY = getReliefAt(p.position!) * 0.2;
        return (
          <Hero
            key={p.id}
            piece={p}
            baseY={baseY}
            isSelected={p.id === selectedPieceId}
            reliefs={reliefs}
            onClick={(id) => handlePieceClick(id)}
            onPointerOver={() => {}}
            onPointerOut={() => {}}
          />
        );
      })}
    </group>
  );
}
