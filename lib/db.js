// Database connection and utility functions
import mysql from "mysql2/promise";

const dbConfig = {
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "job_portal",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
};

let pool;

export function getPool() {
	if (!pool) {
		pool = mysql.createPool(dbConfig);
	}
	return pool;
}

// // initialize database with tables if they don't exist through scripts present in sccripts folder
// const connection = getPool();
// const scripts = [
// 	"../../scripts/01-create-tables.sql",
// 	"../../scripts/02-seed-data.sql",
// ];

// for (const script of scripts) {
// 	const sql = await import(script);
// 	await connection.query(sql.default);
// }

export async function query(sql, params = []) {
	const connection = getPool();
	try {
		const [results] = await connection.execute(sql, params);
		return results;
	} catch (error) {
		console.error("Database query error:", error);
		throw error;
	}
}

// User operations
export async function createUser(
	email,
	hashedPassword,
	name,
	role,
	collegeId = null
) {
	const sql =
		"INSERT INTO users (email, password, name, role, college_id) VALUES (?, ?, ?, ?, ?)";
	return await query(sql, [email, hashedPassword, name, role, collegeId]);
}

export async function getUserByEmail(email) {
	const sql =
		"SELECT u.*, c.name as college_name FROM users u LEFT JOIN colleges c ON u.college_id = c.id WHERE u.email = ?";
	const results = await query(sql, [email]);
	return results[0];
}

export async function getUserById(id) {
	const sql =
		"SELECT u.*, c.name as college_name FROM users u LEFT JOIN colleges c ON u.college_id = c.id WHERE u.id = ?";
	const results = await query(sql, [id]);
	return results[0];
}

// College operations
export async function getAllColleges() {
	const sql = "SELECT * FROM colleges ORDER BY name";
	return await query(sql);
}

export async function createCollege(name, email, location) {
	const sql = "INSERT INTO colleges (name, email, location) VALUES (?, ?, ?)";
	return await query(sql, [name, email, location]);
}

// Job operations
export async function createJob(
	title,
	description,
	location,
	deadline,
	salaryRange,
	requirements,
	collegeId,
	postedBy
) {
	const sql =
		"INSERT INTO jobs (title, description, location, deadline, salary_range, requirements, college_id, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	return await query(sql, [
		title,
		description,
		location,
		deadline,
		salaryRange,
		requirements,
		collegeId,
		postedBy,
	]);
}

export async function getJobsByCollege(collegeId) {
	const sql = `
        SELECT 
            j.*, 
            u.name as posted_by_name, 
            c.name as college_name,
            COUNT(ja.id) as applications_count
        FROM jobs j
        JOIN users u ON j.posted_by = u.id
        JOIN colleges c ON j.college_id = c.id
        LEFT JOIN job_applications ja ON ja.job_id = j.id
        WHERE j.college_id = ?
        GROUP BY j.id
        ORDER BY j.created_at DESC
    `;
	return await query(sql, [collegeId]);
}

export async function getJobById(id) {
	const sql = `
    SELECT j.*, u.name as posted_by_name, c.name as college_name 
    FROM jobs j 
    JOIN users u ON j.posted_by = u.id 
    JOIN colleges c ON j.college_id = c.id 
    WHERE j.id = ?
  `;
	const results = await query(sql, [id]);
	return results[0];
}

// Application operations
export async function applyToJob(jobId, studentId) {
	const sql =
		"INSERT INTO job_applications (job_id, student_id) VALUES (?, ?)";
	return await query(sql, [jobId, studentId]);
}

export async function checkIfApplied(jobId, studentId) {
	const sql =
		"SELECT * FROM job_applications WHERE job_id = ? AND student_id = ?";
	const results = await query(sql, [jobId, studentId]);
	return results.length > 0;
}

export async function getApplicationsByStudent(studentId) {
	const sql = `
    SELECT ja.*, j.title, j.location, j.deadline, c.name as college_name
    FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    JOIN colleges c ON j.college_id = c.id
    WHERE ja.student_id = ?
    ORDER BY ja.applied_at DESC
  `;
	return await query(sql, [studentId]);
}
