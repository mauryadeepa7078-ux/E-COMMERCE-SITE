/* ===== CART MODULE ===== */
const Cart = {
  KEY: 'ecommerce_cart',
  
  getItems() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateUI();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
  },

  addItem(productId, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === productId);
    const product = getProductById(productId);
    if (!product) return;
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      items.push({ id: productId, qty: Math.min(qty, product.stock) });
    }
    this.save(items);
    Notify.success(`${product.name} added to cart!`);
    // Animate cart icon
    const badge = document.querySelector('#cart-btn .badge');
    if (badge) { badge.classList.remove('bounce'); void badge.offsetWidth; badge.classList.add('bounce'); }
  },

  removeItem(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    this.save(items);
  },

  updateQty(productId, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === productId);
    if (item) {
      if (qty <= 0) { this.removeItem(productId); return; }
      const product = getProductById(productId);
      item.qty = Math.min(qty, product ? product.stock : 99);
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateUI();
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => {
      const p = getProductById(i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  },

  updateUI() {
    const countEls = document.querySelectorAll('.cart-count');
    const count = this.getCount();
    countEls.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* ===== CART SIDEBAR RENDERER ===== */
function renderCartSidebar() {
  const itemsContainer = document.getElementById('cart-items');
  const footerEl = document.getElementById('cart-footer');
  const items = Cart.getItems();

  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-top:8px;color:var(--text-muted);">Start shopping to add items</p>
      </div>
    `;
    footerEl.innerHTML = '';
    return;
  }

  itemsContainer.innerHTML = items.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-img"><img src="${p.imageSmall}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"></div>
        <div class="cart-item-info">
          <div class="cart-item-title">${p.name}</div>
          <div class="cart-item-price">$${p.price.toFixed(2)}</div>
          <div class="cart-item-qty">
            <button onclick="Cart.updateQty(${p.id}, ${item.qty - 1}); renderCartSidebar();">−</button>
            <span>${item.qty}</span>
            <button onclick="Cart.updateQty(${p.id}, ${item.qty + 1}); renderCartSidebar();">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem(${p.id}); renderCartSidebar();">✕</button>
      </div>
    `;
  }).join('');

  const subtotal = Cart.getTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  footerEl.innerHTML = `
    <div class="cart-subtotal"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="cart-subtotal"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
    <div class="cart-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    <button class="btn btn-primary" style="width:100%" onclick="navigateTo('checkout')">Proceed to Checkout</button>
    <button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="toggleCart()">Continue Shopping</button>
  `;
}

function toggleCart() {
  const overlay = document.getElementById('cart-overlay');
  const sidebar = document.getElementById('cart-sidebar');
  const isActive = sidebar.classList.contains('active');
  if (isActive) {
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    renderCartSidebar();
    overlay.classList.add('active');
    sidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
