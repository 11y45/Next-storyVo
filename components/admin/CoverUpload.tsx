// components/admin/CoverUpload.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

interface CoverUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function CoverUpload({ value, onChange }: CoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);
  const hasPreview = /^https:\/\//i.test(value.trim());

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 8 MB).");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed.");

      onChange(data.secure_url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-28 h-20 shrink-0 rounded-xl border border-slate-100 bg-linear-to-br from-emerald-50 to-teal-50/50 overflow-hidden flex items-center justify-center">
          {hasPreview ? (
            <Image
              src={value.trim()}
              alt="Cover preview"
              width={224}
              height={160}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">No cover</span>
          )}
        </div>

        <div className="grow space-y-2 min-w-0">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            aria-label="Cover image URL"
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={!configured || uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload image"}
            </button>

            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-medium text-slate-400 hover:text-red-600 transition"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      </div>

      {!configured && (
        <p className="text-xs text-amber-700 font-medium">
          Upload is disabled: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
          NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local, then restart the dev
          server. You can still paste a URL.
        </p>
      )}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
