import { EMPLOYEE_SIZE_BUCKETS, type EmployeeSizeBucket } from "./database";

// Raw CSV row interface
export interface RawCompanyRow {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  [key: string]: any;
}

// Cleaned company data interface
export interface CleanedCompanyData {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  raw_json: any;
}

// Country normalization mapping
const COUNTRY_MAPPING: Record<string, string> = {
  us: "United States",
  usa: "United States",
  "united states": "United States",
  "united states of america": "United States",
  "united-states": "United States",
  unitedstates: "United States",
  "u s a": "United States",
  canada: "Canada",
  sweden: "Sweden",
  australia: "Australia",
  au: "Australia",
  global: "Global",
  remote: "Global",
};

// Employee size parsing patterns
const EMPLOYEE_SIZE_PATTERNS = [
  {
    pattern: /^(\d+)\+?$/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1])),
  },
  {
    pattern: /^>?\s*(\d+)k?$/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(
        parseInt(match[1]) * (match[1].includes("k") ? 1000 : 1)
      ),
  },
  {
    pattern: /^~(\d+)$/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1])),
  },
  {
    pattern: /^(\d+)\s*[-–]\s*(\d+)$/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[2])),
  },
  {
    pattern: /^(\d+)\s*,\s*(\d+)$/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1]) * 1000 + parseInt(match[2])),
  },
  {
    pattern: /(\d+)\s*,\s*(\d+)/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1]) * 1000 + parseInt(match[2])),
  },
  {
    pattern: /(\d+)\s*k/i,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1]) * 1000),
  },
  {
    pattern: /(\d+)/,
    handler: (match: RegExpMatchArray) =>
      categorizeEmployeeCount(parseInt(match[1])),
  },
];

// Categorize employee count into buckets
function categorizeEmployeeCount(count: number): EmployeeSizeBucket {
  if (count <= 10) return "1-10";
  if (count <= 50) return "11-50";
  if (count <= 200) return "51-200";
  if (count <= 500) return "201-500";
  if (count <= 1000) return "501-1 000";
  if (count <= 5000) return "1 001-5 000";
  if (count <= 10000) return "5 001-10 000";
  return "10 000+";
}

// Clean and normalize country names
function cleanCountry(country: string): string {
  if (!country) return "";

  const cleaned = country.toLowerCase().trim();
  const normalized = COUNTRY_MAPPING[cleaned];

  if (normalized) {
    return normalized;
  }

  // Extract country from location strings
  if (
    cleaned.includes("united states") ||
    cleaned.includes("usa") ||
    cleaned.includes("california") ||
    cleaned.includes("ca,") ||
    cleaned.includes("ca ")
  ) {
    return "United States";
  }

  if (cleaned.includes("canada")) {
    return "Canada";
  }

  if (cleaned.includes("sweden")) {
    return "Sweden";
  }

  if (cleaned.includes("australia")) {
    return "Australia";
  }

  // Capitalize first letter of each word
  return country
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Clean and normalize employee size
function cleanEmployeeSize(employeeSize: string): string {
  if (!employeeSize) return "";

  const cleaned = employeeSize.toLowerCase().trim().replace(/[,\s]/g, "");

  // Try each pattern
  for (const { pattern, handler } of EMPLOYEE_SIZE_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match) {
      return handler(match);
    }
  }

  return "";
}

// Clean and normalize domain
function cleanDomain(domain: string): string {
  if (!domain) return "";

  let cleaned = domain.toLowerCase().trim();

  // Remove common prefixes
  cleaned = cleaned.replace(/^https?:\/\//, "");
  cleaned = cleaned.replace(/^www\./, "");

  // Remove spaces and special characters
  cleaned = cleaned.replace(/\s+/g, "");

  // Handle missing extensions
  if (cleaned && !cleaned.includes(".") && !cleaned.includes(" ")) {
    // If it looks like a domain without extension, add .com
    cleaned = cleaned + ".com";
  }

  // Remove trailing paths
  cleaned = cleaned.split("/")[0];

  // Validate domain format
  if (
    cleaned &&
    /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(cleaned)
  ) {
    return cleaned;
  }

  return "";
}

// Clean and normalize city
function cleanCity(city: string): string {
  if (!city) return "";

  let cleaned = city.trim();

  // Remove state/country information
  cleaned = cleaned.replace(
    /,\s*(CA|California|USA|United States|US|WA|Washington|NY|New York|FL|Florida|TX|Texas|MA|Massachusetts|MT|Montana|NSW|AU|Australia|Sweden|Canada|Ontario).*$/i,
    ""
  );

  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Capitalize first letter of each word
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Clean and normalize company name
function cleanCompanyName(companyName: string): string {
  if (!companyName) return "";

  let cleaned = companyName.trim();

  // Handle cases where company name is mixed with other data
  if (cleaned.includes("\t")) {
    cleaned = cleaned.split("\t")[0];
  }

  return cleaned;
}

// Main data cleaning function
export function cleanCompanyData(
  rawData: RawCompanyRow[]
): CleanedCompanyData[] {
  return rawData
    .map((row) => {
      const cleanedData: CleanedCompanyData = {
        company_name: cleanCompanyName(row.company_name || ""),
        domain: cleanDomain(row.domain || ""),
        city: cleanCity(row.city || ""),
        country: cleanCountry(row.country || ""),
        employee_size: cleanEmployeeSize(row.employee_size || ""),
        raw_json: row,
      };

      return cleanedData;
    })
    .filter((company) => company.company_name); // Filter out companies without names
}

// AI-based enrichment function (optional enhancement)
export async function enrichCompanyData(
  companies: CleanedCompanyData[]
): Promise<CleanedCompanyData[]> {
  // This would use OpenAI API to enrich missing data
  // For now, return the data as-is
  // TODO: Implement AI enrichment for missing fields
  return companies;
}

// Validation function
export function validateCompanyData(data: CleanedCompanyData): boolean {
  return Boolean(data.company_name && data.company_name.trim());
}

// Get summary statistics
export function getCleaningStats(
  original: RawCompanyRow[],
  cleaned: CleanedCompanyData[]
) {
  const stats = {
    total_processed: original.length,
    successful_cleaned: cleaned.length,
    failed_cleaning: original.length - cleaned.length,
    countries_normalized: cleaned.filter((c) => c.country).length,
    domains_cleaned: cleaned.filter((c) => c.domain).length,
    employee_sizes_categorized: cleaned.filter((c) => c.employee_size).length,
    cities_cleaned: cleaned.filter((c) => c.city).length,
  };

  return stats;
}
