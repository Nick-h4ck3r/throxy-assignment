"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ExternalLink,
  Building,
  MapPin,
  Users,
  Globe,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Company {
  id: string;
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  raw_json: any;
  created_at: string;
  updated_at: string;
}

interface CompaniesTableProps {
  refreshTrigger?: number;
}

type SortOrder = "asc" | "desc" | "none";

export default function CompaniesTable({
  refreshTrigger = 0,
}: CompaniesTableProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [employeeSizes, setEmployeeSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEmployeeSize, setSelectedEmployeeSize] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  // Sort companies based on current sort order
  const sortedCompanies = useMemo(() => {
    if (sortOrder === "none") return companies;

    return [...companies].sort((a, b) => {
      const nameA = a.company_name.toLowerCase();
      const nameB = b.company_name.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }, [companies, sortOrder]);

  // Toggle sort order
  const toggleSort = () => {
    setSortOrder((current) => {
      if (current === "none") return "asc";
      if (current === "asc") return "desc";
      return "none";
    });
  };

  // Get sort icon based on current sort order
  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedCountry) params.append("country", selectedCountry);
      if (selectedEmployeeSize)
        params.append("employee_size", selectedEmployeeSize);
      if (domainFilter) params.append("domain", domainFilter);

      const response = await fetch(`/api/companies?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setCompanies(result.data);
      } else {
        setError(result.error || "Failed to fetch companies");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch companies"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [countriesRes, sizesRes] = await Promise.all([
        fetch("/api/countries"),
        fetch("/api/employee-sizes"),
      ]);

      const countriesData = await countriesRes.json();
      const sizesData = await sizesRes.json();

      if (countriesData.success) setCountries(countriesData.data);
      if (sizesData.success) setEmployeeSizes(sizesData.data);
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchCompanies();
  }, [selectedCountry, selectedEmployeeSize, domainFilter, refreshTrigger]);

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, [refreshTrigger]);

  // Clear filters
  const clearFilters = () => {
    setSelectedCountry("");
    setSelectedEmployeeSize("");
    setDomainFilter("");
  };

  // Check if filters are active
  const hasActiveFilters =
    selectedCountry || selectedEmployeeSize || domainFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading companies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="text-red-600">⚠️</div>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="text-sm text-gray-600">
            {companies.length} companies found
            {hasActiveFilters && " (filtered)"}
            {sortOrder !== "none" && (
              <span className="ml-1">
                • Sorted {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSort}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title={`Sort ${
              sortOrder === "none"
                ? "A-Z"
                : sortOrder === "asc"
                ? "Z-A"
                : "Default"
            }`}
          >
            {getSortIcon()}
            <span>Sort</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Size
              </label>
              <select
                value={selectedEmployeeSize}
                onChange={(e) => setSelectedEmployeeSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sizes</option>
                {employeeSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Domain Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domain
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  placeholder="Search domains..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      {companies.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No companies found</p>
          {hasActiveFilters && (
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your filters or upload a CSV file
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>Company</span>
                      <button
                        onClick={toggleSort}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title={`Sort ${
                          sortOrder === "none"
                            ? "A-Z"
                            : sortOrder === "asc"
                            ? "Z-A"
                            : "Default"
                        }`}
                      >
                        {getSortIcon()}
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Size
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {company.company_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        {company.domain ? (
                          <a
                            href={`https://${company.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            {company.domain}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No domain
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {company.city && company.country ? (
                            `${company.city}, ${company.country}`
                          ) : company.country ? (
                            company.country
                          ) : company.city ? (
                            company.city
                          ) : (
                            <span className="text-gray-500">Unknown</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {company.employee_size || "Unknown"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
