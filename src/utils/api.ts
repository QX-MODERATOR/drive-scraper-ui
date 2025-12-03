import type {
  ExtractFilesResponse,
  ErrorResponseBody,
} from "../types/fileTypes";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

if (!API_BASE) {
  console.error(
    "VITE_API_BASE_URL is not set. Please configure the environment variable."
  );
}

console.log("Using API:", API_BASE || "NOT CONFIGURED");

export const extractFromFolder = async (
  folderUrl: string
): Promise<ExtractFilesResponse> => {
  if (!API_BASE) {
    throw new Error(
      "API base URL is not configured. Please set VITE_API_BASE_URL environment variable."
    );
  }

  const body = {
    folderUrl: folderUrl.trim(),
  };

  const apiUrl = `${API_BASE}/api/extract`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const errorPayload = json as ErrorResponseBody | null;
    if (errorPayload && errorPayload.error) {
      const { message } = errorPayload.error;
      throw new Error(message || "Failed to extract files from folder.");
    }

    throw new Error("Unexpected error from server while extracting folder.");
  }

  const data = json as ExtractFilesResponse;
  return data;
};

