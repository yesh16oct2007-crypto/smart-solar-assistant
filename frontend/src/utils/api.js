// In production on Render/Vercel, set VITE_API_BASE (e.g. https://solar-assistant-backend.onrender.com/api)
// In local development, defaults to direct backend on port 8000
const API_BASE = import.meta.env.VITE_API_BASE || 
  ((typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000'))
    ? 'http://127.0.0.1:8000/api'
    : '/api');



export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.error('Health check failed', err);
    return { status: 'offline', gemini_mode: 'Demo Mode (Local Engine)' };
  }
}

export async function fetchStates() {
  const res = await fetch(`${API_BASE}/states`);
  if (!res.ok) throw new Error('Failed to load states');
  return await res.json();
}

export async function generateRecommendation(data) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(err.detail || 'Recommendation request failed');
  }
  return await res.json();
}

export async function fetchRecommendations(limit = 50) {
  const res = await fetch(`${API_BASE}/recommendations?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load recommendations');
  return await res.json();
}

export async function fetchRecommendationById(id) {
  const res = await fetch(`${API_BASE}/recommendations/${id}`);
  if (!res.ok) throw new Error('Failed to load recommendation detail');
  return await res.json();
}

export async function deleteRecommendation(id) {
  const res = await fetch(`${API_BASE}/recommendations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete recommendation');
  return await res.json();
}

export async function calculateEconomics(data) {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Calculation request failed');
  return await res.json();
}

export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('Chatbot request failed');
  return await res.json();
}

export async function fetchPromptLabTechniques() {
  const res = await fetch(`${API_BASE}/prompt-lab/techniques`);
  if (!res.ok) throw new Error('Failed to fetch prompt techniques');
  return await res.json();
}

export async function runPromptLabExperiment(data) {
  const res = await fetch(`${API_BASE}/prompt-lab`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Prompt lab experiment failed');
  return await res.json();
}

export async function submitContact(data) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit message');
  return await res.json();
}

export async function fetchContacts() {
  const res = await fetch(`${API_BASE}/contacts`);
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  return await res.json();
}
