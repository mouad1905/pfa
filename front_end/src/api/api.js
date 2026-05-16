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
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Not JSON
    }
    
    if (response.status === 401) {
      // Optional: handle logout
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};



export default API_BASE_URL;

