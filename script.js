const cartCount = document.getElementById('cart-count');
const year = document.getElementById('year');
const toast = document.getElementById('toast');
const categoryShowcase = document.getElementById('category-showcase');
const categoryButtons = document.querySelectorAll('.category-pill');

let count = 0;

const categoryProducts = {
  Balloons: [
    { name: 'Metallic Balloon Bundle', desc: 'Shiny balloon set for party ceilings and entrance decor.', price: '₹399', emoji: '🎈' },
    { name: 'Heart Balloon Arch', desc: 'Perfect for birthday photo corners and anniversary celebrations.', price: '₹699', emoji: '💖' },
    { name: 'Kids Comic Balloon Box', desc: 'Colourful and playful for children’s birthday setups.', price: '₹549', emoji: '🧸' }
  ],
  Backdrops: [
    { name: 'Floral Wall Backdrop', desc: 'Elegant flower wall for memorable birthday and anniversary photos.', price: '₹1,199', emoji: '🌸' },
    { name: 'Glow Light Backdrop', desc: 'Warm lights and soft texture for evening celebrations.', price: '₹1,499', emoji: '✨' },
    { name: 'Custom Name Backdrop', desc: 'Personalized backdrop for birthdays and milestone anniversaries.', price: '₹1,299', emoji: '🖼️' }
  ],
  Candles: [
    { name: 'Rose Candle Set', desc: 'Romantic candle arrangement for anniversaries and dinner decor.', price: '₹449', emoji: '🕯️' },
    { name: 'Number Candles', desc: 'Bright and festive candles for birthday age themes.', price: '₹299', emoji: '🔢' },
    { name: 'Fairy Light Candles', desc: 'Soft glowing candles for evening party tables.', price: '₹379', emoji: '🌟' }
  ],
  Banners: [
    { name: 'Happy Birthday Banner', desc: 'Bold lettering banner for birthday parties and entryways.', price: '₹349', emoji: '🎉' },
    { name: 'Anniversary Celebration Banner', desc: 'Stylish banner for milestone anniversary events.', price: '₹399', emoji: '💞' },
    { name: 'Custom Name Banner', desc: 'Perfect for themed parties and special age celebrations.', price: '₹429', emoji: '🪧' }
  ],
  'Table Decor': [
    { name: 'Centerpiece Flower Box', desc: 'Elegant table setup for home parties and banquet tables.', price: '₹599', emoji: '💐' },
    { name: 'Cake Table Runner', desc: 'Decorative runner for cake display and dessert corners.', price: '₹329', emoji: '🍰' },
    { name: 'Mini Table Lights', desc: 'Soft decorative lights to brighten celebration tables.', price: '₹279', emoji: '💡' }
  ],
  'Anniversary Sets': [
    { name: 'Romantic Dinner Set', desc: 'Decor bundle with candles, flowers, and table accents.', price: '₹999', emoji: '🥂' },
    { name: 'Golden Anniversary Pack', desc: 'Premium decor pieces for milestone anniversary themes.', price: '₹1,249', emoji: '🥇' },
    { name: 'Love Letter Decor Box', desc: 'A charming setup with hearts, lights, and elegant textures.', price: '₹849', emoji: '💌' }
  ]
};

function renderCategoryProducts(category) {
  const items = categoryProducts[category] || [];
  if (!categoryShowcase) return;

  categoryShowcase.innerHTML = items
    .map(
      (item) => `
        <article class="showcase-card">
          <div class="visual" style="background: linear-gradient(135deg, #eef4ff, #ffe8e8);">${item.emoji}</div>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <span class="price">${item.price}</span>
        </article>
      `
    )
    .join('');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1400);
}

function updateCart() {
  cartCount.textContent = count;
}

document.querySelectorAll('[data-product]').forEach((button) => {
  button.addEventListener('click', () => {
    count += 1;
    updateCart();
    const productName = button.getAttribute('data-product');
    showToast(`${productName} added to cart`);
    button.textContent = 'Added';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Add to cart';
      button.disabled = false;
    }, 1000);
  });
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedCategory = button.getAttribute('data-category');
    categoryButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderCategoryProducts(selectedCategory);
    showToast(`${selectedCategory} products loaded`);
  });
});

document.querySelectorAll('[data-payment]').forEach((button) => {
  button.addEventListener('click', () => {
    const method = button.getAttribute('data-payment');
    showToast(`${method === 'UPI' ? 'UPI' : 'Cash on Delivery'} selected`);
    button.textContent = 'Selected';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = method === 'UPI' ? 'Select UPI' : 'Select COD';
      button.disabled = false;
    }, 1100);
  });
});

if (year) {
  year.textContent = new Date().getFullYear();
}

renderCategoryProducts('Balloons');
updateCart();
