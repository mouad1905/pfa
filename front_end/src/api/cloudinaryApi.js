import API_BASE_URL from "./api";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload a file directly to Cloudinary (unsigned, browser-side).
 * Only uses cloud_name + upload_preset — no API secret exposed.
 *
 * @param {File} file - The image file to upload
 * @param {function} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", CLOUDINARY_UPLOAD_URL);

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          secure_url: data.secure_url,
          public_id: data.public_id,
        });
      } else {
        let errorMsg = `Cloudinary upload failed (${xhr.status})`;
        try {
          const errData = JSON.parse(xhr.responseText);
          errorMsg = errData.error?.message || errorMsg;
        } catch {
          // ignore parse error
        }
        reject(new Error(errorMsg));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during Cloudinary upload"));
    });

    xhr.send(formData);
  });
}

/**
 * Save a Cloudinary media URL to the backend database.
 *
 * @param {string} url - The Cloudinary secure_url
 * @param {number|string} userId - The user ID
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function saveMediaUrl(url, userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/save-media`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url, userId }),
  });

  if (!response.ok) {
    let errorMessage = `Backend error (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // not JSON
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}
