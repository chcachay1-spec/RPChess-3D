import { useState } from 'react';
import { useGameStore } from '../../store/game-store';
import type { Screen } from '../../store/game-store';

/**
 * Menu principal — replica del original.
 * Estructura visual (de arriba hacia abajo):
 *  1. Top bar: [avatar perfil + nombre + menu cerrar sesion + ES selector + boton audio]
 *  2. Brand header: logo pixel + titulo The Lost Kingdom + subtitulo
 *  3. Botones principales (rejilla tipo original, 7 entradas + CTA inicio rapido)
 *  4. Bottom chips (7 chips + footer v1.0.0 + redes sociales)
 */

interface NavButton {
  label: string;
  screen: Screen;
  variant: 'gold' | 'red' | 'blue' | 'ghost';
  icon: string;
  big?: boolean;
  badge?: string;
  // Bandera visual para identificar la pieza grafica del original
  span?: 'full' | 'half' | 'third';
}

/**
 * Layout inspirado en el menu original:
 *  - Adventure (gold, full, big)
 *  - Kingdom Tactics (blue, full, big)
 *  - PvE + PvP (rojo/azul, half+half, big)
 *  - Bestiary + Cards + Store (gold, third+third+third)
 */
const mainButtons: NavButton[] = [
  { label: 'Adventure', screen: 'campaign', variant: 'gold', icon: '🗺️', big: true, span: 'full' },
  { label: 'Kingdom Tactics', screen: 'mode-select', variant: 'blue', icon: '♞', big: true, badge: '3D', span: 'full' },
  { label: 'PvE', screen: 'pve', variant: 'red', icon: '🛡️', big: true, span: 'half' },
  { label: 'PvP', screen: 'pvp', variant: 'blue', icon: '⚔️', big: true, span: 'half' },
  { label: 'Bestiary', screen: 'bestiary', variant: 'gold', icon: 'ὍC', span: 'third' },
  { label: 'Cards', screen: 'cards', variant: 'gold', icon: 'ἌF', span: 'third' },
  { label: 'Store', screen: 'store', variant: 'gold', icon: 'Ὥ2', span: 'third' },
];

const bottomButtons: NavButton[] = [
  { label: 'Collection', screen: 'collection', variant: 'ghost', icon: 'ὍA' },
  { label: 'Draft', screen: 'draft', variant: 'ghost', icon: 'Ἳ2' },
  { label: 'Profile', screen: 'profile', variant: 'ghost', icon: '὆4' },
  { label: 'News', screen: 'news', variant: 'ghost', icon: '὏0' },
  { label: 'Config', screen: 'config', variant: 'ghost', icon: '⚙️' },
  { label: 'Events', screen: 'events', variant: 'ghost', icon: 'Ὄ5' },
  { label: 'Pase', screen: 'pase', variant: 'ghost', icon: 'Ἴ6' },
];

export default function MainMenu() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [musicOn, setMusicOn] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="menu">
      {/* Gradientes magicos de fondo (mismo lenguaje que 2D) */}
      <div className="menu__aura" />

      {/* Top bar: perfil + idioma + audio */}
      <header className="menu__top">
        <div className="menu__profile">
          <button
            className={`menu__profile-chip ${profileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            title="Perfil"
          >
            <span className="menu__profile-avatar">C</span>
            <span className="menu__profile-name">cris</span>
            <span className="menu__profile-caret">▾</span>
          </button>
          {profileMenuOpen && (
            <div className="menu__profile-dropdown">
              <button
                className="menu__profile-dropdown-item"
                onClick={() => { setProfileMenuOpen(false); setScreen('profile'); }}
              >
                <span>👤</span> Mi Perfil
              </button>
              <button className="menu__profile-dropdown-item">
                <span>📜</span> Mis Tropas
              </button>
              <button className="menu__profile-dropdown-item">
                <span>🏅</span> Historial PvP
              </button>
              <div className="menu__profile-dropdown-sep" />
              <button className="menu__profile-dropdown-item menu__profile-dropdown-item--danger">
                <span>🚪</span> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
        <div className="menu__top-spacer" />
        <button
          className={`menu__langbtn ${language === 'EN' ? 'menu__langbtn--on' : ''}`}
          onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}
          title="Idioma"
        >
          {language}
        </button>
        <button
          className={`menu__iconbtn ${musicOn ? 'menu__iconbtn--on' : ''}`}
          onClick={() => setMusicOn(!musicOn)}
          title="Música"
        >
          {musicOn ? 'ὐA' : 'ὐ7'}
        </button>
      </header>

      {/* Brand header: logo + titulo pixel-art dorado */}
      <div
        className={`menu__logo-wrap ${hoverLogo ? 'is-hover' : ''}`}
        onMouseEnter={() => setHoverLogo(true)}
        onMouseLeave={() => setHoverLogo(false)}
      >
        <div className="menu__logo animate-float">
          <div className="menu__logo-cinzel gold-glow">The Lost Kingdom</div>
          <div className="menu__logo-subtitle">♛ Estrategia · RPG · Hex 3D ♛</div>
        </div>
      </div>

      {/* Botones principales — replica del layout original */}
      <main className="menu__main">
        {/* 1) Adventure full */}
        <button
          className="menu__btn menu__btn--gold menu__btn--big menu__btn--full"
          onClick={() => setScreen('campaign')}
        >
          <span className="menu__btn-icon">{'🗺️'}</span>
          <span className="menu__btn-label">Aventura</span>
        </button>

        {/* 2) Kingdom Tactics full */}
        <button
          className="menu__btn menu__btn--blue menu__btn--big menu__btn--full"
          onClick={() => setScreen('mode-select')}
        >
          <span className="menu__btn-icon">{'♞'}</span>
          <span className="menu__btn-label">Tacticas del Reino</span>
          <span className="menu__btn-badge">3D</span>
        </button>

        {/* 3) PvE + PvP en la misma fila */}
        <div className="menu__row">
          <button
            className="menu__btn menu__btn--red menu__btn--big menu__btn--half"
            onClick={() => setScreen('pve')}
          >
            <span className="menu__btn-icon">{'🛡️'}</span>
            <span className="menu__btn-label">PvE</span>
          </button>
          <button
            className="menu__btn menu__btn--blue menu__btn--big menu__btn--half"
            onClick={() => setScreen('pvp')}
          >
            <span className="menu__btn-icon">{'⚔️}'}</span>
            <span className="menu__btn-label">PvP</span>
          </button>
        </div>

        {/* 4) Bestiary + Cards + Store en una fila */}
        <div className="menu__row">
          {mainButtons.slice(4).map((b) => (
            <button
              key={b.screen}
              className={`menu__btn menu__btn--${b.variant} menu__btn--third`}
              onClick={() => setScreen(b.screen)}
            >
              <span className="menu__btn-icon">{b.icon}</span>
              <span className="menu__btn-label">{b.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom nav: chips + auth */}
      <footer className="menu__bottom">
        <div className="menu__bottom-row">
          {bottomButtons.map((b) => (
            <button
              key={b.screen}
              className="menu__chip"
              onClick={() => setScreen(b.screen)}
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </button>
          ))}
        </div>
        <div className="menu__auth">
          <button className="menu__btn menu__btn--gold menu__btn--auth">Sign In</button>
          <button className="menu__btn menu__btn--red menu__btn--auth">Sign Up</button>
        </div>
        <div className="menu__footer-meta">
          <span className="menu__version">v1.0.0</span>
          <div className="menu__socials">
            <button className="menu__social" title="Discord">🟪</button>
            <button className="menu__social" title="Twitter">🟴</button>
            <button className="menu__social" title="YouTube">🔴</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
