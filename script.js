const cartCount = document.getElementById('cart-count');
const year = document.getElementById('year');
const toast = document.getElementById('toast');

let count = 0;

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
      button.textContent = button.getAttribute('data-product').includes('Combo') ? 'Add to cart' : 'Add to cart';
      button.disabled = false;
    }, 1000);
  });
});

if (year) {
  year.textContent = new Date().getFullYear();
}

updateCart();
