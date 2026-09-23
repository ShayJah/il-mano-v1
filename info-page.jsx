/* ─── Generic info/legal/FAQ page shell — mounted by faq.html, terms.html, etc. ─── */
const InfoPage = ({ slug }) => {
  const page = window.IL_MANO_PAGES[slug];
  if (!page) return <NotFoundBody />;
  return (
    <>
      <Nav cartCount={0} onOpenCart={() => { window.location.href = "/#collection"; }} transparent={false} />
      <main className="info-page">
        <header className="info-page__head">
          <div className="section__index">— {page.eyebrow}</div>
          <h1 className="section__title" dangerouslySetInnerHTML={{ __html: page.title }} />
          {page.intro && <p className="info-page__intro" dangerouslySetInnerHTML={{ __html: page.intro }} />}
        </header>
        <div className="info-page__body">
          {page.sections.map((s, i) => (
            <section key={i} className="info-page__section" id={s.id}>
              <h2>{s.heading}</h2>
              {s.body && <p>{s.body}</p>}
              {s.items && s.items.map((it, j) => (
                <div className="info-page__qa" key={j}>
                  <h3>{it.q}</h3>
                  <p>{it.a}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

const NotFoundBody = () => (
  <main className="info-page info-page--404">
    <div className="section__index">— 404</div>
    <h1 className="section__title">Page not <em>found.</em></h1>
    <p className="info-page__intro">The page you're looking for doesn't exist or has moved.</p>
    <a href="/" className="cta" style={{ maxWidth: 220, marginTop: 24 }}>Back home</a>
  </main>
);

const mountInfoPage = (slug) => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  if (slug === "404") {
    root.render(
      <>
        <Nav cartCount={0} onOpenCart={() => { window.location.href = "/#collection"; }} transparent={false} />
        <NotFoundBody />
        <Footer />
      </>
    );
  } else {
    root.render(<InfoPage slug={slug} />);
  }
};

Object.assign(window, { mountInfoPage });
