import OpenAI from "openai";
import { CleanedCompanyData, RawCompanyRow } from "./data-cleaning";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Standard format examples for the AI
const STANDARD_FORMAT_EXAMPLES = `
STANDARD FORMAT EXAMPLES:

Country Normalization:
- "us" → "United States"
- "USA" → "United States" 
- "united states of america" → "United States"
- "canada" → "Canada"
- "sweden" → "Sweden"
- "australia" → "Australia"
- "global" → "Global"

Employee Size Bucketing:
- "100000+" → "10 000+"
- "> 10000" → "10 000+"
- "~67000" → "10 000+"
- "221000" → "10 000+"
- "1500000" → "10 000+"
- "12500" → "1 001-5 000"
- "8000" → "1 001-5 000"
- "11" → "11-50"
- "10" → "11-50"
- "6" → "1-10"

Domain Cleaning:
- "apple. com" → "apple.com"
- "net flix.com" → "netflix.com"
- "stripecom" → "stripe.com"
- "microsoft .com" → "microsoft.com"
- "figma.  com" → "figma.com"
- "doordash com" → "doordash.com"
- "airbnb" → "airbnb.com"

Domain Generation (when missing):
- "Apple Inc." → "apple.com"
- "Microsoft Corporation" → "microsoft.com"
- "Tesla Inc." → "tesla.com"
- "Netflix" → "netflix.com"
- "Stripe" → "stripe.com"

City Standardization:
- "Cupertino, CA, USA" → "Cupertino"
- "Mountain View, California" → "Mountain View"
- "Redmond, WA" → "Redmond"
- "San Francisco, CA" → "San Francisco"
- "Stockholm, Sweden" → "Stockholm"
- "Sydney, NSW, AU" → "Sydney"
`;

// Available employee size buckets
const EMPLOYEE_SIZE_BUCKETS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1 000",
  "1 001-5 000",
  "5 001-10 000",
  "10 000+",
];

interface AIEnrichmentResult {
  company_name: string;
  domain: string;
  city: string;
  country: string;
  employee_size: string;
  confidence: number;
  reasoning: string;
}

// Helper function to generate a fallback domain from company name
function generateFallbackDomain(companyName: string): string {
  if (!companyName) return "unknown-company.com";

  // Clean the company name and create a domain
  const cleanName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single

  return `${cleanName}.com`;
}

export async function enrichCompanyWithAI(
  rawData: RawCompanyRow
): Promise<CleanedCompanyData> {
  try {
    const prompt = `
You are a data cleaning expert. Clean and standardize the following company data according to the examples provided.

${STANDARD_FORMAT_EXAMPLES}

AVAILABLE EMPLOYEE SIZE BUCKETS: ${EMPLOYEE_SIZE_BUCKETS.join(", ")}

RAW DATA:
Company Name: "${rawData.company_name || ""}"
Domain: "${rawData.domain || ""}"
City: "${rawData.city || ""}"
Country: "${rawData.country || ""}"
Employee Size: "${rawData.employee_size || ""}"

Please return a JSON object with the following structure:
{
  "company_name": "cleaned company name",
  "domain": "cleaned domain (lowercase, no spaces, valid format)",
  "city": "cleaned city name",
  "country": "standardized country name",
  "employee_size": "one of the available buckets",
  "confidence": 0.95,
  "reasoning": "brief explanation of changes made"
}

CRITICAL RULES:
1. DOMAIN IS MANDATORY: You must ALWAYS provide a domain. If the domain is missing, invalid, or unclear, generate a logical domain based on the company name (e.g., "Apple Inc." → "apple.com")
2. Domain format: lowercase, no spaces, must end with .com, .org, .net, etc.
3. If employee size cannot be determined, return empty string
4. If country cannot be determined, return empty string
5. Always return valid JSON
6. Confidence should be between 0 and 1
7. Never return an empty domain - always generate one if needed
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a data cleaning expert. Always respond with valid JSON only. NEVER return an empty domain - always generate a logical domain for every company.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let aiResult: AIEnrichmentResult;
    try {
      aiResult = JSON.parse(response);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${parseError}`);
    }

    // Validate the result
    if (!aiResult.company_name) {
      throw new Error("AI failed to provide company name");
    }

    // Ensure domain is always provided - generate fallback if needed
    let domain = aiResult.domain || "";
    if (!domain || domain.trim() === "") {
      domain = generateFallbackDomain(aiResult.company_name);
    }

    return {
      company_name: aiResult.company_name,
      domain: domain,
      city: aiResult.city || "",
      country: aiResult.country || "",
      employee_size: aiResult.employee_size || "",
      raw_json: rawData,
    };
  } catch (error) {
    console.error("AI enrichment failed:", error);

    // Enhanced fallback - always generate a domain
    const fallbackDomain = generateFallbackDomain(rawData.company_name || "");

    return {
      company_name: rawData.company_name || "",
      domain: fallbackDomain,
      city: "",
      country: "",
      employee_size: "",
      raw_json: rawData,
    };
  }
}

// Batch processing with AI
export async function enrichCompaniesWithAI(
  rawData: RawCompanyRow[]
): Promise<CleanedCompanyData[]> {
  const results: CleanedCompanyData[] = [];

  // Process in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < rawData.length; i += batchSize) {
    const batch = rawData.slice(i, i + batchSize);

    const batchPromises = batch.map(async (row) => {
      try {
        return await enrichCompanyWithAI(row);
      } catch (error) {
        console.error(`Failed to enrich company: ${row.company_name}`, error);
        // Return enhanced fallback - always generate a domain
        const fallbackDomain = generateFallbackDomain(row.company_name || "");
        return {
          company_name: row.company_name || "",
          domain: fallbackDomain,
          city: "",
          country: "",
          employee_size: "",
          raw_json: row,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches to respect rate limits
    if (i + batchSize < rawData.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results.filter((company) => company.company_name); // Filter out empty companies
}
