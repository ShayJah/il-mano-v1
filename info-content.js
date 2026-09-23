/* IL MANO — static content for FAQ / legal / support pages */
window.IL_MANO_PAGES = {
  faq: {
    eyebrow: "Support",
    title: "Frequently <em>asked.</em>",
    intro: "Everything you need to know before your order arrives. Can't find it here — email us at hello@ilmano.com.",
    sections: [
      {
        heading: "Orders & Payment",
        items: [
          { q: "How does checkout work?", a: "We use Stripe to securely process your card. Your card is authorized at checkout and charged once your order is confirmed and prepared for shipment — you won't see a duplicate charge." },
          { q: "Is my payment information safe?", a: "Yes. Card details are sent directly to Stripe and never touch our servers. We only ever see a tokenized reference, never your full card number." },
          { q: "Can I change or cancel my order?", a: "Email hello@ilmano.com as soon as possible. If your order hasn't been captured/shipped yet, we can usually cancel or adjust it." },
        ],
      },
      {
        heading: "Shipping",
        items: [
          { q: "Where do you ship from?", a: "Every piece is manufactured and shipped from Los Angeles, CA." },
          { q: "How long does delivery take?", a: "Standard delivery is 4–6 business days within the US. See our Shipping & Returns page for full details." },
        ],
      },
      {
        heading: "Sizing",
        id: "sizing",
        items: [
          { q: "How do I find my size?", a: "Our pieces run true to size with a relaxed, unisex fit. If you're between sizes, we recommend sizing down for a closer fit." },
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of <em>service.</em>",
    intro: "Last updated " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) + ". This is a starter policy — have it reviewed by counsel before relying on it at scale.",
    sections: [
      {
        heading: "1. Agreement to terms",
        body: "By accessing or purchasing from IL MANO ('we', 'us'), you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.",
      },
      {
        heading: "2. Orders & payment",
        body: "All prices are listed in USD. When you place an order, your card is authorized for the order total; the charge is captured once the order is confirmed. We reserve the right to refuse or cancel any order at our discretion, including for suspected fraud or pricing errors.",
      },
      {
        heading: "3. Shipping & risk of loss",
        body: "Risk of loss and title for items purchased pass to you upon delivery to the carrier. See our Shipping & Returns page for delivery estimates.",
      },
      {
        heading: "4. Returns",
        body: "See our Shipping & Returns page for our return window and process.",
      },
      {
        heading: "5. Intellectual property",
        body: "All content on this site — including the IL MANO name, marks, photography, and designs — is our property or licensed to us, and may not be reproduced without permission.",
      },
      {
        heading: "6. Limitation of liability",
        body: "IL MANO is not liable for indirect, incidental, or consequential damages arising from use of this site or its products, to the maximum extent permitted by law.",
      },
      {
        heading: "7. Contact",
        body: "Questions about these terms? Email hello@ilmano.com.",
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy <em>policy.</em>",
    intro: "Last updated " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) + ". This is a starter policy — have it reviewed by counsel before relying on it at scale.",
    sections: [
      {
        heading: "What we collect",
        body: "When you check out, we collect your name, email, phone (optional), shipping address, and a payment token from Stripe. We do not collect or store your full card number — Stripe handles that.",
      },
      {
        heading: "How we use it",
        body: "We use your information to process and ship your order, send order-related communications, and — only if you opt in — send you updates about new drops and restocks.",
      },
      {
        heading: "Third parties",
        body: "We share order data with Stripe (payment processing) and shipping carriers (delivery) as needed to fulfill your order. We do not sell your personal information.",
      },
      {
        heading: "Your choices",
        body: "You can unsubscribe from marketing emails at any time via the link in any email, or by contacting hello@ilmano.com. To request deletion of your data, email us and we'll respond within a reasonable timeframe.",
      },
      {
        heading: "Contact",
        body: "Questions about this policy? Email hello@ilmano.com.",
      },
    ],
  },
  "shipping-returns": {
    eyebrow: "Support",
    title: "Shipping &amp; <em>returns.</em>",
    intro: "Manufactured and shipped from Los Angeles, CA.",
    sections: [
      {
        heading: "Shipping",
        items: [
          { q: "Standard", a: "Free on orders over $250, otherwise $12. Delivered in 4–6 business days." },
          { q: "Express", a: "$18. Delivered in 2–3 business days." },
          { q: "Same Day (LA only)", a: "$35. Same-day delivery within Los Angeles County for orders placed before 12pm PT." },
        ],
      },
      {
        heading: "Returns",
        id: "returns",
        items: [
          { q: "Return window", a: "14 days from delivery for a full refund to your original payment method. Limited-run pieces (marked 'Limited') have a 30-day window." },
          { q: "Condition", a: "Items must be unworn, unwashed, and in original packaging with tags attached." },
          { q: "How to start a return", a: "Email hello@ilmano.com with your order number and we'll send a prepaid return label." },
        ],
      },
    ],
  },
  "code-of-conduct": {
    eyebrow: "Legal",
    title: "Code of <em>conduct.</em>",
    intro: "How we expect people to treat each other, on this site and in any community spaces we run.",
    sections: [
      {
        heading: "Our standard",
        body: "IL MANO is committed to providing a respectful, harassment-free experience for everyone — customers, staff, and partners — regardless of background, identity, or how they found us.",
      },
      {
        heading: "Not tolerated",
        body: "Harassment, hate speech, threats, fraud, or abuse directed at our staff or other customers (including in reviews, emails, or support channels) will not be tolerated and may result in your account or order being refused or cancelled.",
      },
      {
        heading: "Reporting a concern",
        body: "If you experience or witness a violation of this code, please email hello@ilmano.com and we will review it promptly.",
      },
    ],
  },
};
