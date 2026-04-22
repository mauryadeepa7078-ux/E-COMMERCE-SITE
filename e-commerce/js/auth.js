/* ===== AUTH MODULE ===== */
const Auth = {
  USERS_KEY: 'ecommerce_users',
  SESSION_KEY: 'ecommerce_session',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
  },
  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this.updateUI();
  },
  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    this.updateUI();
  },

  register(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      Notify.error('An account with this email already exists.');
      return false;
    }
    const user = { id: Date.now(), name, email, password, role: 'customer', createdAt: new Date().toISOString(), orders: [], wishlist: [] };
    users.push(user);
    this.saveUsers(users);
    this.setSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    Notify.success(`Welcome, ${name}! Account created.`);
    closeModal();
    return true;
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      Notify.error('Invalid email or password.');
      return false;
    }
    this.setSession({ id: user.id, name: user.name, email: user.email, role: user.role });
    Notify.success(`Welcome back, ${user.name}!`);
    closeModal();
    return true;
  },

  logout() {
    this.clearSession();
    Notify.info('You have been logged out.');
    navigateTo('home');
  },

  updateUI() {
    const user = this.getCurrentUser();
    const userBtn = document.getElementById('user-btn');
    const userActions = document.getElementById('user-actions');
    if (user) {
      userBtn.innerHTML = `
        <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
        <span class="user-name">${user.name.split(' ')[0]}</span>
      `;
      if (userActions) userActions.innerHTML = `
        <a href="#" onclick="navigateTo('orders'); return false;">My Orders</a>
        <a href="#" onclick="Auth.logout(); return false;">Logout</a>
      `;
    } else {
      userBtn.innerHTML = `
        <div class="avatar">👤</div>
        <span class="user-name">Sign In</span>
      `;
      if (userActions) userActions.innerHTML = '';
    }
  }
};

/* ===== ORDERS MODULE ===== */
const Orders = {
  KEY: 'ecommerce_orders',

  getOrders() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  },
  saveOrders(orders) {
    localStorage.setItem(this.KEY, JSON.stringify(orders));
  },

  placeOrder(shippingInfo) {
    const user = Auth.getCurrentUser();
    if (!user) { Notify.error('Please sign in to place an order.'); return null; }
    const cartItems = Cart.getItems();
    if (cartItems.length === 0) { Notify.error('Your cart is empty.'); return null; }

    const items = cartItems.map(ci => {
      const p = getProductById(ci.id);
      return { ...ci, name: p.name, price: p.price, emoji: p.emoji };
    });
    const subtotal = Cart.getTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;

    const order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      userId: user.id,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      shippingInfo,
      status: 'processing',
      statusHistory: [
        { status: 'Order Placed', time: new Date().toISOString(), completed: true },
        { status: 'Processing', time: '', completed: false },
        { status: 'Shipped', time: '', completed: false },
        { status: 'Out for Delivery', time: '', completed: false },
        { status: 'Delivered', time: '', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // Update stock
    cartItems.forEach(ci => {
      const p = getProductById(ci.id);
      if (p) p.stock = Math.max(0, p.stock - ci.qty);
    });

    Cart.clear();
    return order;
  },

  getUserOrders() {
    const user = Auth.getCurrentUser();
    if (!user) return [];
    return this.getOrders().filter(o => o.userId === user.id);
  }
};

/* ===== NOTIFICATION SYSTEM ===== */
const Notify = {
  container: null,
  init() {
    this.container = document.getElementById('notifications');
  },
  show(message, type = 'info', duration = 4000) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.innerHTML = `
      <span class="notif-icon">${icons[type]}</span>
      <span class="notif-message">${message}</span>
      <button class="notif-close" onclick="this.parentElement.remove()">✕</button>
    `;
    this.container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(120%)'; setTimeout(() => el.remove(), 300); }, duration);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); }
};
