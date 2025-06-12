import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Get all applications for a specific job
export async function GET(request, { params }) {
	try {
		const user = await getCurrentUser(request);
		if (!user || user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const jobId = await params.jobId;

		// First check if the job belongs to the admin's college
		const jobCheck = await query(
			"SELECT * FROM jobs WHERE id = ? AND college_id = ?",
			[jobId, user.college_id]
		);

		if (jobCheck.length === 0) {
			return NextResponse.json(
				{ error: "Job not found or access denied" },
				{ status: 404 }
			);
		}

		// Get all applications for this job with student details
		const applications = await query(
			`
      SELECT 
        ja.id, 
        ja.status, 
        ja.applied_at,
        u.id as student_id, 
        u.name as student_name, 
        u.email as student_email
      FROM applications ja
      JOIN users u ON ja.student_id = u.id
      WHERE ja.job_id = ?
      ORDER BY ja.applied_at DESC
    `,
			[jobId]
		);

		return NextResponse.json({ applications });
	} catch (error) {
		console.error("Error fetching applications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch applications" },
			{ status: 500 }
		);
	}
}
