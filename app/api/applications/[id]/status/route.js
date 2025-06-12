import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Update application status (accept/reject)
export async function PUT(request, { params }) {
	try {
		const user = await getCurrentUser(request);
		if (!user || user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { status } = await request.json();
		const applicationId = params.id;

		if (!status || !["accepted", "rejected", "pending"].includes(status)) {
			return NextResponse.json(
				{ error: "Invalid status" },
				{ status: 400 }
			);
		}

		// First check if the application is for a job from the admin's college
		const applicationCheck = await query(
			`
      SELECT ja.id 
      FROM applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.id = ? AND j.college_id = ?
    `,
			[applicationId, user.college_id]
		);

		if (applicationCheck.length === 0) {
			return NextResponse.json(
				{ error: "Application not found or access denied" },
				{ status: 404 }
			);
		}

		// Update the application status
		await query("UPDATE applications SET status = ? WHERE id = ?", [
			status,
			applicationId,
		]);

		return NextResponse.json({
			message: "Application status updated successfully",
		});
	} catch (error) {
		console.error("Error updating application status:", error);
		return NextResponse.json(
			{ error: "Failed to update application status" },
			{ status: 500 }
		);
	}
}
