import { NextResponse } from "next/server"
import { createUser, getAllColleges, createCollege } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function GET() {
  try {
    const colleges = await getAllColleges()
    return NextResponse.json({ colleges })
  } catch (error) {
    console.error("Error fetching colleges:", error)
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, password, name, role, collegeId, collegeName, collegeEmail, collegeLocation } = await request.json()

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    let finalCollegeId = collegeId

    // If admin is registering and creating a new college
    if (role === "admin" && !collegeId && collegeName) {
      try {
        const result = await createCollege(collegeName, collegeEmail, collegeLocation)
        finalCollegeId = result.insertId
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return NextResponse.json({ error: "College already exists" }, { status: 400 })
        }
        throw error
      }
    }

    // Create user
    try {
      const result = await createUser(email, hashedPassword, name, role, finalCollegeId)

      // Generate token
      const user = {
        id: result.insertId,
        email,
        name,
        role,
        college_id: finalCollegeId,
      }

      const token = generateToken(user)

      return NextResponse.json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          collegeId: user.college_id,
        },
      })
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
