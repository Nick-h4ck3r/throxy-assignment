"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    inserted_count: number;
    stats: {
      total_processed: number;
      successful_cleaned: number;
      failed_cleaning: number;
      countries_normalized: number;
      domains_cleaned: number;
      employee_sizes_categorized: number;
      cities_cleaned: number;
    };
  };
  error?: string;
}

interface FileUploadProps {
  onUploadSuccess?: (response: UploadResponse) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    []
  );

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      const error = "Please select a CSV file";
      setUploadResult({ success: false, message: error, error });
      onUploadError?.(error);
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      setUploadResult(result);

      if (result.success) {
        onUploadSuccess?.(result);
      } else {
        onUploadError?.(result.error || "Upload failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadResult({
        success: false,
        message: errorMessage,
        error: errorMessage,
      });
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"}
          ${
            isUploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Upload className="h-8 w-8 text-gray-600" />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isUploading ? "Uploading..." : "Upload CSV File"}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop your CSV file here, or click to select
            </p>
          </div>

          {!isUploading && (
            <p className="text-xs text-gray-400">Supported format: .csv</p>
          )}
        </div>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            uploadResult.success
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start space-x-3">
            {uploadResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  uploadResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {uploadResult.message}
              </p>

              {uploadResult.success && uploadResult.data && (
                <div className="mt-2 text-sm text-green-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      Companies processed:{" "}
                      {uploadResult.data.stats.total_processed}
                    </div>
                    <div>
                      Successfully cleaned:{" "}
                      {uploadResult.data.stats.successful_cleaned}
                    </div>
                    <div>
                      Countries normalized:{" "}
                      {uploadResult.data.stats.countries_normalized}
                    </div>
                    <div>
                      Domains cleaned: {uploadResult.data.stats.domains_cleaned}
                    </div>
                  </div>
                </div>
              )}

              {uploadResult.error && (
                <p className="mt-1 text-sm text-red-600">
                  {uploadResult.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
