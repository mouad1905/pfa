import { useState, useRef, useContext, useCallback } from "react";
import { uploadToCloudinary, saveMediaUrl } from "../../api/cloudinaryApi";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

/**
 * ImageUpload — Reusable drag-and-drop image upload component.
 *
 * Uploads directly to Cloudinary (unsigned), then saves the
 * secure_url to the backend via POST /api/save-media.
 *
 * Props:
 *  - onUploadSuccess(data) — called after backend confirms save
 *  - onUploadError(error)  — called on any error
 *  - className             — additional wrapper classes
 */
export default function ImageUpload({ onUploadSuccess, onUploadError, className = "" }) {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  /* ── File selection ─────────────────────────────── */
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Type invalide",
        text: "Veuillez sélectionner un fichier image (JPEG, PNG, WebP, etc.).",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Fichier trop volumineux",
        text: "La taille maximale est de 10 Mo.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setProgress(0);
  }, []);

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
  };

  /* ── Drag & Drop ────────────────────────────────── */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  /* ── Upload flow ────────────────────────────────── */
  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Non authentifié",
        text: "Veuillez vous connecter avant d'uploader.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1 — Upload to Cloudinary
      const { secure_url } = await uploadToCloudinary(selectedFile, (pct) => {
        setProgress(pct);
      });

      // Step 2 — Save URL to backend
      const userId = user.id_user ?? user.id;
      const result = await saveMediaUrl(secure_url, userId);

      // Success!
      Swal.fire({
        icon: "success",
        title: "Image uploadée !",
        text: "Votre image a été enregistrée avec succès.",
        confirmButtonColor: "#6366f1",
        timer: 2500,
        showConfirmButton: false,
      });

      onUploadSuccess?.({ ...result, secure_url });

      // Reset
      setSelectedFile(null);
      setPreview(null);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Échec de l'upload",
        text: err.message || "Une erreur est survenue.",
        confirmButtonColor: "#6366f1",
      });
      onUploadError?.(err);
    } finally {
      setUploading(false);
    }
  };

  /* ── Clear selection ────────────────────────────── */
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Drop zone */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-in-out
          ${dragOver
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
            : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          }
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id="image-upload-input"
        />

        {preview ? (
          /* ── Image preview ── */
          <div className="p-4">
            <img
              src={preview}
              alt="Aperçu"
              className="w-full max-h-72 object-contain rounded-xl"
            />
            <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400 truncate">
              {selectedFile?.name}
            </p>
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {/* Upload icon */}
            <svg
              className="w-14 h-14 mb-4 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775
                   5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752
                   3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              Glissez une image ici
            </p>
            <p className="mt-1 text-sm text-gray-400">
              ou <span className="text-indigo-500 font-semibold">parcourir</span> vos fichiers
            </p>
            <p className="mt-2 text-xs text-gray-400">
              JPEG, PNG, WebP — 10 Mo max
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Upload en cours…</span>
            <span className="font-semibold text-indigo-500">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {selectedFile && !uploading && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleUpload}
            className="
              flex-1 py-2.5 rounded-xl font-semibold text-white
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              shadow-lg shadow-indigo-500/25
              transition-all duration-200 active:scale-[0.98]
            "
            id="upload-submit-btn"
          >
            Uploader l'image
          </button>
          <button
            onClick={handleClear}
            className="
              px-5 py-2.5 rounded-xl font-semibold
              text-gray-600 dark:text-gray-300
              bg-gray-100 dark:bg-gray-800
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition-all duration-200 active:scale-[0.98]
            "
            id="upload-clear-btn"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
