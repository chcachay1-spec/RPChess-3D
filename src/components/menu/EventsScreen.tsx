import { useGameStore } from '../../store/game-store';

interface EventItem {
  id: string;
  emoji: string;
  accent: string;
  name: string;
  dates: string;
  daysLeft: number;
  status: 'activo' | 'proximo' | 'terminado';
  description: string;
  rewards: string[];
}

const EVENTS: EventItem[] = [
  {
    id: 'e1',
    emoji: '🌸',
    accent: '#22C55E',
    name: 'Renacer de Primavera',
    dates: '01 mar - 14 mar',
    daysLeft: 0,
    status: 'terminado',
    description: 'Los tableros florecen con efectos de polen. Doble XP para tropas.',
    rewards: ['+50% XP tropas', 'Aspecto Broche de Primavera'],
  },
  {
    id: 'e2',
    emoji: '☀',
    accent: '#FFD700',
    name: 'Cénit Solar',
    dates: '15 jun - 15 sep',
    daysLeft: 55,
    status: 'activo',
    description: 'El reino está en su mejor momento. Subí de nivel en el Pase y desbloqueá la Forjador Dorada.',
    rewards: ['Pase de Temporada gratis', 'Skin Forjador Dorada al nivel 30'],
  },
  {
    id: 'e3',
    emoji: '🍂',
    accent: '#A78BFA',
    name: 'Víspera de Sombras',
    dates: '01 oct - 31 oct',
    daysLeft: 102,
    status: 'proximo',
    description: 'Los heroes de Oscuridad se potencian. Los mejores arqueros estan de vuelta.',
    rewards: ['Trofeo de Sombras', 'Acceso anticipado a Nigromante'],
  },
  {
    id: 'e4',
    emoji: '❄',
    accent: '#3B82F6',
    name: 'Noche de Hielo',
    dates: '15 dic - 05 ene',
    daysLeft: 177,
    status: 'proximo',
    description: 'El tablero se congela cada turno. Cartas de fuego valen el doble.',
    rewards: ['Tablero Escarcha Eterna', 'Aspecto Helada Cristal'],
  },
];

const STATUS_COLOR: Record<EventItem['status'], string> = {
  activo:    '#22C55E',
  proximo:   '#A78BFA',
  terminado: '#6B7280',
};

const STATUS_LABEL: Record<EventItem['status'], string> = {
  activo:    'Activo',
  proximo:   'Próximo',
  terminado: 'Terminado',
};

export default function EventsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const active = EVENTS.find((e) => e.status === 'activo');
  const featured = active ?? EVENTS[0];
  const others = EVENTS.filter((e) => e.id !== featured.id);

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">EVENTOS</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">📅</span>
            <span className="subscreen__star-count">{EVENTS.filter(e => e.status === 'activo').length} activos</span>
          </div>
        </div>

        <p className="events__lead">Eventos activos y próximos. No te quedes sin reclamar.</p>

        {/* Featured */}
        <article className="event-featured" style={{ ['--event-color' as any]: featured.accent }}>
          <div className="event-featured__top">
            <div className="event-featured__emoji">{featured.emoji}</div>
            <div className="event-featured__meta">
              <span className="event-featured__status" style={{ background: STATUS_COLOR[featured.status] }}>
                {STATUS_LABEL[featured.status]}
              </span>
              <span className="event-featured__dates">{featured.dates}</span>
            </div>
          </div>
          <h2 className="event-featured__name gold-glow">{featured.name}</h2>
          <p className="event-featured__desc">{featured.description}</p>
          <div className="event-featured__rewards">
            <div className="event-featured__rewards-title">Recompensas</div>
            <ul className="event-featured__rewards-list">
              {featured.rewards.map((r, i) => <li key={i}>★ {r}</li>)}
            </ul>
          </div>
          <div className="event-featured__cta">
            {featured.status === 'activo'    && <button className="menu__btn menu__btn--gold menu__btn--auth">▶ Ir al Evento</button>}
            {featured.status === 'proximo'   && <button className="menu__btn menu__btn--blue menu__btn--auth">📅 Recordármelo</button>}
            {featured.status === 'terminado' && <button className="menu__btn menu__btn--gold menu__btn--auth">📜 Ver Recap</button>}
            <span className="event-featured__countdown">
              {featured.status === 'terminado'
                ? 'Finalizado hace poco'
                : featured.daysLeft <= 7
                  ? `Faltan ${featured.daysLeft} días`
                  : `Próximamente`}
            </span>
          </div>
        </article>

        {/* Others */}
        <section className="events-list">
          <h3 className="events-list__title gold-glow">Calendario Anual</h3>
          <div className="events-list__grid">
            {others.map((e) => (
              <article
                key={e.id}
                className="event-card"
                style={{ ['--event-color' as any]: e.accent }}
              >
                <div className="event-card__emoji">{e.emoji}</div>
                <div className="event-card__body">
                  <h4 className="event-card__name">{e.name}</h4>
                  <div className="event-card__dates">{e.dates}</div>
                  <span className="event-card__status" style={{ background: STATUS_COLOR[e.status] }}>
                    {STATUS_LABEL[e.status]}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
