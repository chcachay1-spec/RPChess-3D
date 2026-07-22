import { useMemo, useState } from 'react';
import { useGameStore } from '../../store/game-store';
import { SHOP_ITEMS, WALLET, type ShopCategory, type ItemRarity } from '../../data/shop';

type CategoryKey = 'all' | ShopCategory;

const CATEGORIES: { key: CategoryKey; label: string; emoji: string }[] = [
  { key: 'all',     label: 'Todo',     emoji: '✦' },
  { key: 'ASPECTO', label: 'Aspectos', emoji: '♛' },
  { key: 'TABLERO', label: 'Tableros', emoji: '⬡' },
  { key: 'OBJETO',  label: 'Objetos',  emoji: '◆' },
  { key: 'EMOTE',   label: 'Emotes',   emoji: '✦' },
];

const RARITY_COLOR: Record<ItemRarity, string> = {
  Raro:       '#3B82F6',
  Epico:      '#A78BFA',
  Legendario: '#FFD700',
};

export default function StoreScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [cat, setCat] = useState<CategoryKey>('all');
  const [wallet, setWallet] = useState(WALLET);
  const [owned, setOwned] = useState<Record<string, boolean>>({
    's-a08': true,
    's-e01': true,
  });

  const filtered = useMemo(() => {
    return SHOP_ITEMS.filter((it) => cat === 'all' || it.category === cat);
  }, [cat]);

  const tryBuy = (id: string) => {
    const it = SHOP_ITEMS.find((x) => x.id === id);
    if (!it || owned[id]) return;
    if (it.priceGold !== undefined && wallet.gold < it.priceGold) return;
    if (it.priceGem !== undefined && wallet.gems < it.priceGem) return;
    setWallet((w) => ({
      gold: w.gold - (it.priceGold ?? 0),
      gems: w.gems - (it.priceGem ?? 0),
    }));
    setOwned((p) => ({ ...p, [id]: true }));
  };

  return (
    <div className="subscreen">
      <div className="subscreen__panel">
        <div className="subscreen__header subscreen__header--gold">
          <button className="subscreen__back" onClick={() => setScreen('menu')}>
            <span className="subscreen__back-arrow">←</span>
            <span className="subscreen__back-label">Menu</span>
          </button>
          <h1 className="subscreen__title gold-glow">TIENDA</h1>
          <div className="subscreen__stars" style={{ gap: 14 }}>
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: '#FFD700' }}>◈</span>
              {wallet.gold.toLocaleString()}
            </span>
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: '#A78BFA' }}>◆</span>
              {wallet.gems}
            </span>
          </div>
        </div>

        <p className="store__lead">
          Cosmeticos, packs y moneda premium. Todo lo que compres se guarda en tu coleccion.
        </p>

        {/* Categorias */}
        <div className="store__cats">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`store__cat ${cat === c.key ? 'is-active' : ''}`}
              onClick={() => setCat(c.key)}
            >
              <span className="store__cat-emoji">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid de items */}
        <div className="store__grid">
          {filtered.map((it) => {
            const rarityColor = RARITY_COLOR[it.rarity];
            const isOwned = owned[it.id];
            const cantAffordGold  = it.priceGold !== undefined && wallet.gold  < it.priceGold;
            const cantAffordGem   = it.priceGem  !== undefined && wallet.gems  < it.priceGem;
            return (
              <article
                key={it.id}
                className={`item ${isOwned ? 'is-owned' : ''}`}
                style={{ ['--item-rarity' as any]: rarityColor }}
              >
                <div className="item__preview" style={{ background: rarityColor + '22' }}>
                  <span className="item__emoji">{it.emoji}</span>
                  <span className="item__category">{it.category}</span>
                  <span className="item__rarity" style={{ background: rarityColor, color: '#1a1100' }}>
                    {it.rarity}
                  </span>
                </div>
                <div className="item__body">
                  <h3 className="item__name">{it.name}</h3>
                  <p className="item__desc">{it.description}</p>
                  <div className="item__footer">
                    <div className="item__prices">
                      {it.priceGold !== undefined && (
                        <span className="item__price item__price--gold">
                          ◈ {it.priceGold.toLocaleString()}
                        </span>
                      )}
                      {it.priceGem !== undefined && (
                        <span className="item__price item__price--gem">
                          ◆ {it.priceGem}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`item__cta ${isOwned ? 'is-owned-cta' : ''}`}
                      onClick={() => tryBuy(it.id)}
                      disabled={isOwned || cantAffordGold || cantAffordGem}
                    >
                      {isOwned ? '✓ Comprado' : (cantAffordGold || cantAffordGem) ? '✗ Sin saldo' : 'Comprar'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
