const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
const tel = s => String(s || '').replace(/[^\d+]/g, '');
const pathParts = location.pathname.replace(/^\//, '').replace(/\.html$/, '').split('/');
const isBlogPost = pathParts[0] === 'blog' && pathParts[1];
const blogSlug = isBlogPost ? pathParts[1] : null;
const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
const routes = { index: 'home', about: 'about', products: 'products', manufacturing: 'manufacturing', b2b: 'b2b', 'why-synnera': 'why', 'hotel-mattresses': 'hotel', contact: 'contact', blog: 'blog' };
const activePage = routes[page] || 'home';

async function loadSite() {
  const response = await fetch('/content/site.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load site content');
  return response.json();
}

async function loadBlogPosts() {
  const response = await fetch('/content/blog/posts.json', { cache: 'no-store' });
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : (data.posts || []);
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

const nav = current => `
<header class="nav"><div class="container nav-inner">
  <a class="brand-link" href="/" aria-label="Synnera home"><img class="logo" src="/assets/synnera-logo.svg" alt="Synnera"></a>
  <button class="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span><span></span></button>
  <nav class="nav-links" id="site-navigation" aria-label="Primary navigation">
    <a class="${current === 'home' ? 'active' : ''}" href="/">Home</a>
    <a class="${current === 'about' ? 'active' : ''}" href="/about.html">About</a>
    <a class="${current === 'products' ? 'active' : ''}" href="/products.html">Products</a>
    <a class="${current === 'hotel' ? 'active' : ''}" href="/hotel-mattresses.html">Hotel Mattresses</a>
    <a class="${current === 'manufacturing' ? 'active' : ''}" href="/manufacturing.html">Manufacturing</a>
    <a class="${current === 'b2b' ? 'active' : ''}" href="/b2b.html">B2B</a>
    <a class="${current === 'why' ? 'active' : ''}" href="/why-synnera.html">Why Synnera</a>
    <a class="${current === 'blog' ? 'active' : ''}" href="/blog.html">Blog</a>
    <a class="nav-cta ${current === 'contact' ? 'active' : ''}" href="/contact.html">Contact</a>
  </nav>
</div></header>`;

function footer(d) {
  const socialLinks = (d.footer.socialLinks || []).map(link => {
    let icon = '';
    switch(link.icon) {
      case 'maps': icon = '📍'; break;
      case 'youtube': icon = '▶️'; break;
      case 'facebook': icon = 'f'; break;
      case 'instagram': icon = '📷'; break;
      case 'x': icon = 'X'; break;
      default: icon = link.icon;
    }
    return `<a href="${esc(link.url)}" aria-label="${esc(link.name)}" rel="noopener noreferrer" target="_blank" title="${esc(link.name)}">${icon}</a>`;
  }).join('');
  
  return `<footer><div class="container footer-inner"><div><strong>${esc(d.brand.name)}</strong> · ${esc(d.footer.note)}</div><div>${esc(d.footer.copyright)}</div>${socialLinks ? `<div class="footer-socials">${socialLinks}</div>` : ''}</div></footer>`;
}

function heading(eyebrow, title, body = '') {
  return `<div class="section-head"><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2>${body ? `<p>${esc(body)}</p>` : ''}</div>`;
}

function pageIntro(eyebrow, title, body) {
  return `<section class="page-intro"><div class="container">${heading(eyebrow, title, body)}</div></section>`;
}

function whatsappLink(productName, phone) {
  const whatsappPhone = phone.replace(/[^\d]/g, '');
  const normalizedPhone = whatsappPhone.startsWith('91') ? whatsappPhone : '91' + whatsappPhone;
  const message = `Hello Synnera Mattress LLP, I am interested in your ${productName} for a bulk order. Please share the available specifications, suitable options, wholesale quotation, minimum order quantity and pricing details.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

function renderHome(d) {
  return `<main><section class="hero"><div class="container hero-grid"><div><div class="eyebrow">${esc(d.home.eyebrow)}</div><h1>${esc(d.home.headline)}</h1><h2>${esc(d.home.subheadline)}</h2><p>${esc(d.home.body)}</p><div class="hero-cta"><a class="btn btn-primary" href="/products.html">${esc(d.home.ctaPrimary)}</a><a class="btn btn-secondary" href="/contact.html">${esc(d.home.ctaSecondary)}</a></div></div><div class="hero-visual"><img src="${esc(d.home.heroImage)}" alt="${esc(d.home.headline)}"></div></div></section></main>`;
}

function renderAbout(d) {
  return `<main>${pageIntro(d.about.eyebrow, d.about.title, d.about.body)}<section class="about"><div class="container about-grid"><div class="about-photo"><img src="${esc(d.about.image)}" alt="Synnera Mattress"></div><div>${d.about.stats ? `<div class="stats-grid">${d.about.stats.map(stat => `<div class="stat"><div class="stat-value">${esc(stat.value)}</div><div class="stat-label">${esc(stat.label)}</div></div>`).join('')}</div>` : ''}</div></div></section></main>`;
}

function renderProducts(d) {
  const productCards = d.products.map(p => `<article class="product-card"><div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"></div><div class="product-info"><span class="product-category">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><ul class="product-features">${(p.features || []).map(feature => `<li>${esc(feature.feature || feature)}</li>`).join('')}</ul></div><div class="product-action"><a class="btn btn-primary" href="${whatsappLink(p.title, d.brand.phone)}" rel="noopener noreferrer" target="_blank">Enquire now</a></div></article>`).join('');
  return `<main>${pageIntro(d.productsIntro.eyebrow, d.productsIntro.title, d.productsIntro.body)}<section class="products"><div class="container"><div class="product-grid">${productCards}</div></div></section></main>`;
}

function renderManufacturing(d) {
  return `<main>${pageIntro(d.manufacturing.eyebrow, d.manufacturing.title, d.manufacturing.body)}<section class="manufacturing"><div class="container manufacturing-grid"><div>${heading(d.manufacturing.eyebrow, d.manufacturing.title)}</div><div class="manufacturing-photo"><img src="${esc(d.manufacturing.image)}" alt="Synnera manufacturing"></div></div><div class="container"><div class="steps-grid">${(d.manufacturing.steps || []).map(step => `<div class="step"><div class="step-number">${esc(step.number)}</div><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></div>`).join('')}</div></div></section></main>`;
}

function renderB2b(d) {
  return `<main>${pageIntro(d.capabilities.eyebrow, d.capabilities.title, d.capabilities.body)}<section class="capabilities"><div class="container cap-grid"><div>${heading(d.capabilities.eyebrow, d.capabilities.title)}</div><div><ul class="cap-list">${(d.capabilities.items || []).map(item => `<li>${esc(item.capability || item)}</li>`).join('')}</ul></div></div></section></main>`;
}

function renderHotel(d) {
  const hotelFaq = d.hotelFaq || { items: [] };
  const faqHtml = hotelFaq.items.length > 0 ? `<section class="faq"><div class="container"><div>${heading(hotelFaq.eyebrow, hotelFaq.title)}</div><div class="faq-grid">${hotelFaq.items.map((item, i) => `<article class="faq-item"><details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details></article>`).join('')}</div></div></section>` : '';
  return `<main>${pageIntro(d.hotelIntro.eyebrow, d.hotelIntro.title, d.hotelIntro.body)}<section class="hotel-content"><div class="container"><div class="hotel-grid"><div><h2>Hotel & Hospitality Solutions</h2><p>${esc(d.hotelContent.description)}</p><ul class="cap-list">${(d.hotelContent.applications || []).map(item => `<li>${esc(item.application || item)}</li>`).join('')}</ul></div><div class="contact-box"><h3>${esc(d.hotelContent.enquireText || 'Need a custom hotel mattress solution?')}</h3><div class="contact-actions"><a class="btn btn-whatsapp" href="${whatsappLink('Hotel Mattress', d.brand.phone)}" rel="noopener noreferrer" target="_blank">WhatsApp us</a><a class="btn btn-primary" href="/contact.html">Get a quote</a></div></div></div></div></section>${faqHtml}</main>`;
}

function renderWhy(d) {
  return `<main>${pageIntro(d.why.eyebrow, d.why.title)}<section class="why"><div class="container"><div class="why-grid">${d.why.items.map((x, i) => `<article class="why-card"><div class="why-icon">${i + 1}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div></div></section></main>`;
}

function renderContact(d) {
  return `<main>${pageIntro(d.contact.eyebrow, d.contact.title, d.contact.body)}<section class="contact"><div class="container contact-grid"><div><div class="eyebrow">${esc(d.contact.eyebrow)}</div><h2>${esc(d.contact.formTitle)}</h2><form class="contact-form"><div class="form-group"><label for="name">Name</label><input id="name" type="text" name="name" required></div><div class="form-group"><label for="email">Email</label><input id="email" type="email" name="email" required></div><div class="form-group"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div><button class="btn btn-primary" type="submit">Send enquiry</button></form></div><div class="contact-card"><p><strong>Email:</strong> <a href="mailto:${esc(d.brand.email)}">${esc(d.brand.email)}</a></p><p><strong>Phone:</strong> <a href="tel:${esc(tel(d.brand.phone))}">${esc(d.brand.phone)}</a></p><p><strong>Address:</strong> ${esc(d.brand.address)}</p></div></div></section></main>`;
}

function renderFaq(d) {
  return `<section class="faq"><div class="container"><div>${heading(d.faq.eyebrow, d.faq.title)}</div><div class="faq-grid">${d.faq.items.map((item, i) => `<article class="faq-item"><details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details></article>`).join('')}</div></div></section>`;
}

function renderBlogList(d, posts) {
  const cards = posts.map(post => `
    <article class="blog-card">
      <div class="blog-card-meta">
        <span class="blog-category">${esc(post.category || 'Mattress Guide')}</span>
        <span class="blog-date">${esc(formatDate(post.date))}</span>
        <span class="blog-read">${esc(post.readTime || '')}</span>
      </div>
      <h2 class="blog-card-title"><a href="/blog/${esc(post.slug)}.html">${esc(post.title)}</a></h2>
      <p class="blog-card-desc">${esc(post.description)}</p>
      <a class="blog-read-more" href="/blog/${esc(post.slug)}.html">Read article →</a>
    </article>
  `).join('');
  return `<main>
    ${pageIntro('Synnera Blog', 'Mattress Guides & Sleep Insights', 'Expert articles on orthopedic mattresses, back support, hotel bedding, materials and how to choose the right mattress in India.')}
    <section class="blog-list"><div class="container"><div class="blog-grid">${cards || '<p>No posts published yet.</p>'}</div></div></section>
  </main>`;
}

function renderBlogPost(d, post) {
  if (!post) {
    return `<main><section class="page-intro"><div class="container"><div class="section-head"><h1>Article not found</h1><p><a href="/blog.html">Return to Blog</a></p></div></div></section></main>`;
  }
  return `<main>
    <article class="blog-post">
      <div class="container blog-post-container">
        <header class="blog-post-header">
          <div class="blog-post-meta">
            <a href="/blog.html" class="blog-back">← All articles</a>
            <span class="blog-category">${esc(post.category || 'Mattress Guide')}</span>
            <span class="blog-date">${esc(formatDate(post.date))}</span>
            <span class="blog-read">${esc(post.readTime || '')}</span>
          </div>
          <h1>${esc(post.title)}</h1>
          <p class="blog-post-desc">${esc(post.description)}</p>
        </header>
        <div class="blog-post-content">${post.content}</div>
        <footer class="blog-post-footer">
          <div class="blog-author">
            <strong>Written by ${esc(post.author || 'Synnera Mattress LLP')}</strong>
            <p>Synnera Mattress LLP is a mattress manufacturer based in Rajkot, Gujarat, India, specialising in orthopedic, pocket spring, memory foam and hotel mattresses.</p>
          </div>
          <div class="blog-cta-bottom">
            <a class="btn btn-whatsapp" href="${whatsappLink('Orthopedic Mattress', d.brand.phone)}" rel="noopener noreferrer" target="_blank">💬 Enquire on WhatsApp</a>
            <a class="btn btn-primary" href="/contact.html">Contact Us</a>
            <a class="btn btn-secondary" href="/blog.html">More Articles</a>
          </div>
        </footer>
      </div>
    </article>
  </main>`;
}

async function render(d) {
  document.documentElement.style.setProperty('--purple', d.brand.primaryColor || '#330066');
  document.documentElement.style.setProperty('--gold', d.brand.secondaryColor || '#F4A126');
  let content = '';

  if (isBlogPost || activePage === 'blog') {
    const posts = await loadBlogPosts();
    if (isBlogPost) {
      const post = posts.find(p => p.slug === blogSlug);
      content = renderBlogPost(d, post);
    } else {
      content = renderBlogList(d, posts);
    }
  } else {
    const renderer = { home: renderHome, about: renderAbout, products: renderProducts, manufacturing: renderManufacturing, b2b: renderB2b, hotel: renderHotel, why: renderWhy, contact: renderContact };
    content = renderer[activePage] ? renderer[activePage](d) : renderHome(d);
  }

  const faqHtml = activePage === 'home' && d.faq ? renderFaq(d) : '';
  document.getElementById('app').innerHTML = nav(activePage) + content + faqHtml + footer(d);
  
  // Mobile menu toggle
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.nav-links');
  if (menu && links) {
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

  // FAQ accordion toggle
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const answerId = button.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });
}

loadSite().then(render).catch(err => {
  document.getElementById('app').innerHTML = '<div class="error"><h1>Synnera</h1><p>The website content could not be loaded. Please check that <code>content/site.json</code> exists.</p></div>';
  console.error(err);
});
