/* ===== MAIN APPLICATION ===== */

/* --- Router --- */
function navigateTo(page, params = {}) {
  const hash = page === 'home' ? '' : page;
  const qp = Object.entries(params).map(([k,v]) => `${k}=${v}`).join('&');
  window.location.hash = hash + (qp ? '?' + qp : '');
}

function getHashRoute() {
  const hash = window.location.hash.slice(1);
  const [page, query] = hash.split('?');
  const params = {};
  if (query) query.split('&').forEach(p => { const [k,v] = p.split('='); params[k] = decodeURIComponent(v); });
  return { page: page || 'home', params };
}

function router() {
  const { page, params } = getHashRoute();
  const app = document.getElementById('app');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // close cart if open
  document.getElementById('cart-overlay')?.classList.remove('active');
  document.getElementById('cart-sidebar')?.classList.remove('active');
  document.body.style.overflow = '';

  switch(page) {
    case 'home': renderHome(app); break;
    case 'category': renderCategory(app, params.id); break;
    case 'product': renderProduct(app, parseInt(params.id)); break;
    case 'search': renderSearch(app, params.q); break;
    case 'checkout': renderCheckout(app); break;
    case 'orders': renderOrders(app); break;
    case 'order-success': renderOrderSuccess(app, params.id); break;
    default: renderHome(app);
  }
}

/* --- Helpers --- */
function starHTML(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += i <= Math.round(rating) ? '★' : '☆';
  return s;
}

function productCardHTML(p) {
  return `
    <div class="product-card" onclick="navigateTo('product', {id: ${p.id}})">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#1a1a2e,#2d1b69)';">
        <div class="product-badges">
          ${p.badges.map(b => `<span class="product-badge ${b}">${b}</span>`).join('')}
        </div>
        <div class="quick-actions">
          <button class="quick-action-btn" title="Quick View" onclick="event.stopPropagation(); navigateTo('product', {id: ${p.id}})">👁️</button>
          <button class="quick-action-btn" title="Add to Cart" onclick="event.stopPropagation(); Cart.addItem(${p.id})">🛒</button>
          <button class="quick-action-btn" title="Wishlist" onclick="event.stopPropagation(); Notify.info('Added to wishlist!')">❤️</button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${p.categoryName}</div>
        <div class="product-card-title">${p.name}</div>
        <div class="product-card-rating">
          <span class="stars">${starHTML(p.rating)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-card-footer">
          <div class="product-price">
            $${p.price.toFixed(2)}
            ${p.discount ? `<span class="original">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); Cart.addItem(${p.id})">Add +</button>
        </div>
      </div>
    </div>
  `;
}

/* ===== PAGE RENDERERS ===== */

function renderHome(app) {
  const featured = getFeaturedProducts(8);
  const deals = getDeals(8);
  const newest = ALL_PRODUCTS.filter(p => p.badges.includes('new')).slice(0, 8);

  app.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-particles" id="hero-particles"></div>
      <div class="container" style="display:flex;align-items:center;gap:60px;">
        <div class="hero-content">
          <div class="hero-badge"><span class="dot"></span> Now Live — Spring Collection 2026</div>
          <h1>Discover <span class="gradient-text">Premium</span> Products</h1>
          <p>Explore our curated collection of 1,000+ premium products across 10 categories. From cutting-edge electronics to artisan home décor.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="document.getElementById('featured-section').scrollIntoView({behavior:'smooth'})">
              Shop Now →
            </button>
            <button class="btn btn-secondary btn-lg" onclick="navigateTo('category', {id:'electronics'})">
              Browse Categories
            </button>
          </div>
          <div class="hero-stats">
            <div class="hero-stat"><h3 class="gradient-text">1,000+</h3><p>Products</p></div>
            <div class="hero-stat"><h3 class="gradient-text">10</h3><p>Categories</p></div>
            <div class="hero-stat"><h3 class="gradient-text">50K+</h3><p>Happy Customers</p></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-grid-preview">
            ${featured.slice(0,4).map(p => `
              <div class="preview-card" onclick="navigateTo('product', {id:${p.id}})">
                <div class="preview-card-img"><img src="${p.imageSmall}" alt="${p.name}" loading="lazy"></div>
                <div class="preview-card-title">${p.name}</div>
                <div class="preview-card-price">$${p.price.toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section" style="padding-top:48px;">
      <div class="container">
        <div class="section-header">
          <div><h2>Shop by Category</h2><p>Browse our diverse collection</p></div>
        </div>
        <div class="categories-grid">
          ${CATEGORIES.map(c => {
            const exactPool = (typeof EXACT_PRODUCTS !== 'undefined') ? EXACT_PRODUCTS.filter(p => p.category === c.id) : [];
            const imgUrl = exactPool.length > 0 ? exactPool[0].image : `https://picsum.photos/seed/cat_${c.id}/600/400`;
            return `
            <div class="category-card" onclick="navigateTo('category', {id:'${c.id}'})">
              <img src="${imgUrl}" alt="${c.name}" class="category-card-img" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg, #7c3aed, #ec4899)'">
              <div class="category-card-overlay"></div>
              <div class="category-card-content">
                <span class="category-card-icon">${c.icon}</span>
                <h3 class="category-card-title">${c.name}</h3>
                <p class="category-card-desc">${c.description}</p>
                <span class="category-card-count">20 Products</span>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- FEATURED -->
    <section class="section" id="featured-section">
      <div class="container">
        <div class="section-header">
          <div><h2>🔥 Featured Products</h2><p>Top picks curated just for you</p></div>
          <a href="#" class="view-all" onclick="navigateTo('category', {id:'electronics'}); return false;">View All →</a>
        </div>
        <div class="products-grid">${featured.map(productCardHTML).join('')}</div>
      </div>
    </section>

    <!-- PROMO BANNER -->
    <section class="section" style="padding:40px 0;">
      <div class="container">
        <div class="promo-banner">
          <div style="position:relative;z-index:2;">
            <h2>🎉 Spring Sale — Up to 40% Off</h2>
            <p>Massive discounts on electronics, fashion, and home essentials. Limited time only!</p>
            <button class="btn btn-secondary btn-lg" style="background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);" onclick="navigateTo('search', {q:'sale'})">
              Shop the Sale →
            </button>
          </div>
          <div style="font-size:6rem;position:relative;z-index:2;animation:float 3s ease-in-out infinite;">🛍️</div>
        </div>
      </div>
    </section>

    <!-- DEALS -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div><h2>💰 Best Deals</h2><p>Incredible savings you don't want to miss</p></div>
        </div>
        <div class="products-grid">${deals.map(productCardHTML).join('')}</div>
      </div>
    </section>

    <!-- NEW ARRIVALS -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div><h2>✨ New Arrivals</h2><p>Just landed in our store</p></div>
        </div>
        <div class="products-grid">${newest.map(productCardHTML).join('')}</div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section">
      <div class="container">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
          ${[
            {icon:'🚀',title:'Free Shipping',desc:'On orders over $50'},
            {icon:'🔒',title:'Secure Payment',desc:'256-bit SSL encryption'},
            {icon:'↩️',title:'Easy Returns',desc:'30-day return policy'},
            {icon:'💬',title:'24/7 Support',desc:'Always here to help'},
          ].map(f => `
            <div class="trust-feature-card">
              <div style="font-size:2.2rem;margin-bottom:14px;">${f.icon}</div>
              <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:6px;">${f.title}</h3>
              <p style="font-size:0.84rem;color:var(--text-secondary);">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Animate hero particles
  createParticles();
}

function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(p);
  }
}

function renderCategory(app, catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) { renderHome(app); return; }
  const products = getProductsByCategory(catId);
  let sortBy = 'default';

  app.innerHTML = `
    <section class="section" style="padding-top:100px;">
      <div class="container">
        <div style="margin-bottom:32px;">
          <a href="#" onclick="navigateTo('home'); return false;" style="color:var(--text-muted);font-size:0.85rem;">Home</a>
          <span style="color:var(--text-muted);margin:0 8px;">›</span>
          <span style="color:var(--accent-light);font-size:0.85rem;">${cat.name}</span>
        </div>
        <div class="section-header">
          <div>
            <h2>${cat.icon} ${cat.name}</h2>
            <p>${cat.description} — ${products.length} products</p>
          </div>
          <select id="sort-select" onchange="sortProducts(this.value)" style="padding:10px 16px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);color:var(--text-primary);font-size:0.85rem;">
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <div class="products-grid" id="products-container">
          ${products.slice(0, 20).map(productCardHTML).join('')}
        </div>
        <div style="text-align:center;margin-top:40px;" id="load-more-container">
          <button class="btn btn-secondary" id="load-more-btn" onclick="loadMoreProducts()">
            Load More Products (${Math.min(20, products.length)} of ${products.length})
          </button>
        </div>
      </div>
    </section>
  `;

  // Store state for sorting/load-more
  window._catProducts = products;
  window._catShown = 20;
}

function loadMoreProducts() {
  const container = document.getElementById('products-container');
  const next = window._catProducts.slice(window._catShown, window._catShown + 20);
  container.innerHTML += next.map(productCardHTML).join('');
  window._catShown += 20;
  const btn = document.getElementById('load-more-btn');
  if (window._catShown >= window._catProducts.length) {
    document.getElementById('load-more-container').innerHTML = '<p style="color:var(--text-muted);">All products loaded</p>';
  } else {
    btn.textContent = `Load More Products (${window._catShown} of ${window._catProducts.length})`;
  }
}

function sortProducts(by) {
  let sorted = [...window._catProducts];
  switch(by) {
    case 'price-low': sorted.sort((a,b) => a.price - b.price); break;
    case 'price-high': sorted.sort((a,b) => b.price - a.price); break;
    case 'rating': sorted.sort((a,b) => b.rating - a.rating); break;
    case 'newest': sorted.sort((a,b) => b.id - a.id); break;
  }
  window._catProducts = sorted;
  window._catShown = 20;
  document.getElementById('products-container').innerHTML = sorted.slice(0, 20).map(productCardHTML).join('');
  document.getElementById('load-more-btn').textContent = `Load More Products (20 of ${sorted.length})`;
}

function renderProduct(app, id) {
  const p = getProductById(id);
  if (!p) { renderHome(app); return; }
  const related = getRecommendations(id, 4);
  const reviews = generateReviews(id);

  app.innerHTML = `
    <section class="product-detail">
      <div class="container">
        <div style="margin-bottom:32px">
          <a href="#" onclick="navigateTo('home'); return false;" style="color:var(--text-muted);font-size:0.85rem;">Home</a>
          <span style="color:var(--text-muted);margin:0 8px;">›</span>
          <a href="#" onclick="navigateTo('category', {id:'${p.category}'}); return false;" style="color:var(--text-muted);font-size:0.85rem;">${p.categoryName}</a>
          <span style="color:var(--text-muted);margin:0 8px;">›</span>
          <span style="color:var(--accent-light);font-size:0.85rem;">${p.name}</span>
        </div>
        <div class="product-detail-grid">
          <div class="product-gallery">
            <div class="product-main-image" id="main-image"><img src="${p.images[0]}" alt="${p.name}"></div>
            <div class="product-thumbnails">
              ${p.images.map((img, i) => `
                <div class="product-thumb ${i===0?'active':''}" onclick="document.getElementById('main-image').querySelector('img').src='${img}'; document.querySelectorAll('.product-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');"><img src="${img}" alt="View ${i+1}" loading="lazy"></div>
              `).join('')}
            </div>
          </div>
          <div class="product-info animate-fade-up">
            <h1>${p.name}</h1>
            <div class="product-meta">
              <span class="product-meta-item"><span>⭐</span> ${p.rating} (${p.reviews} reviews)</span>
              <span class="product-meta-item"><span>🏷️</span> ${p.brand}</span>
              <span class="product-meta-item"><span>${p.stock > 10 ? '✅' : '⚠️'}</span> ${p.stock > 10 ? 'In Stock' : 'Only ' + p.stock + ' left!'}</span>
            </div>
            <div class="price-section">
              <span class="current-price gradient-text">$${p.price.toFixed(2)}</span>
              ${p.discount ? `<span class="old-price">$${p.originalPrice.toFixed(2)}</span><span class="discount-tag">-${p.discount}%</span>` : ''}
            </div>
            <p class="product-description">${p.description}</p>
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="qty-controls">
                <button class="qty-btn" onclick="let v=document.getElementById('qty-val'); v.textContent=Math.max(1,parseInt(v.textContent)-1);">−</button>
                <span class="qty-value" id="qty-val">1</span>
                <button class="qty-btn" onclick="let v=document.getElementById('qty-val'); v.textContent=Math.min(${p.stock},parseInt(v.textContent)+1);">+</button>
              </div>
            </div>
            <div class="product-actions">
              <button class="btn btn-primary btn-lg" onclick="Cart.addItem(${p.id}, parseInt(document.getElementById('qty-val').textContent))">
                🛒 Add to Cart
              </button>
              <button class="btn btn-outline btn-lg" onclick="Notify.info('Added to wishlist!')">
                ❤️ Wishlist
              </button>
            </div>
            <div class="product-features">
              ${p.features.map(f => `
                <div class="feature-item"><span class="feature-icon">✓</span><span>${f}</span></div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- REVIEWS -->
        <div class="reviews-section">
          <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:24px;">Customer Reviews</h2>
          ${reviews.map(r => `
            <div class="review-card">
              <div class="review-header">
                <div class="review-avatar">${r.author.charAt(0)}</div>
                <div><div class="review-author">${r.author}</div><div class="review-date">${r.date}</div></div>
              </div>
              <div class="review-stars">${starHTML(r.rating)}</div>
              <p class="review-text">${r.text}</p>
            </div>
          `).join('')}
        </div>

        <!-- RELATED -->
        <div style="margin-top:60px;">
          <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:24px;">Recommended For You</h2>
          <div class="products-grid">${related.map(productCardHTML).join('')}</div>
        </div>
      </div>
    </section>
  `;
}

function renderSearch(app, query) {
  const results = searchProducts(query || '');
  app.innerHTML = `
    <section class="section" style="padding-top:100px;">
      <div class="container">
        <div class="section-header">
          <div><h2>Search Results for "${query || ''}"</h2><p>${results.length} products found</p></div>
        </div>
        ${results.length ? `<div class="products-grid">${results.map(productCardHTML).join('')}</div>` :
          `<div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
            <div style="font-size:4rem;margin-bottom:16px;">🔍</div>
            <h3>No products found</h3>
            <p style="margin-top:8px;">Try a different search term</p>
          </div>`
        }
      </div>
    </section>
  `;
}

function renderCheckout(app) {
  const user = Auth.getCurrentUser();
  const items = Cart.getItems();
  if (items.length === 0) { navigateTo('home'); Notify.warning('Your cart is empty.'); return; }
  if (!user) { showAuthModal('login'); Notify.warning('Please sign in to checkout.'); return; }

  const subtotal = Cart.getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  app.innerHTML = `
    <section class="section">
      <div class="container">
        <h1 style="font-size:2rem;font-weight:800;margin-bottom:32px;padding-top:72px;">Checkout</h1>
        <div class="checkout-grid">
          <div>
            <div class="checkout-section">
              <h3><span class="step-number">1</span> Shipping Information</h3>
              <div class="form-row">
                <div class="form-group"><label>First Name</label><input id="ship-fname" placeholder="John"></div>
                <div class="form-group"><label>Last Name</label><input id="ship-lname" placeholder="Doe"></div>
              </div>
              <div class="form-group"><label>Email</label><input id="ship-email" value="${user.email}" type="email"></div>
              <div class="form-group"><label>Address</label><input id="ship-address" placeholder="123 Main Street"></div>
              <div class="form-row">
                <div class="form-group"><label>City</label><input id="ship-city" placeholder="New York"></div>
                <div class="form-group"><label>Zip Code</label><input id="ship-zip" placeholder="10001"></div>
              </div>
              <div class="form-group"><label>Phone</label><input id="ship-phone" placeholder="+1 (555) 000-0000"></div>
            </div>
            <div class="checkout-section">
              <h3><span class="step-number">2</span> Payment Method</h3>
              <div class="form-group"><label>Card Number</label><input id="pay-card" placeholder="4242 4242 4242 4242" maxlength="19"></div>
              <div class="form-row">
                <div class="form-group"><label>Expiry</label><input id="pay-exp" placeholder="MM/YY" maxlength="5"></div>
                <div class="form-group"><label>CVV</label><input id="pay-cvv" placeholder="123" maxlength="4" type="password"></div>
              </div>
            </div>
          </div>
          <div class="order-summary">
            <h3>Order Summary</h3>
            ${items.map(i => { const p = getProductById(i.id); return p ? `
              <div class="summary-item">
                <div style="display:flex;align-items:center;gap:12px;">
                  <img src="${p.imageSmall}" alt="${p.name}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;">
                  <div><div style="font-size:0.85rem;font-weight:600;">${p.name}</div><div style="font-size:0.78rem;color:var(--text-muted);">Qty: ${i.qty}</div></div>
                </div>
                <span style="font-weight:700;">$${(p.price * i.qty).toFixed(2)}</span>
              </div>
            ` : '' }).join('')}
            <div class="summary-item"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-item"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$'+shipping.toFixed(2)}</span></div>
            <div class="summary-item"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="summary-item summary-total"><span>Total</span><span class="gradient-text">$${total.toFixed(2)}</span></div>
            <button class="btn btn-primary btn-lg" style="width:100%;margin-top:20px;" onclick="handlePlaceOrder()">
              Place Order — $${total.toFixed(2)}
            </button>
            <p style="text-align:center;margin-top:12px;font-size:0.78rem;color:var(--text-muted);">🔒 Secured with 256-bit SSL encryption</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function handlePlaceOrder() {
  const fname = document.getElementById('ship-fname')?.value;
  const lname = document.getElementById('ship-lname')?.value;
  const address = document.getElementById('ship-address')?.value;
  if (!fname || !lname || !address) { Notify.error('Please fill in all shipping fields.'); return; }

  const shipping = { name: fname + ' ' + lname, email: document.getElementById('ship-email')?.value, address, city: document.getElementById('ship-city')?.value, zip: document.getElementById('ship-zip')?.value, phone: document.getElementById('ship-phone')?.value };
  const order = Orders.placeOrder(shipping);
  if (order) {
    navigateTo('order-success', { id: order.id });
  }
}

function renderOrderSuccess(app, orderId) {
  app.innerHTML = `
    <section class="section" style="padding-top:120px;text-align:center;">
      <div class="container" style="max-width:600px;">
        <div style="font-size:5rem;margin-bottom:24px;animation:cartBounce 0.6s ease;">✅</div>
        <h1 style="font-size:2rem;font-weight:800;margin-bottom:16px;">Order Placed Successfully!</h1>
        <p style="color:var(--text-secondary);font-size:1.05rem;margin-bottom:12px;">Thank you for your purchase.</p>
        <p style="color:var(--accent-light);font-weight:700;font-size:1.1rem;margin-bottom:40px;">Order ID: ${orderId}</p>
        <div style="display:flex;gap:16px;justify-content:center;">
          <button class="btn btn-primary" onclick="navigateTo('orders')">View My Orders</button>
          <button class="btn btn-secondary" onclick="navigateTo('home')">Continue Shopping</button>
        </div>
      </div>
    </section>
  `;
}

function renderOrders(app) {
  const user = Auth.getCurrentUser();
  if (!user) { showAuthModal('login'); Notify.warning('Please sign in.'); return; }
  const orders = Orders.getUserOrders();

  app.innerHTML = `
    <section class="orders-page">
      <div class="container">
        <h1 style="font-size:2rem;font-weight:800;margin-bottom:32px;">My Orders</h1>
        ${orders.length === 0 ? `
          <div style="text-align:center;padding:80px 20px;color:var(--text-muted);">
            <div style="font-size:4rem;margin-bottom:16px;">📦</div>
            <h3>No orders yet</h3>
            <p style="margin-top:8px;">Start shopping to place your first order!</p>
            <button class="btn btn-primary" style="margin-top:24px;" onclick="navigateTo('home')">Shop Now</button>
          </div>
        ` : orders.map(o => `
          <div class="order-card">
            <div class="order-card-header">
              <div>
                <div style="font-weight:700;">${o.id}</div>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">${new Date(o.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</div>
              </div>
              <span class="order-status ${o.status}">${o.status}</span>
            </div>
            <div class="order-items-preview">
              ${o.items.map(i => { const p = getProductById(i.id); const imgSrc = p ? p.imageSmall : 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=60&h=60&fit=crop'; return `<div class="order-preview-img"><img src="${imgSrc}" alt="${i.name}" style="width:100%;height:100%;object-fit:cover;"></div>`; }).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
              <span style="font-weight:700;font-size:1.1rem;">$${o.total.toFixed(2)}</span>
              <span style="font-size:0.85rem;color:var(--text-muted);">${o.items.length} item(s)</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

/* ===== AUTH MODAL ===== */
function showAuthModal(mode = 'login') {
  const overlay = document.getElementById('auth-modal');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderAuthForm(mode);
}
function closeModal() {
  document.getElementById('auth-modal').classList.remove('active');
  document.body.style.overflow = '';
}
function renderAuthForm(mode) {
  const modal = document.querySelector('#auth-modal .modal');
  if (mode === 'login') {
    modal.innerHTML = `
      <h2>Welcome Back</h2>
      <p class="modal-subtitle">Sign in to your account</p>
      <div class="form-group"><label>Email</label><input id="auth-email" type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input id="auth-pass" type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" style="width:100%;" onclick="Auth.login(document.getElementById('auth-email').value, document.getElementById('auth-pass').value)">Sign In</button>
      <div class="auth-switch">Don't have an account? <a onclick="renderAuthForm('register')">Sign Up</a></div>
    `;
  } else {
    modal.innerHTML = `
      <h2>Create Account</h2>
      <p class="modal-subtitle">Join us and start shopping</p>
      <div class="form-group"><label>Full Name</label><input id="auth-name" placeholder="John Doe"></div>
      <div class="form-group"><label>Email</label><input id="auth-email" type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input id="auth-pass" type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" style="width:100%;" onclick="Auth.register(document.getElementById('auth-name').value, document.getElementById('auth-email').value, document.getElementById('auth-pass').value)">Create Account</button>
      <div class="auth-switch">Already have an account? <a onclick="renderAuthForm('login')">Sign In</a></div>
    `;
  }
}

/* ===== SEARCH ===== */
function initSearch() {
  const input = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  if (!input) return;
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { suggestions.classList.remove('active'); return; }
      const results = searchProducts(q).slice(0, 6);
      if (results.length === 0) { suggestions.classList.remove('active'); return; }
      suggestions.innerHTML = results.map(p => `
        <div class="search-suggestion-item" onclick="navigateTo('product', {id:${p.id}}); suggestions.classList.remove('active'); input.value='';">
          <img src="${p.imageSmall}" alt="${p.name}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;">
          <div>
            <div style="font-weight:600;font-size:0.85rem;">${p.name}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${p.categoryName} — $${p.price.toFixed(2)}</div>
          </div>
        </div>
      `).join('');
      suggestions.classList.add('active');
    }, 200);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { navigateTo('search', {q: input.value}); suggestions.classList.remove('active'); input.value = ''; }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar-search')) suggestions.classList.remove('active');
  });
}

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-theme');
  localStorage.setItem('novamart-theme', isLight ? 'light' : 'dark');
  const icon = document.querySelector('#theme-toggle .theme-icon');
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem('novamart-theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    const icon = document.querySelector('#theme-toggle .theme-icon');
    if (icon) icon.textContent = '☀️';
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  Notify.init();
  Cart.updateUI();
  Auth.updateUI();
  initSearch();
  router();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 20);
  });

  // User button click
  document.getElementById('user-btn')?.addEventListener('click', () => {
    const user = Auth.getCurrentUser();
    if (user) { navigateTo('orders'); } else { showAuthModal('login'); }
  });

  window.addEventListener('hashchange', router);
});
