import API_BASE_URL, { API_URLS, fetchData } from "./api";

export const getUser = async (id) => {
  const url = id ? `${API_BASE_URL}/users/${id}` : API_URLS.USER;
  return fetchData(url);
};

export const updateUser = async (id, data) => {
  return fetchData(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
