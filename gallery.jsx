/* ─── Gallery — scroll-driven stage ─────────────────────────────
   A 300vh wrapper with a sticky 100vh stage. Scroll progress p (0→1) drives
   four cut-out pieces through three scenes (p = 0, 0.5, 1). Only transform and
   filter are animated; everything is written straight to the DOM in a rAF loop
   (no React re-render per frame).

   The pieces in assets/gallery/ are the studio hoodie shots with the background
   cut out (flood-fill from the edges). Swap in any transparent PNG/WebP by
   changing `src`; set `blend: true` only for an opaque white-background photo
   (multiply-blends it into the stage).

   Keyframe fields — x / y: offset from stage centre in vw / vh,
   w: scale (1 = focus size), blur: px, op: opacity, rot: degrees. */
const GAL_BASE = [
  { id: "black", src: "assets/gallery/hoodie-black-front.webp", blend: false,
    title: "Vanta Black", meta: "Classic Hoodie · French terry · Los Angeles",
    frames: [
      { x: 0,   y: 0,   w: 1,    blur: 0,  op: 1,    rot: -2 },
      { x: -30, y: -14, w: 0.5,  blur: 12, op: 0.8,  rot: -8 },
      { x: -38, y: 10,  w: 0.4,  blur: 16, op: 0.6,  rot: -12 },
    ] },
  { id: "brown", src: "assets/gallery/hoodie-brown-front.webp", blend: false,
    title: "Cabalo Brown", meta: "Classic Hoodie · LA-dyed patina · Unisex",
    frames: [
      { x: 30,  y: 10,  w: 0.45, blur: 12, op: 0.85, rot: 8 },
      { x: 0,   y: 0,   w: 1,    blur: 0,  op: 1,    rot: 1 },
      { x: 32,  y: -16, w: 0.5,  blur: 14, op: 0.7,  rot: 6 },
    ] },
  { id: "blue", src: "assets/gallery/hoodie-blue-front.webp", blend: false,
    title: "Electric Blue", meta: "Classic Hoodie · 420 GSM · Relaxed fit",
    frames: [
      { x: 36,  y: -18, w: 0.38, blur: 16, op: 0.6,  rot: 10 },
      { x: -34, y: 16,  w: 0.45, blur: 12, op: 0.8,  rot: -6 },
      { x: 0,   y: 0,   w: 1,    blur: 0,  op: 1,    rot: -1 },
    ] },
  // Big foreground piece in the corner — heaviest blur. Dropped on mobile.
  { id: "corner", src: "assets/gallery/hoodie-brown-back.webp", blend: false, decor: true,
    frames: [
      { x: 48,  y: 32,  w: 1.3,  blur: 24, op: 0.85, rot: 14 },
      { x: -46, y: 34,  w: 1.4,  blur: 26, op: 0.75, rot: -10 },
      { x: 46,  y: 30,  w: 1.3,  blur: 22, op: 0.8,  rot: 12 },
    ] },
];

// Image, title and caption come from the CMS (content/gallery.json); the motion keyframes above stay in code.
const GAL_CMS = Object.fromEntries(((window.IL_MANO_CONTENT || {}).gallery?.pieces || []).map(p => [p.id, p]));
const GAL_PIECES = GAL_BASE.map(pc => ({ ...pc, ...(GAL_CMS[pc.id] || {}) }));

const galSmoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const galClamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const GAL_HOLD = 0.12;
const GAL_KEYS = ["x", "y", "w", "blur", "op", "rot"];

// p → interpolated frame. Two segments (0→.5, .5→1); each holds 12% at both
// ends so the focused piece rests before easing away.
const galSample = (frames, p) => {
  const seg = p < 0.5 ? 0 : 1;
  const t = (p - seg * 0.5) / 0.5;
  const u = galSmoother(galClamp((t - GAL_HOLD) / (1 - 2 * GAL_HOLD)));
  const a = frames[seg], b = frames[seg + 1], out = {};
  for (const k of GAL_KEYS) out[k] = a[k] + (b[k] - a[k]) * u;
  return out;
};

const useMedia = (query) => {
  const [m, setM] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
};

const Gallery = () => {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMedia("(max-width: 720px)");
  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const pieceRefs = React.useRef([]);
  const capRefs = React.useRef([]);
  const numRefs = React.useRef([]);
  const lineRef = React.useRef(null);
  const pillRef = React.useRef(null);
  const hintRef = React.useRef(null);

  const pieces = mobile ? GAL_PIECES.filter(pc => !pc.decor) : GAL_PIECES;
  const scenes = GAL_PIECES.filter(pc => !pc.decor);
  const blurK = mobile ? 0.5 : 1;

  React.useEffect(() => {
    if (reduced) return;
    let raf = 0, pillOn = false, hintOn = true;
    const render = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = galClamp(-r.top / span);

      pieces.forEach((pc, i) => {
        const el = pieceRefs.current[i];
        if (!el) return;
        const f = galSample(pc.frames, p);
        el.style.transform =
          `translate3d(-50%,-50%,0) translate3d(${f.x}vw,${f.y}vh,0) rotate(${f.rot}deg) scale(${f.w})`;
        el.style.filter = f.blur * blurK < 0.05 ? "none" : `blur(${(f.blur * blurK).toFixed(2)}px)`;
        el.style.opacity = f.op.toFixed(3);
      });

      scenes.forEach((_, i) => {
        const d = p * 2 - i;
        const o = Math.max(0, 1 - Math.abs(d) * 2.6);
        const cap = capRefs.current[i];
        if (cap) {
          cap.style.opacity = o.toFixed(3);
          cap.style.transform = `translate3d(0,${(-d * 22).toFixed(1)}px,0)`;
        }
        const n = numRefs.current[i];
        if (n) n.style.opacity = (0.3 + 0.7 * Math.max(0, 1 - Math.abs(d))).toFixed(3);
      });
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${p.toFixed(4)})`;

      const showPill = p > 0.9;
      if (showPill !== pillOn && pillRef.current) {
        pillOn = showPill;
        pillRef.current.classList.toggle("is-on", showPill);
      }
      const showHint = p < 0.015;
      if (showHint !== hintOn && hintRef.current) {
        hintOn = showHint;
        hintRef.current.classList.toggle("is-off", !showHint);
      }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [reduced, mobile]);

  if (reduced) {
    return (
      <section className="gal gal--static" id="gallery" data-screen-label="Gallery">
        <div className="gal__static-head">— Gallery</div>
        <ul className="gal__list">
          {scenes.map((pc, i) => (
            <li key={pc.id}>
              <img src={pc.src} alt={pc.title + " hoodie"} loading="lazy"
                   className={pc.blend ? "is-blend" : ""} />
              <div className="gal__idx">{String(i + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
              <h3 className="gal__title">{pc.title}</h3>
              <div className="gal__meta">{pc.meta}</div>
            </li>
          ))}
        </ul>
        <a href="/#collection" className="gal__pill is-on">Enter the collection <span>→</span></a>
      </section>
    );
  }

  return (
    <section className="gal" id="gallery" ref={wrapRef} data-screen-label="Gallery">
      <div className="gal__stage" ref={stageRef}>
        {pieces.map((pc, i) => (
          <img key={pc.id} ref={el => (pieceRefs.current[i] = el)}
               className={"gal__piece" + (pc.blend ? " is-blend" : "")}
               src={pc.src} alt="" aria-hidden="true" draggable="false" />
        ))}

        <div className="gal__captions">
          {scenes.map((pc, i) => (
            <div className="gal__cap" key={pc.id} ref={el => (capRefs.current[i] = el)}>
              <div className="gal__idx">{String(i + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
              <h3 className="gal__title">{pc.title}</h3>
              <div className="gal__meta">{pc.meta}</div>
            </div>
          ))}
        </div>

        <div className="gal__counter" aria-hidden="true">
          {scenes.map((_, i) => (
            <span key={i} ref={el => (numRefs.current[i] = el)}>{String(i + 1).padStart(2, "0")}</span>
          ))}
          <div className="gal__track"><i ref={lineRef} /></div>
        </div>

        <a href="/#collection" className="gal__pill" ref={pillRef}>
          Enter the collection <span>→</span>
        </a>
        <div className="gal__hint" ref={hintRef} aria-hidden="true">Scroll</div>
      </div>
    </section>
  );
};

Object.assign(window, { Gallery });
