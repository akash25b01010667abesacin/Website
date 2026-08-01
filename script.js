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
      showToast('Unable to load products from server.');
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
    showToast('Failed to connect to backend API.');
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
