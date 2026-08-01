const ordersList = document.getElementById('orders-list');
const ordersMessage = document.getElementById('orders-message');
const USER_KEY = 'chourasiaUser';

function renderOrders(orders) {
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = '<p>You have no orders yet. Start shopping to place your first order.</p>';
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <div class="order-card">
          <div class="order-header">
            <h3>Order #${order.orderId}</h3>
            <span>${new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <p class="order-meta">${order.items.length} items • ₹${order.total} • ${order.paymentMethod}</p>
          <div class="order-items">
            ${order.items
              .map(
                (item) => `
                  <div class="order-item">
                    <span class="order-item-emoji">${item.emoji}</span>
                    <div>
                      <strong>${item.name}</strong>
                      <p>${item.category}</p>
                    </div>
                    <div>
                      <span>${item.quantity} × ₹${item.price}</span>
                    </div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
    )
    .join('');
}

function showMessage(message, error = false) {
  ordersMessage.textContent = message;
  ordersMessage.style.color = error ? '#b91c1c' : '#0f766e';
}

async function loadOrders() {
  const userData = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  if (!userData?.email) {
    ordersList.innerHTML = '<p>Please login first to see your orders.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/orders?userEmail=${encodeURIComponent(userData.email)}`);
    const data = await response.json();
    if (!response.ok) {
      showMessage(data.error || 'Unable to load orders.', true);
      return;
    }
    renderOrders(data);
  } catch (err) {
    showMessage('Unable to load your orders. Please try again later.', true);
  }
}

loadOrders();
