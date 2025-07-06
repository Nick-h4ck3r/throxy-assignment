import { NextResponse } from "next/server";
import { companyQueries } from "@/lib/database";

export async function GET() {
  try {
    const countries = await companyQueries.getCountries();

    return NextResponse.json({
      success: true,
      data: countries,
      count: countries.length,
    });
  } catch (error) {
    console.error("Countries API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch countries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
