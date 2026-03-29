// Set VITE_API_URL in your .env or .env.production to point at your deployed API Gateway URL.
// e.g. VITE_API_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ENDPOINT = `${BASE}/liamoles`;

export async function fetchBalance() {
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error('Failed to fetch balance');
  const data = await res.json();
  return data.amount;
}

export async function addLiamoles(amount) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', amount }),
  });
  if (!res.ok) throw new Error('Failed to add liamoles');
  const data = await res.json();
  return data.amount;
}

export async function subtractLiamoles(amount) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'subtract', amount }),
  });
  if (res.status === 409) throw new Error('insufficient');
  if (!res.ok) throw new Error('Failed to subtract liamoles');
  const data = await res.json();
  return data.amount;
}
