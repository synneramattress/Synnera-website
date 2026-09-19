
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const tel = s => String(s||'').replace(/[^\d+]/g,'');
const icon = (n) => ['01','02','03','04','05','06','07','08','09'].includes(n) ? n : '•';

async function loadSite(){
  const res = await fetch('/content/site.json', {cache:'no-store'});
  if(!res.ok) throw new Error('Unable to load site content');
  return res.json();
}

function render(d){
  document.documentElement.style.setProperty('--purple', d.brand.primaryColor || '#330066');
  document.documentElement.style.setProperty('--gold', d.brand.secondaryColor || '#F4A126');
  document.title = d.seo.title;

  document.getElementById('app').innerHTML = `
  <header class="nav">
    <div class="container nav-inner">
      <a href="#home" aria-label="${esc(d.brand.name)}"><img class="logo" src="${esc(d.brand.logo)}" alt="${esc(d.brand.name)}"></a>
      <nav class="nav-links">
        <a href="#about">About</a><a href="#products">Products</a><a href="#manufacturing">Manufacturing</a><a href="#capabilities">B2B</a><a href="#why">Why Synnera</a><a href="#contact" class="nav-cta">Contact</a>
      </nav>
      <button class="menu" aria-label="Open menu" onclick="document.querySelector('.nav-links').classList.toggle('mobile-open')">☰</button>
    </div>
  </header>

  <main id="home">
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="eyebrow">${esc(d.home.eyebrow)}</div>
          <h1>${esc(d.home.headline)}</h1>
          <h2>${esc(d.home.subheadline)}</h2>
          <p class="lead">${esc(d.home.body)}</p>
          <div class="actions">
            <a class="btn btn-primary" href="#products">${esc(d.home.ctaPrimary)}</a>
            <a class="btn btn-secondary" href="#contact">${esc(d.home.ctaSecondary)}</a>
          </div>
        </div>
        <div class="hero-photo">
          <img src="${esc(d.home.heroImage)}" alt="Premium sleep environment">
          <div class="hero-badge"><strong>Synnera Mattress LLP</strong><small>Rajkot, Gujarat · India</small></div>
        </div>
      </div>
    </section>

    <section class="about" id="about">
      <div class="container about-grid">
        <div class="about-photo"><img src="${esc(d.about.image)}" alt="Synnera brand and manufacturing story"></div>
        <div>
          <div class="section-head"><div class="eyebrow">${esc(d.about.eyebrow)}</div><h2>${esc(d.about.title)}</h2><p>${esc(d.about.body)}</p></div>
          <div class="stats">${d.about.stats.map(x=>`<div class="stat"><strong>${esc(x.value)}</strong><span>${esc(x.label)}</span></div>`).join('')}</div>
        </div>
      </div>
    </section>

    <section class="products" id="products">
      <div class="container">
        <div class="section-head"><div class="eyebrow">${esc(d.productsIntro.eyebrow)}</div><h2>${esc(d.productsIntro.title)}</h2><p>${esc(d.productsIntro.body)}</p></div>
        <div class="product-grid">
          ${d.products.map(p=>`
            <article class="product-card">
              <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
              <div class="product-body">
                <span class="pill">${esc(p.category)}</span>
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.description)}</p>
                <div class="features">${(p.features||[]).map(f=>`<span>${esc(f.feature || f)}</span>`).join('')}</div>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="manufacturing" id="manufacturing">
      <div class="container manufacturing-grid">
        <div>
          <div class="section-head"><div class="eyebrow">${esc(d.manufacturing.eyebrow)}</div><h2>${esc(d.manufacturing.title)}</h2><p>${esc(d.manufacturing.body)}</p></div>
          <div class="steps">${d.manufacturing.steps.map(s=>`<div class="step"><div class="step-num">${esc(s.number)}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join('')}</div>
        </div>
        <div class="factory-photo"><img src="${esc(d.manufacturing.image)}" alt="Generic mattress manufacturing placeholder image" loading="lazy"></div>
      </div>
    </section>

    <section class="capabilities" id="capabilities">
      <div class="container cap-grid">
        <div class="section-head"><div class="eyebrow">${esc(d.capabilities.eyebrow)}</div><h2>${esc(d.capabilities.title)}</h2><p>${esc(d.capabilities.body)}</p></div>
        <div class="cap-list">${d.capabilities.items.map(x=>`<div class="cap-item">${esc(x.capability || x)}</div>`).join('')}</div>
      </div>
    </section>

    <section class="why" id="why">
      <div class="container">
        <div class="section-head"><div class="eyebrow">${esc(d.why.eyebrow)}</div><h2>${esc(d.why.title)}</h2></div>
        <div class="why-grid">${d.why.items.map((x,i)=>`<article class="why-card"><div class="why-icon">${icon(String(i+1).padStart(2,'0'))}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="container contact-grid">
        <div>
          <div class="eyebrow">${esc(d.contact.eyebrow)}</div>
          <h2>${esc(d.contact.title)}</h2>
          <p class="contact-copy">${esc(d.contact.body)}</p>
          <div class="contact-links">
            <a href="tel:${tel(d.brand.phone)}">☎ ${esc(d.brand.phone)}</a>
            <a href="https://wa.me/${tel(d.brand.whatsapp)}" target="_blank" rel="noopener">WhatsApp ${esc(d.brand.whatsapp)}</a>
            <a href="mailto:${esc(d.brand.email)}">✉ ${esc(d.brand.email)}</a>
            <a href="${esc(d.brand.maps)}" target="_blank" rel="noopener">⌖ View location on Google Maps</a>
          </div>
        </div>
        <form class="form" name="synnera-enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/?submitted=true#contact">
          <input type="hidden" name="form-name" value="synnera-enquiry">
          <p style="display:none"><label>Don't fill this out: <input name="bot-field"></label></p>
          <h3>${esc(d.contact.formTitle)}</h3>
          <div class="field"><label for="name">Name</label><input id="name" name="name" required></div>
          <div class="field"><label for="company">Company</label><input id="company" name="company"></div>
          <div class="field"><label for="phone">Phone / WhatsApp</label><input id="phone" name="phone" required></div>
          <div class="field"><label for="message">Requirement</label><textarea id="message" name="message" required placeholder="Tell us about your mattress or manufacturing requirement"></textarea></div>
          <button class="btn btn-primary" type="submit">Send Enquiry</button>
          <p style="font-size:11px;color:#777;margin:12px 0 0">Form submissions are available in your Netlify dashboard.</p>
        </form>
      </div>
    </section>
  </main>

  <footer>
    <div class="container footer-inner">
      <div><strong>${esc(d.brand.name)}</strong> · ${esc(d.footer.note)}</div>
      <div>${esc(d.footer.copyright)}</div>
    </div>
  </footer>`;
}

loadSite().then(render).catch(err=>{
  document.getElementById('app').innerHTML = `<div style="font-family:Arial;padding:40px;max-width:800px;margin:auto"><h1>Synnera</h1><p>The website content could not be loaded. Please check that <code>content/site.json</code> exists.</p></div>`;
  console.error(err);
});
