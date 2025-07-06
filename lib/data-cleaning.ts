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

// AI-only data processing - no hardcoded cleaning functions
export function cleanCompanyData(
  rawData: RawCompanyRow[]
): CleanedCompanyData[] {
  // Simply pass through raw data for AI processing
  return rawData
    .map((row) => ({
      company_name: row.company_name || "",
      domain: row.domain || "",
      city: row.city || "",
      country: row.country || "",
      employee_size: row.employee_size || "",
      raw_json: row,
    }))
    .filter((company) => company.company_name); // Filter out companies without names
}

// AI-based enrichment function
export async function enrichCompanyData(
  companies: CleanedCompanyData[]
): Promise<CleanedCompanyData[]> {
  // Import AI enrichment dynamically to avoid issues if AI key is not set
  try {
    const { enrichCompaniesWithAI } = await import("./ai-enrichment");

    // Convert back to raw format for AI processing
    const rawData: RawCompanyRow[] = companies.map((company) => ({
      company_name: company.company_name,
      domain: company.domain,
      city: company.city,
      country: company.country,
      employee_size: company.employee_size,
      ...company.raw_json,
    }));

    // Use AI enrichment
    return await enrichCompaniesWithAI(rawData);
  } catch (error) {
    console.warn("AI enrichment not available, returning raw data:", error);
    return companies;
  }
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
