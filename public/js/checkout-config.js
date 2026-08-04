// Checkout Hotmart — conectWM Academy
const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/O107022826R';
const PRODUCT_PRICE = 'R$ 39,99';
const PRODUCT_PRICE_FULL = 'R$ 97,00';
const PRODUCT_PRICE_LABEL = 'R$ 39,99/mês';

function goToCheckout() {
  window.location.href = HOTMART_CHECKOUT_URL;
}

function getSpotsRemaining() {
  const key = 'conectwm_spots_v1';
  const stored = localStorage.getItem(key);
  const today = new Date().toDateString();
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.date === today && typeof data.spots === 'number') return data.spots;
    } catch { /* ignore */ }
  }
  const spots = 12 + Math.floor(Math.random() * 9);
  localStorage.setItem(key, JSON.stringify({ date: today, spots }));
  return spots;
}
