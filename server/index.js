const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 4000;
const staticRoot = path.join(__dirname, '..');
const dbPath = path.join(__dirname, 'database.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticRoot));

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Unable to open database:', err.message);
    process.exit(1);
  }
  initializeDatabase();
});

const productsSeed = [
  { name: 'Metallic Balloon Bundle', category: 'Balloons', description: 'Shiny balloon set for party ceilings and entrance decor.', price: 399, emoji: '🎈' },
  { name: 'Heart Balloon Arch', category: 'Balloons', description: 'Perfect for birthday photo corners and anniversary celebrations.', price: 699, emoji: '💖' },
  { name: 'Kids Comic Balloon Box', category: 'Balloons', description: 'Colourful and playful for children’s birthday setups.', price: 549, emoji: '🧸' },
  { name: 'Floral Wall Backdrop', category: 'Backdrops', description: 'Elegant flower wall for memorable birthday and anniversary photos.', price: 1199, emoji: '🌸' },
  { name: 'Glow Light Backdrop', category: 'Backdrops', description: 'Warm lights and soft texture for evening celebrations.', price: 1499, emoji: '✨' },
  { name: 'Custom Name Backdrop', category: 'Backdrops', description: 'Personalized backdrop for birthdays and milestone anniversaries.', price: 1299, emoji: '🖼️' },
  { name: 'Rose Candle Set', category: 'Candles', description: 'Romantic candle arrangement for anniversaries and dinner decor.', price: 449, emoji: '🕯️' },
  { name: 'Number Candles', category: 'Candles', description: 'Bright and festive candles for birthday age themes.', price: 299, emoji: '🔢' },
  { name: 'Fairy Light Candles', category: 'Candles', description: 'Soft glowing candles for evening party tables.', price: 379, emoji: '🌟' },
  { name: 'Happy Birthday Banner', category: 'Banners', description: 'Bold lettering banner for birthday parties and entryways.', price: 349, emoji: '🎉' },
  { name: 'Anniversary Celebration Banner', category: 'Banners', description: 'Stylish banner for milestone anniversary events.', price: 399, emoji: '💞' },
  { name: 'Custom Name Banner', category: 'Banners', description: 'Perfect for themed parties and special age celebrations.', price: 429, emoji: '🪧' },
  { name: 'Centerpiece Flower Box', category: 'Table Decor', description: 'Elegant table setup for home parties and banquet tables.', price: 599, emoji: '💐' },
  { name: 'Cake Table Runner', category: 'Table Decor', description: 'Decorative runner for cake display and dessert corners.', price: 329, emoji: '🍰' },
  { name: 'Mini Table Lights', category: 'Table Decor', description: 'Soft decorative lights to brighten celebration tables.', price: 279, emoji: '💡' },
  { name: 'Romantic Dinner Set', category: 'Anniversary Sets', description: 'Decor bundle with candles, flowers, and table accents.', price: 999, emoji: '🥂' },
  { name: 'Golden Anniversary Pack', category: 'Anniversary Sets', description: 'Premium decor pieces for milestone anniversary themes.', price: 1249, emoji: '🥇' },
  { name: 'Love Letter Decor Box', category: 'Anniversary Sets', description: 'A charming setup with hearts, lights, and elegant textures.', price: 849, emoji: '💌' }
];

function initializeDatabase() {
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      emoji TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      payment_method TEXT NOT NULL,
      total INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  db.exec(createTables, (err) => {
    if (err) {
      console.error('Unable to initialize database schema:', err.message);
      process.exit(1);
    }
    seedProductsIfNeeded();
  });
}

function seedProductsIfNeeded() {
  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      console.error('Error checking products table:', err.message);
      return;
    }

    if (!row || row.count > 0) {
      return;
    }

    const insert = db.prepare('INSERT INTO products (name, category, description, price, emoji) VALUES (?, ?, ?, ?, ?)');
    productsSeed.forEach((product) => {
      insert.run(product.name, product.category, product.description, product.price, product.emoji);
    });
    insert.finalize();
    console.log('Seeded products into database.');
  });
}

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY category, name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to fetch products' });
    }
    res.json(rows);
  });
});

app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM products ORDER BY category', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to fetch categories' });
    }
    res.json(rows.map((item) => item.category));
  });
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to check existing user.' });
    }

    if (row) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (insertErr) {
      if (insertErr) {
        return res.status(500).json({ error: 'Unable to register user.' });
      }

      res.json({ id: this.lastID, name, email });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT id, name, email FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to authenticate.' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }

    res.json({ id: row.id, name: row.name, email: row.email });
  });
});

app.post('/api/orders', (req, res) => {
  const { userEmail, paymentMethod, items } = req.body;
  if (!userEmail || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order requires user, payment method, and cart items.' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [userEmail], (err, userRow) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to verify user.' });
    }

    if (!userRow) {
      return res.status(401).json({ error: 'User not found.' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const createdAt = new Date().toISOString();

    db.run(
      'INSERT INTO orders (user_id, payment_method, total, created_at) VALUES (?, ?, ?, ?)',
      [userRow.id, paymentMethod, totalAmount, createdAt],
      function (orderErr) {
        if (orderErr) {
          return res.status(500).json({ error: 'Unable to create order.' });
        }

        const orderId = this.lastID;
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        items.forEach((item) => {
          stmt.run(orderId, item.productId, item.quantity, item.price);
        });
        stmt.finalize((itemErr) => {
          if (itemErr) {
            return res.status(500).json({ error: 'Unable to save order items.' });
          }
          res.json({ orderId, total: totalAmount, paymentMethod, createdAt });
        });
      }
    );
  });
});

app.get('/api/orders', (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) {
    return res.status(400).json({ error: 'Missing user email.' });
  }

  db.get('SELECT id FROM users WHERE email = ?', [userEmail], (err, userRow) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to verify user.' });
    }

    if (!userRow) {
      return res.status(401).json({ error: 'User not found.' });
    }

    db.all(
      `SELECT o.id AS order_id, o.payment_method, o.total AS order_total, o.created_at,
        oi.quantity, oi.price AS item_price, p.name AS product_name, p.category, p.emoji
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC, oi.id ASC`,
      [userRow.id],
      (orderErr, rows) => {
        if (orderErr) {
          return res.status(500).json({ error: 'Unable to fetch orders.' });
        }

        const orders = rows.reduce((acc, row) => {
          let order = acc.find((item) => item.orderId === row.order_id);
          if (!order) {
            order = {
              orderId: row.order_id,
              paymentMethod: row.payment_method,
              total: row.order_total,
              createdAt: row.created_at,
              items: []
            };
            acc.push(order);
          }
          order.items.push({
            name: row.product_name,
            category: row.category,
            emoji: row.emoji,
            price: row.item_price,
            quantity: row.quantity
          });
          return acc;
        }, []);

        res.json(orders);
      }
    );
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(staticRoot, 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && port === 4000) {
    app.listen(4001, () => {
      console.log('Port 4000 is in use. Server started on http://localhost:4001');
    });
    return;
  }
  console.error('Server error:', err);
});
