/* ─── Clothing listing page ─────────────────────────────────────
   Plain, minimal, client-side filter + sort. Standalone page (own nav, own
   stylesheet: clothing.css). The bag lives in localStorage so the home page
   cart (app.jsx) picks up whatever is added here — "View bag" → /#bag. */
const BAG_KEY = "ilmano-bag-v1";
const readBag = () => { try { return JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch (e) { return []; } };
const writeBag = (items) => { try { localStorage.setItem(BAG_KEY, JSON.stringify(items)); } catch (e) {} };

const I = ({ n, s = 20 }) => {
  const c = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
              strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  switch (n) {
    case "bag": return <svg {...c}><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>;
    case "heart": return <svg {...c}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case "heart-on": return <svg {...c} fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case "sliders": return <svg {...c}><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>;
    case "plus": return <svg {...c}><path d="M12 5v14M5 12h14"/></svg>;
    case "close": return <svg {...c}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    default: return null;
  }
};

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "asc", label: "Price ↑" },
  { id: "desc", label: "Price ↓" },
];
const fmt = (n) => "$" + n.toLocaleString("en-US");

const ClothingPage = () => {
  const data = window.IL_MANO_DATA;
  const [cat, setCat] = React.useState("all");
  const [sortIx, setSortIx] = React.useState(0);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [sizeFilter, setSizeFilter] = React.useState(null);
  const [bag, setBag] = React.useState(readBag);
  const [wish, setWish] = React.useState(() => new Set());
  const [colors, setColors] = React.useState({});      // productId → active colorId
  const [toast, setToast] = React.useState(null);
  const [sheet, setSheet] = React.useState(null);      // product whose size sheet is open (touch)
  const toastTimer = React.useRef(0);

  const count = bag.reduce((t, i) => t + i.qty, 0);
  const cats = [{ key: "all", name: "All" }, ...data.categories];

  const allSizes = [];
  data.products.forEach(p => p.sizes.forEach(sz => { if (sz.id !== "os" && !allSizes.includes(sz.id)) allSizes.push(sz.id); }));
  let list = data.products.filter(p => cat === "all" || p.categoryKey === cat);
  if (sizeFilter) list = list.filter(p => p.sizes.some(s => s.id === sizeFilter && !s.soldOut));
  if (SORTS[sortIx].id === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (SORTS[sortIx].id === "desc") list = [...list].sort((a, b) => b.price - a.price);

  const addToBag = (product, size) => {
    const colorId = colors[product.id] || product.defaultColor;
    const lineId = `${product.id}-${colorId}-${size.id}`;
    setBag(prev => {
      const next = prev.find(i => i.lineId === lineId)
        ? prev.map(i => i.lineId === lineId ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { lineId, productId: product.id, colorId, sizeId: size.id, sizeLabel: size.label, price: product.price, qty: 1 }];
      writeBag(next);
      return next;
    });
    setSheet(null);
    setToast(`${product.name} · ${size.label}`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const toggleWish = (id) => setWish(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <>
      <nav className="c-nav">
        <div className="c-nav__l">
          <a href="/clothing" className="is-current">Clothing</a>
          <a href="/gallery">Gallery</a>
          <a href="/our-story">Our Story</a>
        </div>
        <a href="/" className="c-nav__mark">IL MANO</a>
        <div className="c-nav__r">
          <a href="/#bag" className="c-icon" aria-label={`Bag, ${count} items`}>
            <I n="bag" s={22} />
            {count > 0 && <span className="c-badge">{count}</span>}
          </a>
        </div>
      </nav>

      <header className="c-head">
        <h1>CLOTHING</h1>
        <div className="c-chips" role="tablist">
          {cats.map(c => (
            <button key={c.key} role="tab" aria-selected={cat === c.key}
                    className={"c-chip" + (cat === c.key ? " is-on" : "")}
                    onClick={() => setCat(c.key)}>{c.name}</button>
          ))}
        </div>
      </header>

      <div className="c-bar">
        <button className="c-bar__filters" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(v => !v)}>
          <I n="sliders" s={18} /> <span>Filters{sizeFilter ? " (1)" : ""}</span>
        </button>
        <div className="c-bar__count">{list.length} {list.length === 1 ? "Piece" : "Pieces"}</div>
        <button className="c-bar__sort" onClick={() => setSortIx((sortIx + 1) % SORTS.length)}>
          Sort by <b>{SORTS[sortIx].label}</b>
        </button>
      </div>
      {filtersOpen && (
        <div className="c-filters">
          <span>Size</span>
          {allSizes.map(sz => (
            <button key={sz} className={"c-chip c-chip--sm" + (sizeFilter === sz ? " is-on" : "")}
                    onClick={() => setSizeFilter(sizeFilter === sz ? null : sz)}>{sz.toUpperCase()}</button>
          ))}
          {sizeFilter && <button className="c-filters__clear" onClick={() => setSizeFilter(null)}>Clear</button>}
        </div>
      )}

      {list.length === 0 ? (
        <p className="c-empty">Nothing here yet — <button onClick={() => { setCat("all"); setSizeFilter(null); }}>view all pieces</button></p>
      ) : (
        <ul className="c-grid">
          {list.map(p => {
            const colorId = colors[p.id] || p.defaultColor;
            const color = p.colors.find(c => c.id === colorId) || p.colors[0];
            const one = p.sizes.length === 1;
            return (
              <li className="c-card" key={p.id}>
                <div className="c-card__media">
                  <img src={color.cutout || color.front} alt={`${p.name} — ${color.name}`} loading="lazy"
                       className={color.cutout ? "is-cutout" : p.categoryKey === "hoodies" ? "is-studio" : ""} />
                  {p.badge && <span className="c-tag">{p.badge}</span>}
                  <button className="c-heart" aria-label={wish.has(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                          aria-pressed={wish.has(p.id)} onClick={() => toggleWish(p.id)}>
                    <I n={wish.has(p.id) ? "heart-on" : "heart"} s={18} />
                  </button>
                  <div className="c-sizes">
                    {one ? (
                      <button className="c-sizes__one" onClick={() => addToBag(p, p.sizes[0])}>Add to bag <I n="plus" s={14} /></button>
                    ) : p.sizes.map(s => (
                      <button key={s.id} disabled={s.soldOut} onClick={() => addToBag(p, s)}>{s.label}</button>
                    ))}
                  </div>
                  <button className="c-plus" aria-label={`Add ${p.name} to bag`}
                          onClick={() => one ? addToBag(p, p.sizes[0]) : setSheet(p)}>
                    <I n="plus" s={20} />
                  </button>
                </div>
                <div className="c-card__info">
                  <h3>{p.name}</h3>
                  <div className="c-card__price">{fmt(p.price)}</div>
                  {p.colors.length > 1 && (
                    <div className="c-swatches" role="radiogroup" aria-label="Colour">
                      {p.colors.map(c => (
                        <button key={c.id} role="radio" aria-checked={c.id === color.id} aria-label={c.name} title={c.name}
                                className={"c-swatch" + (c.id === color.id ? " is-on" : "")}
                                onClick={() => setColors(prev => ({ ...prev, [p.id]: c.id }))}>
                          <i style={{ background: c.hex }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {sheet && (
        <div className="c-sheet" role="dialog" aria-label="Select size" onClick={() => setSheet(null)}>
          <div className="c-sheet__panel" onClick={e => e.stopPropagation()}>
            <div className="c-sheet__head">
              <span>{sheet.name} — select size</span>
              <button aria-label="Close" onClick={() => setSheet(null)}><I n="close" s={20} /></button>
            </div>
            <div className="c-sheet__sizes">
              {sheet.sizes.map(s => (
                <button key={s.id} disabled={s.soldOut} onClick={() => addToBag(sheet, s)}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={"c-toast" + (toast ? " is-on" : "")} role="status" aria-live="polite">
        <span>Added to bag · {toast}</span>
        <a href="/#bag">View bag</a>
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<ClothingPage />);
