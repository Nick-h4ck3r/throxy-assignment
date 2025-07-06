"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import CompaniesTable from "@/components/companies-table";
import Logo from "@/components/Logo";
import AnimatedCounter from "@/components/AnimatedCounter";
import AnimatedSection from "@/components/AnimatedSection";
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
      <header className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 animate-fade-in">
              <Logo className="w-8 h-8 text-black" />
              <div>
                <h1 className="text-xl font-semibold text-black">DataFlow</h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  AI-powered data intelligence
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600 animate-fade-in">
              <span className="hover:text-black transition-colors cursor-pointer">
                Our Process
              </span>
              <span className="hover:text-black transition-colors cursor-pointer">
                FAQ
              </span>
              <span className="hover:text-black transition-colors cursor-pointer">
                Careers
              </span>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 cursor-pointer">
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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-8 animate-fade-in-up">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              AI-Powered Data Intelligence Platform
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-black mb-6 leading-[0.95] tracking-tight max-w-5xl mx-auto animate-fade-in-up animation-delay-200">
              We clean your company data with AI precision
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-normal animate-fade-in-up animation-delay-400">
              Upload messy CSV files and watch our AI instantly clean,
              normalize, and organize your company data. No coding required, no
              manual rules – just intelligent data processing.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
              <button
                onClick={scrollToUpload}
                className="inline-flex items-center px-8 py-4 bg-purple-100 text-black font-medium rounded-lg hover:bg-purple-200 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                <Upload className="h-5 w-5 mr-2" />
                Start Processing Data
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-normal">
              Built for modern data teams who need intelligent, automated
              solutions
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <AnimatedSection
              delay={200}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
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
            </AnimatedSection>

            {/* Feature 2 */}
            <AnimatedSection
              delay={300}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Zero Manual Rules
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                No coding, no configuration, no manual mapping. Just upload your
                data and let our AI handle all the complexity automatically.
              </p>
            </AnimatedSection>

            {/* Feature 3 */}
            <AnimatedSection
              delay={400}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
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
            </AnimatedSection>

            {/* Feature 4 */}
            <AnimatedSection
              delay={500}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Real-time Processing
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Watch your data transform in real-time with intelligent batch
                processing and live progress updates.
              </p>
            </AnimatedSection>

            {/* Feature 5 */}
            <AnimatedSection
              delay={600}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <Filter className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Advanced Filtering
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Filter and search your cleaned data by country, employee size,
                domain, and more with lightning-fast performance.
              </p>
            </AnimatedSection>

            {/* Feature 6 */}
            <AnimatedSection
              delay={700}
              className="feature-card group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 bg-gray-100 rounded-xl w-fit mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-medium text-black mb-3 tracking-tight">
                Data Insights
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Get instant insights into your data quality, cleaning
                statistics, and processing results with detailed analytics.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-normal">
              Upload your CSV file and watch the magic happen
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={200}
            className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Companies Table Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-4 tracking-tight">
              Your Processed Data
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 font-normal">
              Explore and filter your cleaned company data
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={200}
            className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <CompaniesTable refreshTrigger={refreshTrigger} />
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              TESTIMONIALS
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 tracking-tight">
              Trusted by teams processing data for manufacturing, education &
              medical.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection
              delay={200}
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <AnimatedCounter
                end={10000}
                suffix="+"
                duration={2500}
                className="text-4xl font-medium text-white mb-2"
              />
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Files Processed Per Week
              </div>
            </AnimatedSection>
            <AnimatedSection
              delay={400}
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <AnimatedCounter
                end={98}
                suffix="%"
                duration={2200}
                className="text-4xl font-medium text-white mb-2"
              />
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Data Accuracy Rate
              </div>
            </AnimatedSection>
            <AnimatedSection
              delay={600}
              className="text-center hover:scale-105 transition-transform duration-300"
            >
              <AnimatedCounter
                end={24}
                duration={1800}
                className="text-4xl font-medium text-white mb-2"
              />
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                Hours Processing Time
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Logo className="w-8 h-8 text-white" />
              <span className="text-xl font-medium">DataFlow</span>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">
                Our Process
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                FAQ
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Careers
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Terms
              </span>
            </div>
          </AnimatedSection>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 DataFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
