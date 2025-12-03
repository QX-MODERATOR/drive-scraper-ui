import React, { useState } from "react";
import type { DriveFile } from "../types/fileTypes";
import { extractFromFolder } from "../utils/api";
import { FileList } from "../components/FileList";

const Home: React.FC = () => {
  const [folderUrl, setFolderUrl] = useState<string>("");
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    const trimmedUrl = folderUrl.trim();
    if (!trimmedUrl) {
      setError("Please enter a Google Drive folder link.");
      setFiles([]);
      setFolderId(null);
      return;
    }

    setLoading(true);
    setError("");
    setFiles([]);
    setInfoMessage("");
    setFolderId(null);

    try {
      const result = await extractFromFolder(trimmedUrl);
      setFiles(result.files);
      setFolderId(result.folderId);
      setInfoMessage(result.message ?? "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to extract folder.");
      }
      setFiles([]);
      setFolderId(null);
      setInfoMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!files.length) {
      return;
    }

    const escapeHtml = (value: string): string =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const headerRow = "<tr><th>Name</th><th>Type</th><th>Drive link</th></tr>";
    const rowsHtml = files
      .map((file) => {
        const name = escapeHtml(file.name);
        const type =
          file.mimeType === "application/vnd.google-apps.folder"
            ? "Folder"
            : "File";
        const link = escapeHtml(file.viewUrl);
        return `<tr><td>${name}</td><td>${type}</td><td>${link}</td></tr>`;
      })
      .join("");

    const tableHtml = `<table>${headerRow}${rowsHtml}</table>`;
    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // Use .xls as the extension since the content is an HTML table that
    // Excel can open, but is not a true XLSX binary file.
    link.download = "drive-files.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-root">
      <style>{`
        /* ============================================================================
           ROOT & GLOBAL STYLES
           ============================================================================ */
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%);
          padding: 1rem;
          box-sizing: border-box;
          color: #e5e7eb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ============================================================================
           MAIN CONTAINER - GLASSMORPHISM CARD
           ============================================================================ */

        .app-container {
          width: 100%;
          max-width: 1000px;
          background: rgba(15, 23, 42, 0.95);
          border-radius: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          padding: 2rem;
          box-sizing: border-box;
          border: 1px solid rgba(56, 189, 248, 0.15);
          position: relative;
          z-index: 1;
        }

        /* Animated border glow */
        .app-container::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(56, 189, 248, 0.3) 50%,
            transparent 70%
          );
          border-radius: 2.1rem;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.5s ease;
          animation: borderGlow 3s ease-in-out infinite;
        }

        .app-container:hover::before {
          opacity: 1;
        }

        @keyframes borderGlow {
          0%, 100% { 
            background-position: 0% 50%;
            filter: hue-rotate(0deg);
          }
          50% { 
            background-position: 100% 50%;
            filter: hue-rotate(30deg);
          }
        }

        /* Inner glow effect */
        .app-container::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(
            180deg,
            rgba(56, 189, 248, 0.05) 0%,
            transparent 100%
          );
          border-radius: 2rem 2rem 0 0;
          pointer-events: none;
        }

        /* ============================================================================
           HEADER SECTION
           ============================================================================ */

        .app-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          align-items: flex-start;
          position: relative;
          z-index: 2;
        }

        .app-title {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: transparent;
          background: linear-gradient(
            135deg,
            #f9fafb 0%,
            #38bdf8 50%,
            #a78bfa 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          text-shadow: 0 0 40px rgba(56, 189, 248, 0.5);
          position: relative;
          display: inline-block;
        }

        .app-title::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #38bdf8, #a78bfa);
          border-radius: 2px;
        }

        .app-subtitle {
          font-size: 1.1rem;
          color: #94a3b8;
          margin-top: 0.5rem;
          line-height: 1.6;
          max-width: 600px;
          transition: color 0.3s ease;
        }

        .app-container:hover .app-subtitle {
          color: #cbd5e1;
        }

        /* ============================================================================
           FORM STYLES
           ============================================================================ */

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .input-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #7dd3fc;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
        }

        .input-label::before {
          content: "📂";
          font-size: 1.1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Input field with 3D effect */
        .folder-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 1rem;
          border: 2px solid rgba(56, 189, 248, 0.2);
          background: rgba(15, 23, 42, 0.9);
          color: #e0f2fe;
          font-size: 1.05rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          will-change: border-color, box-shadow;
        }

        .folder-input::placeholder {
          color: #64748b;
          font-style: italic;
        }

        .folder-input:hover {
          border-color: rgba(56, 189, 248, 0.4);
        }

        .folder-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .controls-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25rem;
          justify-content: space-between;
        }

        .auth-select-label {
          font-size: 0.9rem;
          color: #94a3b8;
          max-width: 500px;
          line-height: 1.5;
          padding: 0.75rem 1rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 0.75rem;
          border: 1px solid rgba(148, 163, 184, 0.1);
          transition: all 0.3s ease;
        }

        .auth-select-label:hover {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(148, 163, 184, 0.2);
          color: #cbd5e1;
        }

        /* ============================================================================
           3D SUBMIT BUTTON
           ============================================================================ */

        .submit-button {
          padding: 0.9rem 2rem;
          border-radius: 1rem;
          border: none;
          background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 0 #0369a1, 0 6px 15px rgba(56, 189, 248, 0.3);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          will-change: transform;
          transform: translateZ(0);
        }

        .submit-button:hover {
          transform: translateY(-2px) translateZ(0);
          box-shadow: 0 6px 0 #0369a1, 0 10px 20px rgba(56, 189, 248, 0.4);
        }

        .submit-button:active {
          transform: translateY(2px) translateZ(0);
          box-shadow: 0 2px 0 #0369a1, 0 4px 8px rgba(56, 189, 248, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 0 #475569, 0 6px 10px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        /* Spinner animation */
        .submit-button-spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ============================================================================
           STATUS MESSAGES
           ============================================================================ */

        .status-row {
          min-height: 2rem;
          margin-bottom: 1.25rem;
          font-size: 1rem;
          position: relative;
          z-index: 2;
        }

        .status-error {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.2) 0%,
            rgba(185, 28, 28, 0.15) 100%
          );
          color: #fca5a5;
          font-weight: 600;
          border: 1px solid rgba(239, 68, 68, 0.3);
          box-shadow: 
            0 4px 15px rgba(239, 68, 68, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: statusSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }

        .status-error-icon {
          font-size: 1.2rem;
          animation: iconShake 0.5s ease-in-out;
        }

        @keyframes iconShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes statusSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .status-success {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          background: linear-gradient(
            135deg,
            rgba(16, 185, 129, 0.2) 0%,
            rgba(5, 150, 105, 0.15) 100%
          );
          color: #6ee7b7;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.3);
          box-shadow: 
            0 4px 15px rgba(16, 185, 129, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: statusSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }

        .status-success-icon {
          font-size: 1.2rem;
          animation: iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes iconPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        .folder-meta {
          margin-bottom: 1.25rem;
          font-size: 1rem;
          color: #7dd3fc;
          padding: 0.75rem 1rem;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(56, 189, 248, 0.2);
          display: inline-block;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .folder-meta strong {
          color: #38bdf8;
          font-weight: 700;
        }

        /* ============================================================================
           FILE LIST SECTION
           ============================================================================ */

        .file-list-section {
          margin-top: 1rem;
          position: relative;
          z-index: 2;
        }

        .file-list-card {
          background: linear-gradient(
            180deg,
            rgba(2, 6, 23, 0.98) 0%,
            rgba(15, 23, 42, 0.95) 100%
          );
          border-radius: 1.5rem;
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 1.5rem;
          box-shadow: 
            0 10px 40px -10px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(56, 189, 248, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: cardSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
          position: relative;
        }

        .file-list-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(
            180deg,
            rgba(56, 189, 248, 0.05) 0%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 0;
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .file-list-header {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(0, 1.5fr) minmax(0, 2fr);
          gap: 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #7dd3fc;
          font-weight: 700;
          margin-bottom: 1rem;
          padding: 0.75rem 1.25rem;
          background: rgba(56, 189, 248, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(56, 189, 248, 0.15);
          position: relative;
          z-index: 1;
        }

        .file-list-actions-header {
          text-align: center;
        }

        .file-list-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 500px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        /* Custom scrollbar */
        .file-list-grid::-webkit-scrollbar {
          width: 8px;
        }

        .file-list-grid::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }

        .file-list-grid::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #38bdf8, #0ea5e9);
          border-radius: 4px;
          border: 2px solid transparent;
        }

        .file-list-grid::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7dd3fc, #38bdf8);
        }

        /* ============================================================================
           FILE LIST ROW - 3D HOVER EFFECT
           ============================================================================ */

        .file-list-row {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(0, 1.5fr) minmax(0, 2fr);
          gap: 1rem;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(100, 116, 139, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
          position: relative;
          will-change: transform;
          transform: translateZ(0);
          contain: layout style;
        }

        .file-list-row:hover {
          transform: translateX(4px) translateZ(0);
          border-color: rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.08);
        }

        /* Left border accent */
        .file-list-row::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #38bdf8;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 0;
          pointer-events: none;
        }

        .file-list-row:hover::after {
          opacity: 1;
        }

        .file-name {
          font-size: 1rem;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          transition: color 0.15s ease;
          padding-left: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .file-list-row:hover .file-name {
          color: #7dd3fc;
        }

        .file-mime {
          font-size: 0.85rem;
          color: #cbd5e1;
          font-weight: 600;
          padding: 0.35rem 0.85rem;
          background: rgba(56, 189, 248, 0.15);
          border-radius: 0.5rem;
          display: inline-block;
          transition: background 0.15s ease;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(56, 189, 248, 0.2);
          text-transform: capitalize;
        }

        .file-list-row:hover .file-mime {
          background: rgba(56, 189, 248, 0.25);
        }

        /* ============================================================================
           ACTION BUTTONS - 3D STYLE
           ============================================================================ */

        .file-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: flex-end;
          position: relative;
          z-index: 1;
        }

        .link-button,
        .link-copy-button {
          border-radius: 0.75rem;
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(30, 41, 59, 0.9);
          color: #7dd3fc;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          transition: transform 0.1s ease, border-color 0.1s ease, background 0.1s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          will-change: transform;
          transform: translateZ(0);
        }

        .link-button:hover,
        .link-copy-button:hover {
          transform: translateY(-1px) translateZ(0);
          border-color: #38bdf8;
          color: #ffffff;
          background: rgba(56, 189, 248, 0.15);
        }

        .link-button:active,
        .link-copy-button:active {
          transform: translateY(1px) translateZ(0);
        }

        /* View button special style */
        .link-button:first-child {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .link-button:first-child:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.25);
        }

        /* Copy buttons dashed style */
        .link-copy-button {
          border-style: dashed;
          background: rgba(30, 41, 59, 0.7);
        }

        .link-copy-button:hover {
          border-style: solid;
        }

        /* ============================================================================
           NO FILES STATE
           ============================================================================ */

        .no-files {
          margin-top: 1rem;
          font-size: 1.05rem;
          color: #94a3b8;
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 1.5rem;
          border: 2px dashed rgba(148, 163, 184, 0.2);
        }

        .no-files::before {
          content: "📭";
          display: block;
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        /* ============================================================================
           EXPORT BUTTON CONTAINER
           ============================================================================ */

        .export-button-container {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        /* Excel export button special style */
        .export-button-container .submit-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 0 #065f46, 0 6px 15px rgba(16, 185, 129, 0.3);
        }

        .export-button-container .submit-button:hover {
          box-shadow: 0 6px 0 #065f46, 0 10px 20px rgba(16, 185, 129, 0.4);
        }

        .export-button-container .submit-button:active {
          box-shadow: 0 2px 0 #065f46, 0 4px 8px rgba(16, 185, 129, 0.2);
        }

        /* ============================================================================
           RESPONSIVE DESIGN
           ============================================================================ */

        /* Large tablets and small laptops */
        @media (max-width: 1024px) {
          .app-container {
            max-width: 90%;
          }
        }

        /* Tablets */
        @media (max-width: 900px) {
          .app-container {
            padding: 1.75rem 1.5rem;
            border-radius: 1.25rem;
            max-width: 95%;
          }

          .app-title {
            font-size: 2rem;
          }

          .controls-row {
            flex-direction: column;
            align-items: stretch;
          }

          .auth-select-label {
            max-width: 100%;
          }

          .submit-button {
            width: 100%;
            justify-content: center;
          }

          .file-list-header {
            grid-template-columns: minmax(0, 2.5fr) minmax(0, 1.5fr) minmax(0, 2fr);
          }

          .file-list-row {
            grid-template-columns: minmax(0, 2.5fr) minmax(0, 1.5fr) minmax(0, 2fr);
          }
        }

        /* Small tablets and large phones */
        @media (max-width: 768px) {
          .app-root {
            padding: 0.75rem;
          }

          .app-container {
            padding: 1.25rem 1rem;
            border-radius: 1rem;
            max-width: 100%;
          }

          .app-title {
            font-size: 1.6rem;
          }

          .app-subtitle {
            font-size: 0.95rem;
          }

          .file-list-card {
            padding: 0.75rem;
            border-radius: 1rem;
          }

          .file-list-header {
            display: none;
          }

          .file-list-row {
            grid-template-columns: 1fr;
            gap: 0.6rem;
            padding: 0.85rem;
          }

          .file-list-row:hover {
            transform: translateX(2px) translateZ(0);
          }

          .file-name {
            font-size: 0.9rem;
            padding-left: 0;
          }

          .file-mime {
            font-size: 0.75rem;
            align-self: flex-start;
          }

          .file-actions {
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 0.35rem;
          }

          .link-button,
          .link-copy-button {
            padding: 0.4rem 0.7rem;
            font-size: 0.75rem;
            flex: 1 1 auto;
            min-width: 80px;
            justify-content: center;
          }

          .export-button-container {
            justify-content: center;
          }

          .folder-meta {
            font-size: 0.9rem;
            padding: 0.6rem 0.85rem;
          }
        }

        /* Mobile phones */
        @media (max-width: 480px) {
          .app-root {
            padding: 0.5rem;
          }

          .app-container {
            padding: 1rem 0.75rem;
          }

          .app-title {
            font-size: 1.35rem;
          }

          .app-subtitle {
            font-size: 0.85rem;
          }

          .folder-input {
            padding: 0.75rem 0.9rem;
            font-size: 0.95rem;
            border-radius: 0.75rem;
          }

          .submit-button {
            padding: 0.75rem 1.25rem;
            font-size: 0.95rem;
          }

          .file-list-row {
            padding: 0.75rem;
            border-radius: 0.75rem;
          }

          .file-name {
            font-size: 0.85rem;
          }

          .link-button,
          .link-copy-button {
            padding: 0.35rem 0.5rem;
            font-size: 0.7rem;
            border-radius: 0.5rem;
          }

          .auth-select-label {
            font-size: 0.8rem;
            padding: 0.6rem 0.8rem;
          }
        }

        /* Very small phones */
        @media (max-width: 360px) {
          .app-title {
            font-size: 1.2rem;
          }

          .app-subtitle {
            font-size: 0.8rem;
          }

          .file-actions {
            flex-direction: column;
            gap: 0.3rem;
          }

          .link-button,
          .link-copy-button {
            width: 100%;
          }
        }

        /* ============================================================================
           ACCESSIBILITY - REDUCED MOTION
           ============================================================================ */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ============================================================================
           FOCUS STATES FOR ACCESSIBILITY
           ============================================================================ */

        .folder-input:focus-visible,
        .submit-button:focus-visible,
        .link-button:focus-visible,
        .link-copy-button:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 2px;
        }

        /* ============================================================================
           SELECTION STYLES
           ============================================================================ */

        ::selection {
          background: rgba(56, 189, 248, 0.3);
          color: #ffffff;
        }

        ::-moz-selection {
          background: rgba(56, 189, 248, 0.3);
          color: #ffffff;
        }
      `}</style>

      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Google Drive File Extractor</h1>
          <p className="app-subtitle">
            Paste a public Google Drive folder link or folder ID to list all files,
            including quick view and direct download links.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="form-row">
          <label htmlFor="folderUrl" className="input-label">
            Google Drive folder link or folder ID
          </label>
          <div className="input-group">
            <input
              id="folderUrl"
              className="folder-input"
              type="text"
              placeholder="https://drive.google.com/drive/folders/ABC123... or 1BH3r_KJovHe4KC-cbUo83CkRvvu4BoSi"
              value={folderUrl}
              onChange={(event) => setFolderUrl(event.target.value)}
              autoComplete="off"
            />
            <div className="controls-row">
              <p className="auth-select-label">
                Make sure your folder (or the folder for your ID) is shared as{" "}
                <span style={{ fontWeight: 600 }}>
                  &quot;Anyone with the link can view&quot;
                </span>{" "}
                (or edit). Private folders will not work with this tool.
              </p>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading && <span className="submit-button-spinner" />}
                <span>{loading ? "Extracting..." : "Extract Files"}</span>
              </button>
            </div>
          </div>
        </form>

        <div className="status-row">
          {error && (
            <div className="status-error">
              <span className="status-error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {!error && folderId && (
            <div className="status-success">
              <span className="status-success-icon">📁</span>
              <span>Folder ID: {folderId}</span>
            </div>
          )}
        </div>

        <section className="file-list-section">
          {folderId && !error && (
            <div className="folder-meta">
              Showing files for folder ID <strong>{folderId}</strong>
            </div>
          )}
          {files && files.length > 0 && (
            <>
              <FileList files={files} />
              <div className="export-button-container">
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleExportExcel}
                >
                  📊 Download as Excel
                </button>
              </div>
            </>
          )}
          {folderId && !files.length && !error && (
            <div className="no-files">
              {infoMessage
                ? infoMessage
                : "No files were parsed. Check that the folder sharing is 'Anyone with the link can view' and try again."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;



