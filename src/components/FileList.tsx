import React from "react";
import type { DriveFile } from "../types/fileTypes";
import { LinkCopy } from "./LinkCopy";

interface FileListProps {
  files: DriveFile[];
}

const formatMimeType = (mimeType: string): string => {
  if (mimeType === "application/vnd.google-apps.folder") {
    return "📁 Folder";
  }
  if (mimeType === "application/octet-stream") {
    return "📄 File";
  }
  if (mimeType.startsWith("video/")) {
    return "🎬 Video";
  }
  if (mimeType.startsWith("audio/")) {
    return "🎵 Audio";
  }
  if (mimeType.startsWith("image/")) {
    return "🖼️ Image";
  }
  if (mimeType === "application/pdf") {
    return "📕 PDF";
  }
  if (mimeType.includes("document") || mimeType.includes("word")) {
    return "📝 Document";
  }
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return "📊 Spreadsheet";
  }
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return "📽️ Presentation";
  }
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z") || mimeType.includes("tar")) {
    return "📦 Archive";
  }
  return "📄 File";
};

export const FileList: React.FC<FileListProps> = ({ files }) => {
  if (!files.length) {
    return (
      <div className="no-files">
        No files found.
      </div>
    );
  }

  // Helper to check if name is likely just an ID (no spaces, all alphanumeric/dashes/underscores)
  const isLikelyJustId = (name: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 20;
  };

  return (
    <div className="file-list-card">
      <div className="file-list-header">
        <span>Name</span>
        <span>Type</span>
        <span className="file-list-actions-header">Actions</span>
      </div>
      <div className="file-list-grid">
        {files.map((file) => {
          const nameIsId = isLikelyJustId(file.name);
          return (
            <div className="file-list-row" key={file.id}>
              <div className="file-name" title={file.name}>
                {file.name}
                {nameIsId && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#fbbf24', 
                    marginLeft: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    (name not available)
                  </span>
                )}
              </div>
              <div className="file-mime">{formatMimeType(file.mimeType)}</div>
              <div className="file-actions">
                <a
                  href={file.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-button"
                >
                  View
                </a>
                <LinkCopy label="Copy view link" link={file.viewUrl} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



