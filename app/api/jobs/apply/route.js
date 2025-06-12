import { NextResponse } from "next/server"
import { applyToJob, checkIfApplied, getJobById } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request) {
  try {
    const user = await getCurrentUser(request)
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    // Check if job exists and belongs to student's college
    const job = await getJobById(jobId)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.college_id !== user.college_id) {
      return NextResponse.json({ error: "You can only apply to jobs from your college" }, { status: 403 })
    }

    // Check if already applied
    const alreadyApplied = await checkIfApplied(jobId, user.id)
    if (alreadyApplied) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 400 })
    }

    await applyToJob(jobId, user.id)

    return NextResponse.json({ message: "Application submitted successfully" })
  } catch (error) {
    console.error("Error applying to job:", error)
    return NextResponse.json({ error: "Failed to apply to job" }, { status: 500 })
  }
}
