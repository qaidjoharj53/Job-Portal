import { NextResponse } from "next/server";
import { createJob, getJobsByCollege } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
	try {
		const user = await getCurrentUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const jobs = await getJobsByCollege(user.college_id);
		return NextResponse.json({ jobs });
	} catch (error) {
		console.error("Error fetching jobs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch jobs" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const user = await getCurrentUser(request);
		if (!user || user.role !== "admin") {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const {
			title,
			description,
			location,
			deadline,
			salaryRange,
			requirements,
		} = await request.json();

		if (!title || !description || !location || !deadline) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		await createJob(
			title,
			description,
			location,
			deadline,
			salaryRange,
			requirements,
			user.college_id,
			user.id
		);

		return NextResponse.json({ message: "Job posted successfully" });
	} catch (error) {
		console.error("Error creating job:", error);
		return NextResponse.json(
			{ error: "Failed to create job" },
			{ status: 500 }
		);
	}
}
