import { useGameStore } from '../../store/game-store';

/**
 * Pantalla de Noticias / Cronicas del Reino.
 * 3 highlights + lista cronologica de parches.
 */
interface NewsItem {
  id: string;
  emoji: string;
  tag: 'PARCHE' | 'EVENTO' | 'RECOMENDADO' | 'NUEVO';
  title: string;
  excerpt: string;
  body: string;
  date: string;
}

const NEWS: NewsItem[] = [
  {
    id: 'n1',
    emoji: '♛',
    tag: 'NUEVO',
    title: 'Pase de Temporada: Cenit Solar',
    excerpt: '30 niveles, linea premium y aspectos exclusivos.',
    body:
      'La nueva temporada ya esta activa. Subi de nivel jugando partidas para desbloquear monedas, gemas, aspectos y emotes. Mejora a Premium con 499 gemas para duplicar todas las recompensas.',
    date: 'Hoy',
  },
  {
    id: 'n2',
    emoji: '⚔',
    tag: 'PARCHE',
    title: 'Patch 0.1.4 - Ajuste de relieve',
    excerpt: 'Los relieves 2 cuestan 1 energia extra para moverse.',
    body:
      'Cambiamos la regla de movimiento: cuando una pieza intenta subir 2 niveles de relieve, se gasta energia adicional. Eso balancea los emparejamientos largos en mapas de montana.',
    date: 'Hace 2 dias',
  },
  {
    id: 'n3',
    emoji: '🃏',
    tag: 'NUEVO',
    title: '30 cartas a la Forja',
    excerpt: '10 BUFF, 10 TRAMPA, 10 CONDICIONAL listas para combinar.',
    body:
      'La coleccion de cartas iniciales ya esta disponible en la Forja. Algunas tienen efecto condicional que se activa cuando capturas una zona o cuando cae tu Rey.',
    date: 'Hace 5 dias',
  },
  {
    id: 'n4',
    emoji: '👹',
    tag: 'EVENTO',
    title: 'Cacería del Monarca Caído',
    excerpt: 'Completa la region Fortaleza antes del 30 de julio.',
    body:
      'Evento temporal: si completas los 5 nodos de la Fortaleza con 3 estrellas, desbloqueas el aspecto exclusivo "Monarca Ceniza".',
    date: 'Hace 1 semana',
  },
  {
    id: 'n5',
    emoji: '🐎',
    tag: 'RECOMENDADO',
    title: 'Caballero saltador: nuevas jugadas',
    excerpt: 'El movimiento L ahora revela trampas ocultas.',
    body:
      'El Knight ahora destaca visualmente las trampas ocultas al saltar. Es su carta bajo la manga para clavar la zona enemiga sin pisar minas.',
    date: 'Hace 2 semanas',
  },
];

const TAG_COLOR: Record<NewsItem['tag'], string> = {
  PARCHE:      '#3B82F6',
  EVENTO:      '#EF4444',
  RECOMENDADO: '#FFD700',
  NUEVO:       '#A78BFA',
};

export default function NewsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const lead = NEWS[0];
  const rest = NEWS.slice(1);

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">CRÓNICAS DEL REINO</h1>
          <div className="subscreen__stars">
            <span className="subscreen__star-icon">📰</span>
            <span className="subscreen__star-count">{NEWS.length} notas</span>
          </div>
        </div>

        <p className="news__lead">Novedades del reino. Parches, eventos y recomendaciones de juego.</p>

        {/* Lead story */}
        <article className="news-lead">
          <div className="news-lead__emoji">{lead.emoji}</div>
          <div className="news-lead__body">
            <span className="news-lead__tag" style={{ background: TAG_COLOR[lead.tag] }}>
              {lead.tag}
            </span>
            <h2 className="news-lead__title gold-glow">{lead.title}</h2>
            <p className="news-lead__excerpt">{lead.excerpt}</p>
            <p className="news-lead__body-text">{lead.body}</p>
            <div className="news-lead__date">{lead.date}</div>
          </div>
        </article>

        {/* Older items */}
        <div className="news-list">
          {rest.map((it) => (
            <article key={it.id} className="news-item">
              <div className="news-item__emoji">{it.emoji}</div>
              <div className="news-item__body">
                <div className="news-item__top">
                  <span className="news-item__tag" style={{ background: TAG_COLOR[it.tag] }}>
                    {it.tag}
                  </span>
                  <span className="news-item__date">{it.date}</span>
                </div>
                <h3 className="news-item__title">{it.title}</h3>
                <p className="news-item__excerpt">{it.excerpt}</p>
                <details className="news-item__details">
                  <summary>Leer más</summary>
                  <p>{it.body}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
