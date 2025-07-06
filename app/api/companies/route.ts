import { NextRequest, NextResponse } from "next/server";
import { companyQueries } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const filters = {
      country: searchParams.get("country") || undefined,
      employee_size: searchParams.get("employee_size") || undefined,
      domain: searchParams.get("domain") || undefined,
    };

    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    // Get companies with filters
    const companies = await companyQueries.getCompanies(activeFilters);

    return NextResponse.json({
      success: true,
      data: companies,
      count: companies.length,
      filters: activeFilters,
    });
  } catch (error) {
    console.error("Companies API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch companies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
