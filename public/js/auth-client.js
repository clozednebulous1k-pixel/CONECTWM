// Cliente · sessão de autenticação conectWM

function saveAuthSession(data) {
  if (data.token) localStorage.setItem('conectwm_auth_token', data.token);
  if (data.email) localStorage.setItem('conectwm_logged_in_user', data.email);
  if (data.role) localStorage.setItem('conectwm_user_role', data.role);
  localStorage.setItem('conectwm_user_is_paying', 'true');
  if (data.subscription?.expiresAt) {
    localStorage.setItem('conectwm_subscription_expires', data.subscription.expiresAt);
  }
}

function clearAuthSession() {
  localStorage.removeItem('conectwm_auth_token');
  localStorage.removeItem('conectwm_logged_in_user');
  localStorage.removeItem('conectwm_user_is_paying');
  localStorage.removeItem('conectwm_subscription_expires');
  localStorage.removeItem('conectwm_user_role');
}

function getAuthToken() {
  return localStorage.getItem('conectwm_auth_token');
}

async function fetchAuthMe() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data : null;
  } catch {
    return null;
  }
}
