"use client";

import { DragEvent, useRef, useState } from "react";
import { FileText, Globe, UploadCloud } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { isValidPdf, isValidWebsiteUrl, isValidYoutubeUrl } from "@/lib/validators";
import type { SourceType } from "@/lib/types";

const TABS: { type: SourceType; label: string; icon: React.ReactNode }[] = [
  { type: "pdf", label: "PDF", icon: <FileText className="h-4 w-4" /> },
  { type: "web", label: "Website", icon: <Globe className="h-4 w-4" /> },
  { type: "youtube", label: "YouTube", icon: <FaYoutube className="h-4 w-4 text-red-500" /> },
];

export default function SourcePanel({
  isProcessing,
  onSubmitUrl,
  onSubmitFile,
}: {
  isProcessing: boolean;
  onSubmitUrl: (type: "web" | "youtube", url: string) => void;
  onSubmitFile: (file: File) => void;
}) {
  const [activeTab, setActiveTab] = useState<SourceType>("pdf");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUrlSubmit() {
    if (activeTab === "web") {
      if (!isValidWebsiteUrl(url)) {
        setUrlError("Enter a valid website URL, e.g. https://example.com");
        return;
      }
      setUrlError(null);
      onSubmitUrl("web", url);
    } else if (activeTab === "youtube") {
      if (!isValidYoutubeUrl(url)) {
        setUrlError("Enter a valid YouTube video URL.");
        return;
      }
      setUrlError(null);
      onSubmitUrl("youtube", url);
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!isValidPdf(file)) {
      setUrlError("Please choose a PDF file.");
      return;
    }
    setUrlError(null);
    onSubmitFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Source type"
        className="mb-3 grid grid-cols-3 gap-1 rounded-[var(--radius-md)] border border-border bg-bg-elevated p-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.type}
            onClick={() => {
              setActiveTab(tab.type);
              setUrlError(null);
              setUrl("");
            }}
            className={`flex flex-col items-center gap-1 rounded-[var(--radius-sm)] px-2 py-2 text-[11px] font-medium transition-colors ${
              activeTab === tab.type
                ? "bg-surface text-text shadow-[var(--shadow-sm)]"
                : "text-text-dim hover:text-text-muted"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pdf" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-8 text-center transition-colors ${
            isDragging ? "border-accent bg-accent-soft" : "border-border-strong bg-bg-elevated"
          }`}
        >
          <UploadCloud className="h-6 w-6 text-text-dim" />
          <p className="text-xs text-text-muted">
            Drag & drop a PDF, or{" "}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-medium text-accent underline-offset-2 hover:underline"
            >
              browse
            </button>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            disabled={isProcessing}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="sr-only"
          />
        </div>
      )}

      {(activeTab === "web" || activeTab === "youtube") && (
        <div className="space-y-2">
          <input
            type="url"
            inputMode="url"
            disabled={isProcessing}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder={activeTab === "web" ? "https://example.com" : "https://youtube.com/watch?v=…"}
            aria-label={activeTab === "web" ? "Website URL" : "YouTube video URL"}
            className="w-full rounded-[var(--radius-md)] border border-border-strong bg-bg-elevated px-3 py-2.5 text-sm text-text outline-none placeholder:text-text-dim focus:border-accent/50"
          />
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            loading={isProcessing}
            disabled={isProcessing || !url.trim()}
            onClick={handleUrlSubmit}
          >
            {isProcessing ? "Analyzing…" : `Analyze ${activeTab === "web" ? "website" : "video"}`}
          </Button>
        </div>
      )}

      {urlError && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {urlError}
        </p>
      )}
    </div>
  );
}
