"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import CompaniesTable from "@/components/companies-table";
import { Building, Database, FileText, Filter } from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of companies table
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Company Data Platform
                </h1>
                <p className="text-sm text-gray-600">
                  Upload, clean, and explore company data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Database className="h-4 w-4" />
                <span>PostgreSQL</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>CSV Import</span>
              </div>
              <div className="flex items-center space-x-1">
                <Filter className="h-4 w-4" />
                <span>Smart Filters</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to the Company Data Platform
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload your company CSV files and let our intelligent system
                clean, normalize, and organize your data. Filter by country,
                employee size, and domain to find exactly what you're looking
                for.
              </p>
            </div>
          </section>

          {/* Upload Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Company Data
              </h3>
              <p className="text-sm text-gray-600">
                Upload a CSV file with company information. Our system will
                automatically clean and normalize the data, handling
                inconsistent formats and missing values.
              </p>
            </div>

            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </section>

          {/* Companies Table Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <CompaniesTable refreshTrigger={refreshTrigger} />
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Platform Features
              </h3>
              <p className="text-sm text-gray-600">
                Powerful tools for managing and exploring your company data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Smart CSV Processing
                </h4>
                <p className="text-sm text-gray-600">
                  Automatically clean and normalize messy CSV data with
                  intelligent pattern recognition and data validation.
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  PostgreSQL Storage
                </h4>
                <p className="text-sm text-gray-600">
                  Store your data in a robust PostgreSQL database with proper
                  indexing and duplicate handling.
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Advanced Filtering
                </h4>
                <p className="text-sm text-gray-600">
                  Filter companies by country, employee size, and domain with
                  real-time search capabilities.
                </p>
              </div>
            </div>
          </section>

          {/* Data Processing Info */}
          <section className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  Data Processing Pipeline
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Country names normalized to standard format (e.g., "us" →
                    "United States")
                  </li>
                  <li>
                    • Employee sizes categorized into standard buckets (1-10,
                    11-50, etc.)
                  </li>
                  <li>• Domain names cleaned and validated</li>
                  <li>• City names standardized and location data extracted</li>
                  <li>
                    • Original data preserved in JSON format for traceability
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS</p>
            <p className="mt-1">
              Intelligent data cleaning and normalization for company datasets
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
