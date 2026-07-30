const cartCount = document.getElementById('cart-count');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');

let count = 0;

function updateCart() {
  cartCount.textContent = count;
}

document.querySelectorAll('[data-product]').forEach((button) => {
  button.addEventListener('click', () => {
    count += 1;
    updateCart();
    const productName = button.getAttribute('data-product');
    button.textContent = `${productName} added`;
    button.disabled = true;
    setTimeout(() => {
      button.textContent = productName.includes('Plan') ? 'Get started' : 'Add to cart';
      if (button.classList.contains('btn-primary')) {
        button.textContent = button.getAttribute('data-product') === 'Premium Plan' ? 'Choose Premium' : 'Add to cart';
      }
      button.disabled = false;
    }, 900);
  });
});

menuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
});

year.textContent = new Date().getFullYear();
updateCart();
