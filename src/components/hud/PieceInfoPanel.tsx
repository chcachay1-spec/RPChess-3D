import { useGameStore } from '../../store/game-store';
import { HEROES } from '../../data/heroes';

export default function PieceInfoPanel() {
  const selectedId = useGameStore((s) => s.selectedPieceId);
  const pieces = useGameStore((s) => s.pieces);
  const moveCount = useGameStore((s) => s.validMoves.length);

  const piece = pieces.find((p) => p.id === selectedId);
  if (!piece || !piece.position) return null;

  const heroInfo = HEROES.find((h) => h.role === piece.role);

  const tierColor = (tier: number): string => {
    if (tier >= 5) return '#FFD700';
    if (tier >= 4) return '#A78BFA';
    if (tier >= 3) return '#3B82F6';
    return '#9CA3AF';
  };
  const tierLabel = (tier: number): string => {
    if (tier >= 5) return 'S-Tier';
    if (tier >= 4) return 'A-Tier';
    if (tier >= 3) return 'B-Tier';
    return 'C-Tier';
  };

  const teamLabel = piece.team === 'ally' ? 'Tu pieza' : 'Enemigo';
  const teamColor = piece.team === 'ally' ? '#3B82F6' : '#EF4444';

  return (
    <div className="pinfo">
      <div className="pinfo__header">
        <div
          className="pinfo__portrait"
          style={{ background: (heroInfo?.color ?? '#888') + '22', color: heroInfo?.color ?? '#FFF' }}
        >
          <span className="pinfo__emoji">{heroInfo?.emoji ?? '♞'}</span>
        </div>
        <div className="pinfo__header-info">
          <div className="pinfo__team" style={{ color: teamColor }}>
            {teamLabel}
          </div>
          <h3 className="pinfo__name gold-glow">{heroInfo?.name ?? piece.role}</h3>
          <div className="pinfo__title">{heroInfo?.title ?? ''}</div>
          <div className="pinfo__tier" style={{ background: tierColor(heroInfo?.tier ?? 1) }}>
            {tierLabel(heroInfo?.tier ?? 1)}
          </div>
        </div>
      </div>

      <div className="pinfo__stats">
        <div className="pinfo__hp">
          <div className="pinfo__hp-label">
            <span className="pinfo__hp-icon">♥</span>
            <span>HP</span>
          </div>
          <div className="pinfo__hp-bar">
            <div
              className="pinfo__hp-fill"
              style={{
                width: (piece.hp / 5) * 100 + '%',
                background: piece.hp > 3 ? '#22C55E' : piece.hp > 1 ? '#FFD700' : '#EF4444',
              }}
            />
          </div>
          <div className="pinfo__hp-value">{piece.hp} / 5</div>
        </div>

        <div className="pinfo__stat-row">
          <div className="pinfo__stat">
            <div className="pinfo__stat-icon">👣</div>
            <div className="pinfo__stat-name">Movimiento</div>
            <div className="pinfo__stat-value">{movementRange(piece.role)}</div>
          </div>
          <div className="pinfo__stat">
            <div className="pinfo__stat-icon">⚔</div>
            <div className="pinfo__stat-name">Ataque</div>
            <div className="pinfo__stat-value">{attackRange(piece.role)}</div>
          </div>
        </div>
      </div>

      {piece.team === 'ally' && moveCount > 0 && (
        <div className="pinfo__hint">
          <strong>{moveCount}</strong> movimientos disponibles
        </div>
      )}

      {heroInfo?.lore && (
        <p className="pinfo__lore">{heroInfo.lore}</p>
      )}
    </div>
  );
}

function movementRange(role: string): string {
  switch (role) {
    case 'king':   return '1 hex';
    case 'queen':  return 'L/D';
    case 'rook':   return 'L';
    case 'bishop': return 'D';
    case 'knight': return 'L shape';
    case 'pawn':   return '1 adyacente';
    default:       return '-';
  }
}

function attackRange(role: string): string {
  switch (role) {
    case 'king':   return 'Adyacente';
    case 'queen':  return 'L o D';
    case 'rook':   return 'L';
    case 'bishop': return 'D';
    case 'knight': return 'L shape';
    case 'pawn':   return 'Adyacente';
    default:       return '-';
  }
}
