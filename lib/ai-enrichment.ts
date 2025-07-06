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

Rules:
1. If domain is missing or invalid, return empty string
2. If employee size cannot be determined, return empty string
3. If country cannot be determined, return empty string
4. Always return valid JSON
5. Confidence should be between 0 and 1
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a data cleaning expert. Always respond with valid JSON only.",
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

    return {
      company_name: aiResult.company_name,
      domain: aiResult.domain || "",
      city: aiResult.city || "",
      country: aiResult.country || "",
      employee_size: aiResult.employee_size || "",
      raw_json: rawData,
    };
  } catch (error) {
    console.error("AI enrichment failed:", error);

    // Minimal fallback - just return the company name
    return {
      company_name: rawData.company_name || "",
      domain: "",
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
        // Return minimal fallback - just the company name
        return {
          company_name: row.company_name || "",
          domain: "",
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
