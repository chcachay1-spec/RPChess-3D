import type { ReliefLevel } from '../types/hex';

/**
 * REGLA CORE de v1: ataque "downhill" según el relieve.
 *
 * - Pieza en ALTO (rojo, 2) puede atacar a alto o medio.
 * - Pieza en MEDIO (verde, 1) puede atacar a medio o bajo.
 * - Pieza en BAJO (azul, 0) solo puede atacar a bajo.
 * - NO se puede atacar "hacia arriba" ni 2 niveles abajo.
 */
export function canAttackByRelief(
  attackerRelief: ReliefLevel,
  targetRelief: ReliefLevel,
): boolean {
  const diff = attackerRelief - targetRelief;
  return diff === 0 || diff === 1;
}

/** Etiqueta legible de por qué no se puede atacar (para mensajes de UI). */
export function explainBlockedAttack(
  attackerRelief: ReliefLevel,
  targetRelief: ReliefLevel,
): string {
  if (targetRelief > attackerRelief) {
    return `No puedes atacar hacia arriba (estás en ${reliefName(attackerRelief)}, objetivo en ${reliefName(targetRelief)}).`;
  }
  if (attackerRelief - targetRelief > 1) {
    return `No puedes atacar 2 niveles abajo (estás en ${reliefName(attackerRelief)}, objetivo en ${reliefName(targetRelief)}).`;
  }
  return 'Ataque no válido.';
}

function reliefName(r: ReliefLevel): string {
  return r === 0 ? 'bajo' : r === 1 ? 'medio' : 'alto';
}
