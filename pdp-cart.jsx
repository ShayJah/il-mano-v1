/* ─── PDP — Product Detail Page (overlay) ──────────────────── */
const PDP = ({ state, onClose, onAdd, products }) => {
  const open = !!state;
  const product = state?.product;
  const [colorId, setColorId] = React.useState(state?.colorId || "");
  const [activeImg, setActiveImg] = React.useState(0);
  const [sizeId, setSizeId] = React.useState("");
  const [openAcc, setOpenAcc] = React.useState({ details: true, care: false, delivery: false });
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    if (state) {
      setColorId(state.colorId || product.defaultColor);
      setActiveImg(0);
      const firstAvail = product.sizes.find(s => !s.soldOut);
      setSizeId(firstAvail?.id || "");
      setOpenAcc({ details: true, care: false, delivery: false });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [state]);

  if (!product) return <div className="pdp" />;
  const color = product.colors.find(c => c.id === colorId) || product.colors[0];
  const imgs = [color.front, color.back, ...product.colors.filter(c=>c.id!==colorId).map(c=>c.front)].slice(0,4);

  const onAddClick = () => {
    if (!sizeId || adding) return;
    setAdding(true);
    onAdd(product, colorId, sizeId);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <div className={"pdp" + (open ? " is-open" : "")} role="dialog" aria-modal="true">
      <button className="pdp__back" onClick={onClose}>
        <Icon name="arrow-right" size={14} stroke={1.6}/>
        <span style={{transform:'rotate(180deg)', display:'inline-block', marginRight: 2}}></span>
        Return to Collection
      </button>
      <button className="pdp__close" onClick={onClose} aria-label="Close">
        <Icon name="close" size={16}/>
      </button>

      <div className="pdp__grid">
        <div className="pdp__gallery">
          <div className="pdp__main-img">
            <img src={imgs[activeImg]} alt={product.name + " " + color.name} />
          </div>
          <div className="pdp__thumbs">
            {imgs.map((src, i) => (
              <div key={i}
                   className={"pdp__thumb" + (i === activeImg ? " is-active" : "")}
                   onClick={() => setActiveImg(i)}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="pdp__info">
          <div className="pdp__crumb">Home / {product.category} / Summer 26 · {product.id.toUpperCase().slice(0,8)}</div>
          <h1 className="pdp__name">{product.name}</h1>
          <div className="pdp__price-row">
            <div className="pdp__price">{fmtPrice(product.price)}</div>
            <div className="pdp__rating">
              <Icon name="star" size={11}/>
              {product.rating.toFixed(1)} · {product.reviews} reviews
            </div>
          </div>

          <div className="opt-block">
            <div className="opt-block__head">
              <span className="opt-block__label">— Colour</span>
              <span className="opt-block__value">{color.name}</span>
            </div>
            <div className="swatch-row">
              {product.colors.map(c => (
                <div key={c.id}
                     className={"swatch-square" + (c.id === colorId ? " is-active" : "")}
                     style={{ background: c.hex }}
                     title={c.name}
                     onClick={() => { setColorId(c.id); setActiveImg(0); }} />
              ))}
            </div>
          </div>

          <div className="opt-block">
            <div className="opt-block__head">
              <span className="opt-block__label">— Size</span>
              <a className="opt-block__link" href="#" onClick={(e)=>{e.preventDefault();}}>Size guide</a>
            </div>
            <div className="size-row">
              {product.sizes.map(s => (
                <button key={s.id}
                        className={"size-btn" + (sizeId === s.id ? " is-active" : "") + (s.soldOut ? " is-disabled" : "")}
                        disabled={s.soldOut}
                        onClick={() => setSizeId(s.id)}>{s.label}</button>
              ))}
            </div>
          </div>

          <button className="cta" onClick={onAddClick} disabled={!sizeId} data-magnet>
            {adding ? <><Icon name="check" size={14}/> Added to bag</> : <>Add to bag · {fmtPrice(product.price)}</>}
          </button>
          <div style={{height: 12}} />
          <div style={{display:'flex', gap: 10, alignItems:'center', fontFamily:'var(--font-mono)', fontSize: 10, letterSpacing:'0.18em', color:'var(--mid)', textTransform:'uppercase', marginTop: 14}}>
            <Icon name="lock" size={12}/> Secure checkout · Free returns within 14 days
          </div>

          <div className="pdp__accordion">
            {[
              { id: "details",  title: "About this piece", body: (
                <>
                  <p>{product.description}</p>
                  <ul>
                    {product.specs.map((s, i) => (
                      <li key={i}><b>{s.k}</b><span>{s.v}</span></li>
                    ))}
                  </ul>
                </>
              )},
              { id: "care",     title: "Care",     body: <p>{product.care}</p> },
              { id: "delivery", title: "Delivery & returns", body: <p>{product.delivery}</p> },
            ].map(row => (
              <div key={row.id} className={"acc-row" + (openAcc[row.id] ? " is-open" : "")}>
                <div className="acc-row__head" onClick={() => setOpenAcc(s => ({...s, [row.id]: !s[row.id]}))}>
                  <span className="acc-row__title">{row.title}</span>
                  <span className="acc-row__icon" />
                </div>
                <div className="acc-row__body">
                  <div className="acc-row__inner">{row.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Cart Drawer ──────────────────────────────────────────── */
const CartDrawer = ({ open, onClose, items, onChangeQty, onRemove, onCheckout, findProduct }) => {
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <>
      <div className={"scrim" + (open ? " is-open" : "")} onClick={onClose} />
      <aside className={"cart" + (open ? " is-open" : "")} aria-hidden={!open} data-screen-label="Cart">
        <div className="cart__head">
          <h3 className="cart__title">Your Bag <span>({String(items.reduce((s,i)=>s+i.qty,0)).padStart(2,"0")})</span></h3>
          <button className="cart__close" onClick={onClose} aria-label="Close cart">
            <Icon name="close" size={16}/>
          </button>
        </div>

        <div className="cart__body">
          {items.length === 0 ? (
            <div className="cart__empty">
              <HandMark size={44} />
              <h3>Your bag is empty.</h3>
              <p>Begin with a hoodie. Or a hat. Either way, it'll outlast the season.</p>
              <button className="cta cta--secondary" style={{maxWidth:280, marginTop: 12}} onClick={onClose}>Continue browsing</button>
            </div>
          ) : items.map((it, idx) => {
            const product = findProduct(it.productId);
            const color = product?.colors.find(c => c.id === it.colorId);
            return (
              <div className="cart-line" key={it.lineId}>
                <div className="cart-line__img">
                  <img src={color?.front} alt={product.name} />
                </div>
                <div className="cart-line__info">
                  <div className="cart-line__name">{product.name}</div>
                  <div className="cart-line__meta">{color?.name} · Size {it.sizeLabel}</div>
                  <div className="cart-line__bottom">
                    <div className="cart-qty">
                      <button onClick={()=>onChangeQty(it.lineId, it.qty - 1)} aria-label="Decrease">−</button>
                      <span>{String(it.qty).padStart(2,"0")}</span>
                      <button onClick={()=>onChangeQty(it.lineId, it.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap: 12}}>
                      <div className="cart-line__price">{fmtPrice(it.price * it.qty)}</div>
                      <button className="cart-line__remove" onClick={()=>onRemove(it.lineId)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div className="cart__foot">
            <div className="cart__totals">
              <div className="cart__row"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
              <div className="cart__row"><span>Shipping</span><span>{shipping === 0 ? "Complimentary" : fmtPrice(shipping)}</span></div>
              <div className="cart__row cart__row--total"><span>Total</span><span>{fmtPrice(total)}</span></div>
            </div>
            <button className="cta" onClick={onCheckout} data-magnet>
              Checkout <Icon name="arrow-right" size={14}/>
            </button>
            <p className="cart__note">Powered by <span style={{letterSpacing:'0.18em'}}>STRIPE</span> · Encrypted · Free returns</p>
          </div>
        )}
      </aside>
    </>
  );
};

Object.assign(window, { PDP, CartDrawer });
