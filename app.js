const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
const tel = s => String(s || '').replace(/[^\d+]/g, '');
const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
const routes = { index: 'home', about: 'about', products: 'products', manufacturing: 'manufacturing', b2b: 'b2b', 'why-synnera': 'why', contact: 'contact' };
const activePage = routes[page] || 'home';

async function loadSite() {
  const response = await fetch('/content/site.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load site content');
  return response.json();
}

const nav = current => `
<header class="nav"><div class="container nav-inner">
  <a class="brand-link" href="/" aria-label="Synnera home"><img class="logo" src="/assets/synnera-logo.svg" alt="Synnera"></a>
  <button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span></button>
  <nav class="nav-links" id="site-navigation" aria-label="Primary navigation">
    <a class="${current === 'home' ? 'active' : ''}" href="/">Home</a>
    <a class="${current === 'about' ? 'active' : ''}" href="/about.html">About</a>
    <a class="${current === 'products' ? 'active' : ''}" href="/products.html">Products</a>
    <a class="${current === 'manufacturing' ? 'active' : ''}" href="/manufacturing.html">Manufacturing</a>
    <a class="${current === 'b2b' ? 'active' : ''}" href="/b2b.html">B2B</a>
    <a class="${current === 'why' ? 'active' : ''}" href="/why-synnera.html">Why Synnera</a>
    <a class="nav-cta ${current === 'contact' ? 'active' : ''}" href="/contact.html">Contact</a>
  </nav>
</div></header>`;

function footer(d) {
  return `<footer><div class="container footer-inner"><div><strong>${esc(d.brand.name)}</strong> · ${esc(d.footer.note)}</div><div>${esc(d.footer.copyright)}</div></div></footer>`;
}

function heading(eyebrow, title, body = '') {
  return `<div class="section-head"><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2>${body ? `<p>${esc(body)}</p>` : ''}</div>`;
}

function pageIntro(eyebrow, title, body) {
  return `<section class="page-intro"><div class="container">${heading(eyebrow, title, body)}</div></section>`;
}

function renderHome(d) {
  return `<main><section class="hero"><div class="container hero-grid"><div><div class="eyebrow">${esc(d.home.eyebrow)}</div><h1>${esc(d.home.headline)}</h1><h2>${esc(d.home.subheadline)}</h2><p class="lead">${esc(d.home.body)}</p><div class="actions"><a class="btn btn-primary" href="/products.html">${esc(d.home.ctaPrimary)}</a><a class="btn btn-secondary" href="/contact.html">${esc(d.home.ctaSecondary)}</a></div></div><div class="hero-photo"><img src="${esc(d.home.heroImage)}" alt="Premium sleep environment"><div class="hero-badge"><strong>Synnera Mattress LLP</strong><small>Rajkot, Gujarat · India</small></div></div></div></section><section class="home-links"><div class="container"><div class="section-head"><div class="eyebrow">Explore Synnera</div><h2>From sleep products to manufacturing</h2></div><div class="link-grid"><a href="/about.html"><span>01</span><h3>${esc(d.about.title)}</h3><p>${esc(d.about.body)}</p></a><a href="/products.html"><span>02</span><h3>${esc(d.productsIntro.title)}</h3><p>${esc(d.productsIntro.body)}</p></a><a href="/b2b.html"><span>03</span><h3>${esc(d.capabilities.title)}</h3><p>${esc(d.capabilities.body)}</p></a></div></div></section></main>`;
}

function renderAbout(d) {
  return `<main>${pageIntro(d.about.eyebrow, d.about.title, d.about.body)}<section class="about"><div class="container about-grid"><div class="about-photo"><img src="${esc(d.about.image)}" alt="Synnera brand and manufacturing story"></div><div>${heading(d.about.eyebrow, d.about.title, d.about.body)}<div class="stats">${d.about.stats.map(x => `<div class="stat"><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join('')}</div></div></div></section></main>`;
}

function renderProducts(d) {
  return `<main>${pageIntro(d.productsIntro.eyebrow, d.productsIntro.title, d.productsIntro.body)}<section class="products"><div class="container"><div class="product-grid">${d.products.map(p => `<article class="product-card"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"><div class="product-body"><span class="pill">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="features">${(p.features || []).map(f => `<span>${esc(f.feature || f)}</span>`).join('')}</div></div></article>`).join('')}</div></div></section></main>`;
}

function renderManufacturing(d) {
  return `<main>${pageIntro(d.manufacturing.eyebrow, d.manufacturing.title, d.manufacturing.body)}<section class="manufacturing"><div class="container manufacturing-grid"><div>${heading(d.manufacturing.eyebrow, d.manufacturing.title, d.manufacturing.body)}<div class="steps">${d.manufacturing.steps.map(s => `<div class="step"><div class="step-num">${esc(s.number)}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join('')}</div></div><div class="factory-photo"><img src="${esc(d.manufacturing.image)}" alt="Mattress manufacturing facility" loading="lazy"></div></div></section></main>`;
}

function renderB2b(d) {
  return `<main>${pageIntro(d.capabilities.eyebrow, d.capabilities.title, d.capabilities.body)}<section class="capabilities"><div class="container cap-grid"><div>${heading(d.capabilities.eyebrow, d.capabilities.title, d.capabilities.body)}<a class="btn btn-primary" href="/contact.html">Talk to Synnera</a></div><div class="cap-list">${d.capabilities.items.map(x => `<div class="cap-item">${esc(x.capability || x)}</div>`).join('')}</div></div></section></main>`;
}

function renderWhy(d) {
  return `<main>${pageIntro(d.why.eyebrow, d.why.title)}<section class="why"><div class="container"><div class="why-grid">${d.why.items.map((x, i) => `<article class="why-card"><div class="why-icon">${String(i + 1).padStart(2, '0')}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div></div></section></main>`;
}

function renderContact(d) {
  return `<main>${pageIntro(d.contact.eyebrow, d.contact.title, d.contact.body)}<section class="contact"><div class="container contact-grid"><div><div class="eyebrow">${esc(d.contact.eyebrow)}</div><h2>${esc(d.contact.title)}</h2><p class="contact-copy">${esc(d.contact.body)}</p><div class="contact-links"><a href="tel:${tel(d.brand.phone)}">☎ ${esc(d.brand.phone)}</a><a href="https://wa.me/${tel(d.brand.whatsapp)}" target="_blank" rel="noopener">WhatsApp ${esc(d.brand.whatsapp)}</a><a href="mailto:${esc(d.brand.email)}">✉ ${esc(d.brand.email)}</a><a href="${esc(d.brand.maps)}" target="_blank" rel="noopener">⌖ View location on Google Maps</a></div></div><form class="form" name="synnera-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/contact.html?submitted=true"><input type="hidden" name="form-name" value="synnera-enquiry"><p class="hidden"><label>Don't fill this out: <input name="bot-field"></label></p><h3>${esc(d.contact.formTitle)}</h3><div class="field"><label for="name">Name</label><input id="name" name="name" required></div><div class="field"><label for="company">Company</label><input id="company" name="company"></div><div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" required></div><div class="field"><label for="message">Requirement</label><textarea id="message" name="message" required placeholder="Tell us about your mattress or manufacturing requirement"></textarea></div><button class="btn btn-primary" type="submit">Send Enquiry</button><p class="form-note">Form submissions are available in your Netlify dashboard.</p></form></div></section></main>`;
}

function render(d) {
  document.documentElement.style.setProperty('--purple', d.brand.primaryColor || '#330066');
  document.documentElement.style.setProperty('--gold', d.brand.secondaryColor || '#F4A126');
  const renderer = { home: renderHome, about: renderAbout, products: renderProducts, manufacturing: renderManufacturing, b2b: renderB2b, why: renderWhy, contact: renderContact }[activePage];
  const content = renderer ? renderer(d) : renderHome(d);
  document.title = activePage === 'home' ? d.seo.title : `${activePage === 'why' ? 'Why Synnera' : activePage[0].toUpperCase() + activePage.slice(1)} | ${d.brand.legalName}`;
  document.getElementById('app').innerHTML = nav(activePage) + content + footer(d);
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('mobile-open');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('mobile-open');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  }));
}

loadSite().then(render).catch(err => {
  document.getElementById('app').innerHTML = '<div class="error"><h1>Synnera</h1><p>The website content could not be loaded. Please check that <code>content/site.json</code> exists.</p></div>';
  console.error(err);
});
