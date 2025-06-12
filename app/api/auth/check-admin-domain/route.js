import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request) {
	try {
		const { emailDomain } = await request.json();

		if (!emailDomain) {
			return NextResponse.json(
				{ error: "Domain ending is required" },
				{ status: 400 }
			);
		}

		// Find any admin user whose email ends with the given domain ending (case-insensitive)
		const sql = `
            SELECT id FROM users
            WHERE role = 'admin'
            AND LOWER(email) LIKE ?
            LIMIT 1
        `;
		const likePattern = `%${emailDomain.toLowerCase()}`;
		const results = await query(sql, [likePattern]);

		if (results.length > 0) {
			return NextResponse.json({ exists: true });
		} else {
			return NextResponse.json({ exists: false });
		}
	} catch (error) {
		console.error("Error checking admin domain:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
