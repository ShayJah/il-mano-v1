/* IL MANO — FAQ / legal / support pages.
   The wording is edited in the CMS (/admin → Info pages); it lives in content/pages/*.json
   and reaches this file through content.generated.js. */
(function () {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const pages = {};
  for (const [slug, page] of Object.entries(window.IL_MANO_CONTENT.pages)) {
    // "{{date}}" in the intro becomes today's date (used by the Terms page).
    pages[slug] = { ...page, intro: (page.intro || "").replace("{{date}}", today) };
  }
  window.IL_MANO_PAGES = pages;
})();
