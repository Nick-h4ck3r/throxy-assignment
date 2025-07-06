import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse";
import { companyQueries } from "@/lib/database";
import {
  cleanCompanyData,
  enrichCompanyData,
  getCleaningStats,
  type RawCompanyRow,
} from "@/lib/data-cleaning";

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a CSV file." },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Parse CSV
    const parseResult = parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names
        return header.toLowerCase().trim().replace(/\s+/g, "_");
      },
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: "Failed to parse CSV file", details: parseResult.errors },
        { status: 400 }
      );
    }

    const rawData = parseResult.data as RawCompanyRow[];

    if (rawData.length === 0) {
      return NextResponse.json(
        { error: "No valid data found in CSV file" },
        { status: 400 }
      );
    }

    // Prepare raw data for AI processing
    const rawDataForAI = cleanCompanyData(rawData);

    if (rawDataForAI.length === 0) {
      return NextResponse.json(
        { error: "No valid companies found in CSV data" },
        { status: 400 }
      );
    }

    // Process data with AI enrichment
    const enrichedData = await enrichCompanyData(rawDataForAI);

    // Insert data into database
    const insertedCompanies = await companyQueries.upsertCompanies(
      enrichedData
    );

    // Get cleaning statistics
    const stats = getCleaningStats(rawData, enrichedData);

    return NextResponse.json({
      success: true,
      message: "CSV file processed successfully",
      data: {
        inserted_count: insertedCompanies.length,
        stats,
        sample_companies: insertedCompanies.slice(0, 3), // Show first 3 companies as sample
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to process CSV file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "CSV Upload API",
    endpoint: "POST /api/upload",
    description: "Upload a CSV file with company data",
    accepted_format: "multipart/form-data with file field",
    required_columns: [
      "company_name",
      "domain",
      "city",
      "country",
      "employee_size",
    ],
  });
}
