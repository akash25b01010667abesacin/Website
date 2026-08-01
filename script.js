const USER_KEY = 'chourasiaUser';
const CART_KEY = 'chourasiaCart';
const cartCount = document.getElementById('cart-count');
const year = document.getElementById('year');
const toast = document.getElementById('toast');
const categoryGrid = document.querySelector('.category-grid');
const categoryShowcase = document.getElementById('category-showcase');
const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartSummaryText = document.getElementById('cart-summary-text');
const placeOrderButton = document.getElementById('place-order');
const searchInput = document.getElementById('search-input');
const heroCta = document.getElementById('hero-cta');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navOrders = document.getElementById('nav-orders');
const paymentButtons = document.querySelectorAll('[data-payment]');

let allProducts = [];
let activeCategory = 'All';
let selectedPayment = 'COD';
let cart = {};

const fallbackProducts = [
  { id: 1, name: 'Metallic Balloon Bundle', category: 'Balloons', description: 'Shiny balloon set for party ceilings and entrance decor.', price: 399, emoji: '🎈' },
  { id: 2, name: 'Heart Balloon Arch', category: 'Balloons', description: 'Perfect for birthday photo corners and anniversary celebrations.', price: 699, emoji: '💖' },
  { id: 3, name: 'Kids Comic Balloon Box', category: 'Balloons', description: 'Colourful and playful for children’s birthday setups.', price: 549, emoji: '🧸' },
  { id: 4, name: 'Confetti Balloon Set', category: 'Balloons', description: 'A bright assortment of confetti-filled balloons for birthdays.', price: 479, emoji: '🎊' },
  { id: 5, name: 'Balloon Garland Kit', category: 'Balloons', description: 'Easy-to-build balloon garland for anniversaries and party decor.', price: 639, emoji: '🎀' },
  { id: 6, name: 'Floral Wall Backdrop', category: 'Backdrops', description: 'Elegant flower wall for memorable birthday and anniversary photos.', price: 1199, emoji: '🌸' },
  { id: 7, name: 'Glow Light Backdrop', category: 'Backdrops', description: 'Warm lights and soft texture for evening celebrations.', price: 1499, emoji: '✨' },
  { id: 8, name: 'Custom Name Backdrop', category: 'Backdrops', description: 'Personalized backdrop for birthdays and milestone anniversaries.', price: 1299, emoji: '🖼️' },
  { id: 9, name: 'Anniversary Rose Garland', category: 'Backdrops', description: 'Romantic rose garland backdrop for anniversary photo moments.', price: 1099, emoji: '🌹' },
  { id: 10, name: 'Rose Candle Set', category: 'Candles', description: 'Romantic candle arrangement for anniversaries and dinner decor.', price: 449, emoji: '🕯️' },
  { id: 11, name: 'Number Candles', category: 'Candles', description: 'Bright and festive candles for birthday age themes.', price: 299, emoji: '🔢' },
  { id: 12, name: 'Fairy Light Candles', category: 'Candles', description: 'Soft glowing candles for evening party tables.', price: 379, emoji: '🌟' },
  { id: 13, name: 'Sparkler Candle Kit', category: 'Candles', description: 'Sparkling candle tops for birthday cake celebrations.', price: 329, emoji: '🧨' },
  { id: 14, name: 'Happy Birthday Banner', category: 'Banners', description: 'Bold lettering banner for birthday parties and entryways.', price: 349, emoji: '🎉' },
  { id: 15, name: 'Anniversary Celebration Banner', category: 'Banners', description: 'Stylish banner for milestone anniversary events.', price: 399, emoji: '💞' },
  { id: 16, name: 'Custom Name Banner', category: 'Banners', description: 'Perfect for themed parties and special age celebrations.', price: 429, emoji: '🪧' },
  { id: 17, name: 'Love Script Banner', category: 'Banners', description: 'Elegant anniversary banner with cursive lettering.', price: 459, emoji: '💕' },
  { id: 18, name: 'Centerpiece Flower Box', category: 'Table Decor', description: 'Elegant table setup for home parties and banquet tables.', price: 599, emoji: '💐' },
  { id: 19, name: 'Cake Table Runner', category: 'Table Decor', description: 'Decorative runner for cake display and dessert corners.', price: 329, emoji: '🍰' },
  { id: 20, name: 'Mini Table Lights', category: 'Table Decor', description: 'Soft decorative lights to brighten celebration tables.', price: 279, emoji: '💡' },
  { id: 21, name: 'Milestone Number Stand', category: 'Table Decor', description: 'Stylish number display for birthday and anniversary milestones.', price: 499, emoji: '🔢' },
  { id: 22, name: 'Romantic Dinner Set', category: 'Anniversary Sets', description: 'Decor bundle with candles, flowers, and table accents.', price: 999, emoji: '🥂' },
  { id: 23, name: 'Golden Anniversary Pack', category: 'Anniversary Sets', description: 'Premium decor pieces for milestone anniversary themes.', price: 1249, emoji: '🥇' },
  { id: 24, name: 'Love Letter Decor Box', category: 'Anniversary Sets', description: 'A charming setup with hearts, lights, and elegant textures.', price: 849, emoji: '💌' },
  { id: 25, name: 'Anniversary Champagne Toast Set', category: 'Anniversary Sets', description: 'Decorative glassware and accents for anniversary celebrations.', price: 1099, emoji: '🍾' },
  { id: 26, name: 'Birthday Party Favor Pack', category: 'Party Favors', description: 'Amazing favor boxes for guests at birthday parties.', price: 229, emoji: '🎁' },
  { id: 27, name: 'Heart Shaped Confetti', category: 'Party Favors', description: 'Romantic confetti for anniversary or birthday table scatter.', price: 149, emoji: '❤️' },
  { id: 28, name: 'Luxury Gift Wrap Set', category: 'Gift Wrap', description: 'Premium wrapping paper and ribbons for birthday and anniversary gifts.', price: 499, emoji: '🎀' },
  { id: 29, name: 'Anniversary Card Set', category: 'Stationery', description: 'Set of elegant anniversary cards for special messages.', price: 299, emoji: '✉️' },
  { id: 30, name: 'Birthday Cake Topper', category: 'Cake Accessories', description: 'Stylish cake topper for birthday celebrations.', price: 259, emoji: '🍰' },
  { id: 31, name: 'Sparkling Table Garland', category: 'Lighting', description: 'Twinkling lights for birthday and anniversary decor.', price: 399, emoji: '✨' }
];

function getCategories(products) {
  return Array.from(new Set(products.map((product) => product.category))).sort();
}

function useFallbackCatalog() {
  allProducts = fallbackProducts;
  const categories = getCategories(allProducts);
  renderCategories(['All', ...categories]);
  renderProducts();
  if (heroCta && allProducts.length) {
    heroCta.addEventListener('click', () => addToCart(allProducts[0].id));
  }
  showToast('Loaded static product catalog.');
}

function loadUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
}

function getCartTotals() {
  const items = Object.values(cart);
  return items.reduce(
    (acc, item) => {
      acc.count += item.quantity;
      acc.total += item.product.price * item.quantity;
      return acc;
    },
    { count: 0, total: 0 }
  );
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1400);
}

function updateNav() {
  const user = loadUser();
  if (!navLogin || !navRegister || !navOrders) return;

  if (user) {
    navLogin.textContent = 'Logout';
    navLogin.href = '#';
    navRegister.style.display = 'none';
    navOrders.style.display = 'inline-flex';
    navLogin.onclick = (event) => {
      event.preventDefault();
      localStorage.removeItem(USER_KEY);
      showToast('Logged out successfully');
      setTimeout(() => window.location.reload(), 300);
    };
  } else {
    navLogin.textContent = 'Login';
    navLogin.href = 'login.html';
    navRegister.style.display = 'inline-flex';
    navOrders.style.display = 'none';
    navLogin.onclick = null;
  }
}

function renderCategories(categories) {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <button class="category-pill ${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>
      `
    )
    .join('');

  document.querySelectorAll('.category-pill').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.getAttribute('data-category');
      renderCategories(categories);
      renderProducts();
      showToast(`${activeCategory} products loaded`);
    });
  });
}

function renderProducts() {
  if (!productsGrid) return;

  const query = searchInput?.value.trim().toLowerCase() || '';
  const visibleProducts = allProducts.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (!visibleProducts.length) {
    productsGrid.innerHTML = '<p class="empty-state">No products match your selection.</p>';
    return;
  }

  productsGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-visual">${product.emoji}</div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-footer">
            <strong>₹${product.price}</strong>
            <button class="btn btn-primary" data-product-id="${product.id}">Add to cart</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-product-id');
      addToCart(Number(id));
    });
  });
}

function renderCart() {
  const totals = getCartTotals();
  cartCount.textContent = totals.count;
  cartSummaryText.textContent = `${totals.count} item${totals.count !== 1 ? 's' : ''} • Total ₹${totals.total}`;

  if (!cartItemsContainer) return;

  const items = Object.values(cart);
  if (!items.length) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty. Add items from the offers above.</p>';
    placeOrderButton.disabled = true;
    return;
  }

  placeOrderButton.disabled = false;
  cartItemsContainer.innerHTML = items
    .map(
      (cartEntry) => `
        <div class="cart-item">
          <div>
            <strong>${cartEntry.product.name}</strong>
            <p>${cartEntry.product.category} • ₹${cartEntry.product.price} each</p>
          </div>
          <div class="cart-item-meta">
            <span>${cartEntry.quantity} × ₹${cartEntry.product.price}</span>
            <button class="btn btn-secondary remove-cart" data-product-id="${cartEntry.product.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.remove-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.getAttribute('data-product-id'));
      removeFromCart(id);
    });
  });
}

function addToCart(productId) {
  const product = allProducts.find((item) => item.id === productId);
  if (!product) {
    showToast('Product not found.');
    return;
  }

  cart[productId] = cart[productId] || { product, quantity: 0 };
  cart[productId].quantity += 1;
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  if (!cart[productId]) return;
  delete cart[productId];
  saveCart();
  renderCart();
  showToast('Item removed from cart');
}

async function loadProducts() {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/products')
    ]);

    if (!categoriesResponse.ok || !productsResponse.ok) {
      console.warn('API fetch failed, falling back to static catalog');
      useFallbackCatalog();
      return;
    }

    const categories = await categoriesResponse.json();
    allProducts = await productsResponse.json();
    renderCategories(['All', ...categories]);
    renderProducts();

    if (heroCta && allProducts.length) {
      heroCta.addEventListener('click', () => addToCart(allProducts[0].id));
    }
  } catch (error) {
    console.warn('Backend API unavailable, loading static product catalog:', error);
    useFallbackCatalog();
  }
}

async function submitOrder() {
  const user = loadUser();
  if (!user) {
    showToast('Please login to place your order.');
    window.location.href = 'login.html';
    return;
  }

  const items = Object.values(cart).map((entry) => ({
    productId: entry.product.id,
    quantity: entry.quantity,
    price: entry.product.price
  }));

  if (!items.length) {
    showToast('Your cart is empty.');
    return;
  }

  placeOrderButton.disabled = true;
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: user.email,
        paymentMethod: selectedPayment,
        items
      })
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(data.error || 'Unable to place order.');
      placeOrderButton.disabled = false;
      return;
    }

    cart = {};
    saveCart();
    renderCart();
    showToast('Order placed successfully!');
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 900);
  } catch (error) {
    showToast('Order failed. Please try again later.');
    placeOrderButton.disabled = false;
  }
}

function setupPaymentButtons() {
  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      paymentButtons.forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      selectedPayment = button.getAttribute('data-payment');
      showToast(`${selectedPayment === 'UPI' ? 'UPI' : 'Cash on Delivery'} selected`);
    });
  });
}

searchInput?.addEventListener('input', () => renderProducts());
placeOrderButton?.addEventListener('click', submitOrder);

cart = loadCart();
updateNav();
renderCart();
setupPaymentButtons();
loadProducts();
if (year) year.textContent = new Date().getFullYear();
