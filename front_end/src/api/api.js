const API_BASE_URL = "http://127.0.0.1:8000/api";

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  HEBERGEMENTS: `${API_BASE_URL}/hebergements`,
  COURS: `${API_BASE_URL}/cours`,
  USER: `${API_BASE_URL}/user`,
  LOGOUT: `${API_BASE_URL}/logout`,
};

export const fetchData = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    if (response.status === 401) {
      // Optional: handle logout or redirect to login
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};


export default API_BASE_URL;

