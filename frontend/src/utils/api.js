const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Set credentials for session cookie synchronization
  options.credentials = 'include';
  
  // Set Content-Type header if body is not FormData (file uploads)
  if (options.body && !(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(url, options);
    
    // Clear cookies/session if backend returns 401 Unauthorized (invalid token)
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Dispatch custom event to let AuthContext know to logout user
      window.dispatchEvent(new Event('unauthorized'));
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API error (status: ${response.status})`);
    }
    return data;
  } catch (err) {
    console.error(`API Request Failure [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options }),
  baseUrl: API_BASE_URL
};
