import { NextResponse } from "next/server";
import { companyQueries, EMPLOYEE_SIZE_BUCKETS } from "@/lib/database";

export async function GET() {
  try {
    const employeeSizes = await companyQueries.getEmployeeSizes();

    return NextResponse.json({
      success: true,
      data: employeeSizes,
      count: employeeSizes.length,
      available_buckets: EMPLOYEE_SIZE_BUCKETS,
    });
  } catch (error) {
    console.error("Employee sizes API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch employee sizes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
