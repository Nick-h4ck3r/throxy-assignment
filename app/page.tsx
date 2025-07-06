"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import CompaniesTable from "@/components/companies-table";
import {
  Building,
  Database,
  FileText,
  Filter,
  Upload,
  Zap,
  Shield,
  BarChart3,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of companies table
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-black">DataFlow</h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  AI-powered data intelligence
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
              <span>Our Process</span>
              <span>FAQ</span>
              <span>Careers</span>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                Strategy Call
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Data Intelligence Platform
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-black mb-6 leading-[0.95] tracking-tight max-w-5xl mx-auto">
              We clean your company data with AI precision
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-normal">
              Upload messy CSV files and watch our AI instantly clean,
              normalize, and organize your company data. No coding required, no
              manual rules – just intelligent data processing.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={scrollToUpload}
                className="inline-flex items-center px-8 py-4 bg-purple-100 text-black font-medium rounded-lg hover:bg-purple-200 transition-all duration-200"
              >
                <Upload className="h-5 w-5 mr-2" />
                Start Processing Data
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-normal">
              Built for modern data teams who need intelligent, automated
              solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <Sparkles className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Pure AI Intelligence
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Our AI understands messy data patterns and automatically cleans
                everything – from country names to employee sizes to domain
                formats.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Zero Manual Rules
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                No coding, no configuration, no manual mapping. Just upload your
                data and let our AI handle all the complexity automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <Database className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Enterprise Database
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Your data is stored in PostgreSQL with proper indexing,
                duplicate handling, and full traceability of all
                transformations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Real-time Processing
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Watch your data transform in real-time with intelligent batch
                processing and live progress updates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <Filter className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Advanced Filtering
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Filter and search your cleaned data by country, employee size,
                domain, and more with lightning-fast performance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6">
                <BarChart3 className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Data Insights
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Get instant insights into your data quality, cleaning
                statistics, and processing results with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-normal">
              Upload your CSV file and watch the magic happen
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </div>
      </section>

      {/* Companies Table Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Your Processed Data
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-normal">
              Explore and filter your cleaned company data
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <CompaniesTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              TESTIMONIALS
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 tracking-tight">
              Trusted by teams processing data for manufacturing, education &
              medical.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-medium text-white mb-2">10K+</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Files Processed Per Week
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-medium text-white mb-2">98%</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Data Accuracy Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-medium text-white mb-2">24</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Hours Processing Time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-white rounded-lg">
                <Building className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-medium">DataFlow</span>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <span>Our Process</span>
              <span>FAQ</span>
              <span>Careers</span>
              <span>Privacy Policy</span>
              <span>Terms</span>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 DataFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
