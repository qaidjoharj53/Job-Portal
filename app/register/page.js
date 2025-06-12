"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		role: "",
		collegeId: "",
		collegeName: "",
		collegeLocation: "",
	});
	const [colleges, setColleges] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showNewCollege, setShowNewCollege] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { register } = useAuth();
	const router = useRouter();

	useEffect(() => {
		fetchColleges();
	}, []);

	const fetchColleges = async () => {
		try {
			const response = await fetch("/api/auth/register");
			const data = await response.json();
			setColleges(data.colleges || []);
		} catch (error) {
			console.error("Error fetching colleges:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		const result = await register(formData);

		if (result.success) {
			router.push("/");
		} else {
			setError(result.error);
		}

		setLoading(false);
	};

	const handleRoleChange = (role) => {
		setFormData({ ...formData, role });
		if (role === "admin") {
			setShowNewCollege(true);
		} else {
			setShowNewCollege(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">
						Create Account
					</CardTitle>
					<CardDescription className="text-center">
						Sign up to access the job portal
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								required
								placeholder="Enter your full name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({
										...formData,
										email: e.target.value,
									})
								}
								required
								placeholder="Enter your email"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) =>
										setFormData({
											...formData,
											password: e.target.value,
										})
									}
									required
									placeholder="Enter your password"
								/>
								<button
									type="button"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
									onClick={() => setShowPassword((v) => !v)}
									tabIndex={-1}
									aria-label={
										showPassword
											? "Hide password"
											: "Show password"
									}>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									value={formData.confirmPassword || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											confirmPassword: e.target.value,
										})
									}
									required
									placeholder="Re-enter your password"
								/>
								<button
									type="button"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
									onClick={() =>
										setShowConfirmPassword((v) => !v)
									}
									tabIndex={-1}
									aria-label={
										showConfirmPassword
											? "Hide password"
											: "Show password"
									}>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Role</Label>
							<Select onValueChange={handleRoleChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student">
										Student
									</SelectItem>
									<SelectItem value="admin">
										College Admin
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{formData.role === "student" && (
							<div className="space-y-2">
								<Label>College</Label>
								<Select
									onValueChange={(value) =>
										setFormData({
											...formData,
											collegeId: value,
										})
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select your college" />
									</SelectTrigger>
									<SelectContent>
										{colleges.map((college) => (
											<SelectItem
												key={college.id}
												value={college.id.toString()}>
												{college.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{formData.role === "admin" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="collegeName">
										College Name
									</Label>
									<Input
										id="collegeName"
										value={formData.collegeName}
										onChange={(e) =>
											setFormData({
												...formData,
												collegeName: e.target.value,
											})
										}
										required
										placeholder="Enter college name"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="collegeLocation">
										College Location
									</Label>
									<Input
										id="collegeLocation"
										value={formData.collegeLocation}
										onChange={(e) =>
											setFormData({
												...formData,
												collegeLocation: e.target.value,
											})
										}
										required
										placeholder="Enter college location"
									/>
								</div>
							</>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={loading}>
							{loading ? "Creating Account..." : "Create Account"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						<span className="text-gray-600">
							Already have an account?{" "}
						</span>
						<Link
							href="/login"
							className="text-blue-600 hover:underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
