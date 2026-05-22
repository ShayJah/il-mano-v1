/* ─── Icons + small utilities ─────────────────────────────── */

const Icon = ({ name, size = 18, stroke = 1.4 }) => {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
  };
  switch (name) {
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg {...common}>
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      );
    case "arrow-down":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M6 13l6 6 6-6" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M5 5l14 14" />
          <path d="M19 5L5 19" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
    case "heart-filled":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 7h12l-1 13H7L6 7z" />
          <path d="M9 7a3 3 0 016 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0116 0" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 018 0v3" />
        </svg>
      );
    case "minus":
      return <svg {...common}><path d="M5 12h14" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.27l-6.18 3.23L7 14.63 2 9.76l6.91-1L12 2.5z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 010 18a14 14 0 010-18" />
        </svg>
      );
    default:
      return null;
  }
};

/* ─── Brand mark (handprint) ───────────────────────────────── */
const HandMark = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 80 96" fill={color} aria-hidden>
    <path d="M27 6c-3 0-5 2-5 5v32l-4-3c-2-2-5-2-7 0s-2 5 0 7l13 13v6c0 13 9 24 22 24s22-11 22-24V31c0-3-2-5-5-5s-5 2-5 5v18h-2V11c0-3-2-5-5-5s-5 2-5 5v36h-2V8c0-3-2-5-5-5s-5 2-5 5v40h-2V11c0-3-2-5-5-5z" />
  </svg>
);

/* ─── IL MANO geometric wordmark (SVG) ─────────────────────── */
const IlManoMark = ({ height = 28, color = "currentColor" }) => (
  // Stylized geometric wordmark with cut-corner letterforms echoing the brand identity
  <svg height={height} viewBox="0 0 320 56" fill={color} aria-label="IL MANO">
    {/* I */}
    <rect x="0" y="6" width="10" height="44" />
    {/* L */}
    <path d="M22 6h10v34h22v10H22z" />
    {/* gap */}
    {/* M with cut-corner */}
    <path d="M72 50V12l4-6h10l16 20 16-20h10l4 6v38h-10V20l-16 20h-8L82 20v30z" />
    {/* A — geometric, cut top-left corner */}
    <path d="M154 50l16-44h12l16 44h-11l-3-10h-16l-3 10zm17-19h10l-5-16z" />
    {/* N — angular */}
    <path d="M208 50V6h11l16 26V6h10v44h-11l-16-26v26z" />
    {/* O — rounded but compressed */}
    <path d="M270 28c0-13 9-23 22-23s22 10 22 23-9 23-22 23-22-10-22-23zm10 0c0 9 5 14 12 14s12-5 12-14-5-14-12-14-12 5-12 14z" />
  </svg>
);

/* ─── Custom hooks ─────────────────────────────────────────── */
const useScrollY = () => {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
};

const useReveal = (opts = {}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          obs.unobserve(el);
        }
      });
    }, { threshold: opts.threshold ?? 0.12, rootMargin: opts.rootMargin ?? "0px 0px -8% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const fmtPrice = (n) => "$" + n.toLocaleString("en-US");

/* Magnetic effect for CTA buttons */
const useMagnetic = (strength = 0.25) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rect;
    const onEnter = () => { rect = el.getBoundingClientRect(); };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
      rect = null;
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);
  return ref;
};

Object.assign(window, { Icon, HandMark, IlManoMark, useScrollY, useReveal, useMagnetic, fmtPrice });
