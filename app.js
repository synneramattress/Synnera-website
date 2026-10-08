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
  return `<main><section class="hero"><div class="container hero-grid"><div><div class="eyebrow">${esc(d.home.eyebrow)}</div><h1>${esc(d.home.headline)}</h1><h2>${esc(d.home.subheadline)}</h2><p class="hero-body">${esc(d.home.body)}</p><div class="hero-cta"><a class="btn btn-primary" href="/products.html">${esc(d.home.ctaPrimary)}</a> <a class="btn btn-secondary" href="/contact.html">${esc(d.home.ctaSecondary)}</a></div></div><div><img src="${esc(d.home.heroImage)}" alt="Synnera mattress sleep products"></div></div></section></main>`;
}

function renderAbout(d) {
  return `<main>${pageIntro(d.about.eyebrow, d.about.title, d.about.body)}<section class="about"><div class="container about-grid"><div class="about-photo"><img src="${esc(d.about.image)}" alt="Synnera mattress manufacturing facility"></div><div class="about-stats"><div>${heading(d.about.eyebrow, d.about.title, '')}</div><div class="stats-grid">${d.about.stats.map(s => `<article class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></article>`).join('')}</div></div></div></section></main>`;
}

function renderProducts(d) {
  return `<main>${pageIntro(d.productsIntro.eyebrow, d.productsIntro.title, d.productsIntro.body)}<section class="products"><div class="container"><div class="product-grid">${d.products.map(p => `<article class="product-card"><div class="product-card-image"><img src="${esc(p.image)}" alt="${esc(p.title)} manufactured by Synnera"></div><div class="product-card-text"><div class="product-category">${esc(p.category)}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><ul class="product-features">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></article>`).join('')}</div></div></section></main>`;
}

function renderManufacturing(d) {
  return `<main>${pageIntro(d.manufacturing.eyebrow, d.manufacturing.title, d.manufacturing.body)}<section class="manufacturing"><div class="container manufacturing-grid"><div>${heading(d.manufacturing.eyebrow, d.manufacturing.title, '')}<ul class="manufacturing-steps">${d.manufacturing.steps.map(s => `<li class="step"><strong>${esc(s.number)}</strong><div><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div></li>`).join('')}</ul></div><div><img src="${esc(d.manufacturing.image)}" alt="Mattress manufacturing process in Rajkot"></div></div></section></main>`;
}

function renderB2b(d) {
  return `<main>${pageIntro(d.capabilities.eyebrow, d.capabilities.title, d.capabilities.body)}<section class="capabilities"><div class="container cap-grid"><div>${heading(d.capabilities.eyebrow, d.capabilities.title, '')}<ul class="cap-list">${d.capabilities.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div><div class="cap-callout"><h3>Connect with Synnera</h3><p>Discuss your mattress manufacturing requirements with our B2B team.</p><a class="btn btn-primary" href="/contact.html">Get in touch</a></div></div></section></main>`;
}

function renderWhy(d) {
  return `<main>${pageIntro(d.why.eyebrow, d.why.title)}<section class="why"><div class="container"><div class="why-grid">${d.why.items.map((x, i) => `<article class="why-card"><div class="why-icon">${i + 1}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></article>`).join('')}</div></div></section></main>`;
}

function renderContact(d) {
  return `<main>${pageIntro(d.contact.eyebrow, d.contact.title, d.contact.body)}<section class="contact"><div class="container contact-grid"><div><div class="eyebrow">${esc(d.contact.eyebrow)}</div><h2>${esc(d.contact.title)}</h2><p>${esc(d.contact.body)}</p><ul class="contact-methods"><li><strong>Email</strong><a href="mailto:${esc(d.brand.email)}">${esc(d.brand.email)}</a></li><li><strong>Phone</strong> <a href="tel:+91${esc(tel(d.brand.phone))}">+91 ${esc(d.brand.phone)}</a></li><li><strong>WhatsApp</strong> <a href="https://wa.me/91${esc(tel(d.brand.whatsapp))}?text=Hi%20Synnera">+91 ${esc(d.brand.whatsapp)}</a></li><li><strong>Address</strong> ${esc(d.brand.address)}</li><li><strong>Maps</strong> <a href="${esc(d.brand.maps)}" target="_blank" rel="noopener">View location</a></li></ul></div><div><h3>${esc(d.contact.formTitle)}</h3><form name="contact" method="POST" netlify><div class="form-group"><label for="name">Your name</label><input type="text" id="name" name="name" required></div><div class="form-group"><label for="email">Email address</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="company">Company (optional)</label><input type="text" id="company" name="company"></div><div class="form-group"><label for="enquiry">Your enquiry</label><textarea id="enquiry" name="enquiry" rows="5" required></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary">Send enquiry</button></div></form><div id="contact-form-message"></div></div></div></section></main>`;
}

function render(d) {
  document.documentElement.style.setProperty('--purple', d.brand.primaryColor || '#330066');
  document.documentElement.style.setProperty('--gold', d.brand.secondaryColor || '#F4A126');
  const renderer = { home: renderHome, about: renderAbout, products: renderProducts, manufacturing: renderManufacturing, b2b: renderB2b, why: renderWhy, contact: renderContact }[activePage];
  const content = renderer ? renderer(d) : renderHome(d);
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
