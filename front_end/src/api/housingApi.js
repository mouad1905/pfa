import { API_URLS, fetchData, fetchFormData } from "./api";

export const getHebergements = async () => {
  return fetchData(API_URLS.HEBERGEMENTS);
};

export const getHebergement = async (id) => {
  return fetchData(`${API_URLS.HEBERGEMENTS}/${id}`);
};

export const getMesHebergements = async () => {
  return fetchData(API_URLS.MES_HEBERGEMENTS);
};

export const getMesReservations = async () => {
  return fetchData(API_URLS.MES_RESERVATIONS);
};

export const updateReservationStatut = async (id, statut) => {
  return fetchData(API_URLS.reservationStatut(id), {
    method: "PUT",
    body: JSON.stringify({ statut }),
  });
};

export const updateHebergementPublication = async (id, actif) => {
  return fetchData(`${API_URLS.HEBERGEMENTS}/${id}/publication`, {
    method: "PUT",
    body: JSON.stringify({ actif }),
  });
};

export const createHebergement = async (formData) => {
  return fetchFormData(API_URLS.HEBERGEMENTS, formData, "POST");
};
