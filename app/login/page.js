"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const result = await login(email, password);

		if (result.success) {
			router.push("/");
		} else {
			setError(result.error);
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-100 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">
						Sign in
					</CardTitle>
					<CardDescription className="text-center">
						Enter your email and password to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
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

						{error && (
							<Alert
								variant="destructive"
								className="border-0 text-center">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						<span className="text-gray-600">
							Don't have an account?{" "}
						</span>
						<Link
							href="/register"
							className="text-blue-600 hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
