import { createClient } from "@supabase/supabase-js";

// Database types
export interface Company {
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

export interface CompanyInsert {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  raw_json: any;
}

// Employee size buckets
export const EMPLOYEE_SIZE_BUCKETS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1 000",
  "1 001-5 000",
  "5 001-10 000",
  "10 000+",
] as const;

export type EmployeeSizeBucket = (typeof EMPLOYEE_SIZE_BUCKETS)[number];

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Database queries
export const companyQueries = {
  // Get all companies with optional filtering
  async getCompanies(filters?: {
    country?: string;
    employee_size?: string;
    domain?: string;
  }) {
    let query = supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.country) {
      query = query.ilike("country", `%${filters.country}%`);
    }

    if (filters?.employee_size) {
      query = query.eq("employee_size", filters.employee_size);
    }

    if (filters?.domain) {
      query = query.ilike("domain", `%${filters.domain}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return data as Company[];
  },

  // Insert or update companies
  async upsertCompanies(companies: CompanyInsert[]) {
    const { data, error } = await supabase
      .from("companies")
      .upsert(companies, {
        onConflict: "company_name,domain",
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      throw new Error(`Failed to upsert companies: ${error.message}`);
    }

    return data as Company[];
  },

  // Get unique countries
  async getCountries() {
    const { data, error } = await supabase
      .from("companies")
      .select("country")
      .not("country", "is", null)
      .not("country", "eq", "");

    if (error) {
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }

    const uniqueCountries = [
      ...new Set(data.map((item) => item.country)),
    ].sort();
    return uniqueCountries;
  },

  // Get unique employee sizes
  async getEmployeeSizes() {
    const { data, error } = await supabase
      .from("companies")
      .select("employee_size")
      .not("employee_size", "is", null)
      .not("employee_size", "eq", "");

    if (error) {
      throw new Error(`Failed to fetch employee sizes: ${error.message}`);
    }

    const uniqueSizes = [
      ...new Set(data.map((item) => item.employee_size)),
    ].sort();
    return uniqueSizes;
  },
};
