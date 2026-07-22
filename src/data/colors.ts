/**
 * Paleta de colores del proyecto.
 * Decididos en el PRD (sección 10) y validados por el usuario.
 */

import type { ReliefLevel, Team } from '../types/hex';

export const RELIEF_COLORS: Record<ReliefLevel, string> = {
  0: '#2563EB', // azul — bajo
  1: '#16A34A', // verde — medio
  2: '#DC2626', // rojo — alto
};

export const RELIEF_NAMES: Record<ReliefLevel, string> = {
  0: 'Bajo (azul)',
  1: 'Medio (verde)',
  2: 'Alto (rojo)',
};

export const TEAM_COLORS: Record<Team, string> = {
  ally: '#3B82F6',
  enemy: '#EF4444',
};

export const TEAM_ACCENT: Record<Team, string> = {
  ally: '#60A5FA',
  enemy: '#F87171',
};

export const UI_VALID = '#10B981';
export const UI_INVALID = '#6B7280';
