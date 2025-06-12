import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, getUserById } from "./db.js";

const JWT_SECRET =
	process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
	return jwt.sign(
		{
			userId: user.id,
			email: user.email,
			role: user.role,
			collegeId: user.college_id,
		},
		JWT_SECRET,
		{ expiresIn: "7d" }
	);
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

export async function authenticateUser(email, password) {
	const user = await getUserByEmail(email);
	if (!user) {
		return null;
	}

	const isValid = await verifyPassword(password, user.password);
	if (!isValid) {
		return null;
	}

	return user;
}

export function getTokenFromRequest(req) {
	const authHeader = req.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.substring(7);
	}
	return null;
}

export async function getCurrentUser(req) {
	const token = getTokenFromRequest(req);
	if (!token) {
		return null;
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return null;
	}

	return await getUserById(decoded.userId);
}
