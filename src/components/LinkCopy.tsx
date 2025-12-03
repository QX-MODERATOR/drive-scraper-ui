import React, { useState } from "react";

interface LinkCopyProps {
  label: string;
  link: string;
}

export const LinkCopy: React.FC<LinkCopyProps> = ({ label, link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail; in a real app we might surface a toast
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="link-copy-button"
      aria-label={label}
    >
      {copied ? "Copied!" : label}
    </button>
  );
};



