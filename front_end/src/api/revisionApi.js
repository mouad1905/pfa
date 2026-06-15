import API_BASE_URL, { API_URLS, fetchData } from "./api";

export const getCours = async () => {
  return fetchData(API_URLS.COURS);
};

export const getMesCours = async () => {
  return fetchData(API_URLS.MES_COURS);
};

export const createSignalement = async (data) => {
  return fetchData(`${API_BASE_URL}/signalements`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const createEvaluation = async (data) => {
  return fetchData(`${API_BASE_URL}/evaluations`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
