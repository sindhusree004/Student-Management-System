const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  try {
    const res = await fetch(url, config);
    const json = await res.json();
    if (!res.ok) {
      const err = new Error(json.message || 'Request failed');
      err.status = res.status;
      err.errors = json.errors;
      throw err;
    }
    return json.data;
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('Cannot connect to server. Make sure the backend is running on ' + BASE_URL.replace('/api', ''));
    }
    throw err;
  }
}

export const studentApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return request(`/students${q ? '?' + q : ''}`);
  },
  getCount: () => request('/students/count').then(d => d.count),
  getById: (id) => request(`/students/${id}`),
  create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
};
