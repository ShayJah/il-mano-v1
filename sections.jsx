/* ─── Page Loader ──────────────────────────────────────────── */
const PageLoader = ({ onDone }) => {
  const [exiting, setExiting] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setExiting(true), 1600);
    const t2 = setTimeout(() => onDone && onDone(), 2550);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);
  return (
    <div className={"page-loader" + (exiting ? " exiting" : "")}>
      <div className="page-loader__inner">
        <IlManoMark height={32} color="#f5f4f0" />
        <div className="page-loader__bar"></div>
        <div className="page-loader__meta">
          <span>Summer 2026</span>
          <span>Los Angeles</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Nav ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/#collection", label: "Clothing" },
  { href: "/#story", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
];

const Nav = ({ cartCount, onOpenCart, transparent }) => {
  const y = useScrollY();
  const scrolled = y > 60;
  const solid = !transparent;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav className={"nav" + (scrolled ? " scrolled" : "") + (solid ? " solid" : "")}>
        <div className="nav__group nav__group--left">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav__link">{l.label}</a>
          ))}
        </div>
        <a href="/" className="nav__wordmark" data-screen-label="01 Home">IL MANO</a>
        <div className="nav__group nav__group--right">
          <a href="#" className="nav__link" onClick={(e)=>{e.preventDefault(); onOpenCart();}}>
            <Icon name="bag" size={14}/> Bag <span className="nav__bag-count">({String(cartCount).padStart(2,"0")})</span>
          </a>
          <button className="nav__burger" aria-label="Menu" aria-expanded={drawerOpen}
                  onClick={() => setDrawerOpen(v => !v)}>
            <span/><span/>
          </button>
        </div>
      </nav>

      <div className={"nav-drawer" + (drawerOpen ? " is-open" : "")}>
        <div className="nav-drawer__links">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</a>
          ))}
        </div>
        <div className="nav-drawer__foot">
          <a href="/shipping-returns" onClick={() => setDrawerOpen(false)}>Shipping &amp; Returns</a>
          <a href="/terms" onClick={() => setDrawerOpen(false)}>Terms</a>
          <a href="/privacy" onClick={() => setDrawerOpen(false)}>Privacy</a>
        </div>
      </div>
    </>
  );
};

/* ─── Hero ─────────────────────────────────────────────────── */
const Hero = () => {
  return (
    <section className="hero" data-screen-label="Hero">
      <div className="hero__media">
        <img src="assets/hero-palms.jpg" alt="Summer 2026 — California iconography" />
      </div>
      <div className="hero__veil" />
      <div className="hero__inner">
        <div className="hero__top">
          <span>Summer · 2026 · Volume 01</span>
          <span>Los Angeles · 34.05° N</span>
        </div>
        <div className="hero__bottom">
          <h1 className="hero__title">
            <span className="line"><span>American</span></span>
            <span className="line"><span><em>Iconography.</em></span></span>
          </h1>
          <div className="hero__meta">
            <p>A dialogue between American iconography and modern tailoring — reimagined archetypes for a life with many dimensions.</p>
            <a href="#collection" className="hero__cta" data-magnet>
              Shop the Collection
              <span className="arrow"><Icon name="arrow-right" size={14}/></span>
            </a>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
};

/* ─── Marquee strip ────────────────────────────────────────── */
const Marquee = ({ items }) => {
  const trackRef = React.useRef(null);
  const xRef = React.useRef(0);
  const velRef = React.useRef(0.5);
  const lastScrollRef = React.useRef(0);

  React.useEffect(() => {
    let raf;
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollRef.current);
      lastScrollRef.current = window.scrollY;
      velRef.current = Math.min(2.8, 0.5 + dy * 0.04);
    };
    const tick = () => {
      const el = trackRef.current;
      if (el) {
        xRef.current -= velRef.current;
        const half = el.scrollWidth / 2;
        if (-xRef.current >= half) xRef.current += half;
        el.style.transform = `translateX(${xRef.current}px)`;
        velRef.current = velRef.current * 0.93 + 0.5 * 0.07;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const doubled = [...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track" ref={trackRef}>
        {doubled.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Categories ───────────────────────────────────────────── */
const Categories = ({ categories, onPickCategory }) => {
  const ref = useReveal();
  // Layout: first two large/medium, next three small (12-col)
  const layoutCols = (i, len) => {
    if (i === 0) return "lg"; // span 7
    if (i === 1) return "md"; // span 5
    return "sm"; // span 4 (three across)
  };
  return (
    <section className="section categories reveal" ref={ref} data-screen-label="Categories">
      <header className="section__head">
        <div>
          <div className="section__index">Index 01 · Categories</div>
          <h2 className="section__title">The <em>archetypes</em> of summer.</h2>
        </div>
        <a href="#collection" className="section__action">Browse all <Icon name="arrow-up-right" size={12}/></a>
      </header>
      <div className="categories__grid">
        {categories.map((c, i) => (
          <div className={"cat cat--" + layoutCols(i, categories.length)} key={c.name}
               onClick={() => onPickCategory && onPickCategory(c)}>
            <img className="cat__img" src={c.img} alt={c.name} loading="lazy" />
            <div className="cat__overlay" />
            <div className="cat__arrow"><Icon name="arrow-up-right" size={14}/></div>
            <div className="cat__label">
              <div className="cat__num">— {c.num}</div>
              <div className="cat__name">{c.name}</div>
            </div>
            <div className="cat__count">{c.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Product card (used by Collection) ────────────────────── */
const ProductCard = ({ entry, products, onOpen, onQuickAdd, wishlist, toggleWish }) => {
  const product = products.find(p => p.id === entry.productId);
  const [colorId, setColorId] = React.useState(entry.colorId || product.defaultColor);
  const color = product.colors.find(c => c.id === colorId) || product.colors[0];
  const overrideImg = entry.overrideImg;
  const isWished = wishlist.has(product.id + ":" + colorId);

  const cardRef = React.useRef(null);

  const onQuickAddClick = (e) => {
    e.stopPropagation();
    onQuickAdd(product, colorId, cardRef.current);
  };

  return (
    <div className="card" ref={cardRef} onClick={() => onOpen(product, colorId)}>
      <div className="card__media">
        {entry.badge && <div className="card__badge">{entry.badge}</div>}
        <button className={"card__wishlist" + (isWished ? " is-active" : "")}
                onClick={(e)=>{e.stopPropagation(); toggleWish(product.id + ":" + colorId);}}
                aria-label="Wishlist">
          <Icon name={isWished ? "heart-filled" : "heart"} size={14}/>
        </button>
        <img className="is-primary" src={overrideImg || color.front} alt={product.name} loading="lazy" />
        <img className="is-secondary" src={overrideImg || color.back} alt="" loading="lazy" />
        <button className="card__quickadd" onClick={onQuickAddClick}>
          Quick Add <Icon name="plus" size={12}/>
        </button>
      </div>
      <div className="card__info">
        <span className="card__name">{entry.overrideName || product.name}</span>
        <span className="card__price">{fmtPrice(entry.overridePrice || product.price)}</span>
        <div className="card__sub">
          {entry.overrideSub || `${product.colors.length} ${product.colors.length === 1 ? "colour" : "colours"}`}
          <span>·</span>
          <span>{product.category}</span>
        </div>
        {product.colors.length > 1 && (
          <div className="card__swatches" onClick={(e)=>e.stopPropagation()}>
            {product.colors.map(c => (
              <div key={c.id}
                   className={"swatch-dot" + (c.id === colorId ? " is-active" : "")}
                   style={{ background: c.hex }}
                   title={c.name}
                   onClick={() => setColorId(c.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Collection ───────────────────────────────────────────── */
const Collection = ({ data, onOpen, onQuickAdd, wishlist, toggleWish }) => {
  const ref = useReveal();
  const [filter, setFilter] = React.useState("all");
  const filters = [
    { id: "all", label: "All Pieces" },
    { id: "hoodies", label: "Hoodies" },
    { id: "hats", label: "Hats" },
    { id: "bags", label: "Bags" },
  ];
  const cards = data.gridCards.filter(c => {
    if (filter === "all") return true;
    const p = data.findProduct(c.productId);
    return p.categoryKey === filter;
  });
  return (
    <section className="section collection reveal" ref={ref} id="collection" data-screen-label="Collection">
      <header className="section__head">
        <div>
          <div className="section__index">Index 02 · Summer 26 Drop</div>
          <h2 className="section__title">The <em>collection.</em></h2>
        </div>
        <div className="collection__controls">
          {filters.map(f => (
            <button key={f.id}
                    className={"chip" + (filter === f.id ? " is-active" : "")}
                    onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </header>
      <div className="product-grid">
        {cards.map((c, i) => (
          <ProductCard key={i} entry={c} products={data.products}
                       onOpen={onOpen} onQuickAdd={onQuickAdd}
                       wishlist={wishlist} toggleWish={toggleWish} />
        ))}
      </div>
    </section>
  );
};

/* ─── Lookbook ─────────────────────────────────────────────── */
const Lookbook = () => {
  const ref = useReveal();
  const mediaRef = React.useRef(null);

  React.useEffect(() => {
    const el = mediaRef.current?.querySelector("img");
    if (!el) return;
    const onScroll = () => {
      const rect = mediaRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = (clamped - 0.5) * 80;
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="section lookbook reveal" ref={ref} data-screen-label="Lookbook">
      <div className="lookbook__inner">
        <div className="lookbook__media" ref={mediaRef}>
          <img src="assets/lifestyle-bag-hoodie.png" alt="The Field Set — hoodie & duffle on location" loading="lazy" />
        </div>
        <aside className="lookbook__copy">
          <div className="section__index">Index 03 · Editorial</div>
          <p className="lookbook__quote">"<em>Dust on the leather. Sun on the cotton. A wardrobe that ages with the road.</em>"</p>
          <p className="lookbook__body">
            Shot on a single morning between Joshua Tree and Pioneertown — no stylist, no retouch.
            The Heritage Duffle and Tobacco Hoodie photographed where they belong: outside.
          </p>
          <div className="lookbook__stat">
            <div>
              <div className="lookbook__stat-val">12</div>
              <div className="lookbook__stat-lbl">pieces in drop</div>
            </div>
            <div>
              <div className="lookbook__stat-val">100<span style={{fontSize:'0.5em', verticalAlign:'super'}}>%</span></div>
              <div className="lookbook__stat-lbl">Made in LA</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

/* ─── Story / Manifesto ────────────────────────────────────── */
const Story = ({ pillars }) => {
  const containerRef = React.useRef(null);
  // Word-by-word reveal as user scrolls into the statement
  React.useEffect(() => {
    const wordEls = containerRef.current?.querySelectorAll(".word");
    if (!wordEls) return;
    const onScroll = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const progress = (window.innerHeight * 0.85 - rect.top) / (window.innerHeight * 0.6);
      const total = wordEls.length;
      const lit = Math.max(0, Math.min(total, Math.round(progress * total)));
      wordEls.forEach((el, i) => {
        el.classList.toggle("is-lit", i < lit);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const statement = "We carve garments like leather — tested by use, refined by wear, and made to outlast the trend cycle.";
  const words = statement.split(" ");

  return (
    <section className="story" id="story" ref={containerRef} data-screen-label="Story">
      <div className="story__eyebrow">— Manifesto · Connect · Create · Inspire</div>
      <h2 className="story__statement editorial">
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className="word">{w}</span>{" "}
          </React.Fragment>
        ))}
      </h2>
      <div className="story__footer">
        {pillars.map(p => (
          <div className="story__pillar" key={p.title}>
            <h4>— {p.title}</h4>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Footer ───────────────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [subbed, setSubbed] = React.useState(false);
  return (
    <footer className="footer">
      <div className="footer__megabrand">IL MANO</div>
      <div className="footer__grid">
        <div className="footer__col">
          <p className="footer__tagline"><em>A dialogue between American iconography and modern tailoring.</em></p>
          <div className="newsletter">
            <input type="email" placeholder="Your email address"
                   value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button onClick={()=> email && setSubbed(true)}>
              {subbed ? "Joined ✓" : "Subscribe →"}
            </button>
          </div>
        </div>
        <div className="footer__col">
          <h5>— Brand</h5>
          <ul>
            <li><a href="/#story">Our Story</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/code-of-conduct">Code of Conduct</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>— Support</h5>
          <ul>
            <li><a href="/shipping-returns">Shipping</a></li>
            <li><a href="/shipping-returns#returns">Returns</a></li>
            <li><a href="/faq#sizing">Size Guide</a></li>
            <li><a href="mailto:hello@ilmano.com">Contact</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>— Region</h5>
          <ul>
            <li><Icon name="globe" size={12}/> United States · USD</li>
          </ul>
        </div>
      </div>
      <div className="footer__legal">
        <div>© {new Date().getFullYear()} IL MANO · Manufactured in Los Angeles</div>
        <div className="footer__legal-group">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/code-of-conduct">Code of Conduct</a>
        </div>
      </div>
    </footer>
  );
};

Object.assign(window, {
  PageLoader, Nav, Hero, Marquee, Categories,
  ProductCard, Collection, Lookbook, Story, Footer,
});
