const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const assertOk = async (label, request) => {
  const response = await request();
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${label} failed: ${response.status} ${body}`);
  }
  console.log(`✅ ${label}`);
  return response.json();
};

const run = async () => {
  console.log(`🔎 Running Zenach smoke tests against ${API_URL}\n`);

  await assertOk('API health', () => fetch(`${API_URL}/health`));

  const products = await assertOk('Products list', () => fetch(`${API_URL}/products`));
  if (!Array.isArray(products.products) && !Array.isArray(products)) {
    throw new Error('Products response shape is invalid');
  }

  const login = await assertOk('Admin login', () =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@zenach.com', password: 'admin123' }),
    })
  );

  if (!login.token) {
    throw new Error('Admin login did not return a token');
  }

  await assertOk('Admin dashboard stats', () =>
    fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${login.token}` },
    })
  );

  await assertOk('Admin orders list', () =>
    fetch(`${API_URL}/orders/all`, {
      headers: { Authorization: `Bearer ${login.token}` },
    })
  );

  console.log('\n🎉 Smoke tests passed. Backend, database, and key integrations are responding.');
};

run().catch((error) => {
  console.error(`\n❌ Smoke test failed: ${error.message}`);
  process.exit(1);
});