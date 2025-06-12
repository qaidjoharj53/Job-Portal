"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	LogOut,
	User,
	Briefcase,
	FileText,
	Menu,
	GraduationCap,
} from "lucide-react";

export default function Navbar() {
	const { user, logout } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-2">
							<GraduationCap className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								Campus Jobs
							</span>
						</Link>
					</div>

					{/* Hamburger for mobile */}
					<div className="flex lg:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label="Open menu">
							<Menu className="h-6 w-6" />
						</Button>
					</div>

					{/* Desktop menu */}
					<div className="hidden lg:flex items-center space-x-4">
						{user ? (
							<>
								<div className="flex items-center space-x-2 text-sm text-gray-700">
									<User className="h-4 w-4" />
									<span>{user.name}</span>
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
										{user.role}
									</span>
								</div>
								{user.role === "admin" ? (
									<Link href="/admin">
										<Button variant="outline" size="sm">
											<Briefcase className="h-4 w-4 mr-2" />
											Admin Panel
										</Button>
									</Link>
								) : (
									<>
										<Link href="/jobs">
											<Button variant="outline" size="sm">
												<Briefcase className="h-4 w-4 mr-2" />
												All Jobs
											</Button>
										</Link>
										<Link href="/applications">
											<Button variant="outline" size="sm">
												<FileText className="h-4 w-4 mr-2" />
												My Applications
											</Button>
										</Link>
									</>
								)}
								<Link href="/">
									<Button
										onClick={logout}
										variant="outline"
										size="sm">
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</Button>
								</Link>
							</>
						) : (
							<div className="space-x-2">
								<Link href="/login">
									<Button variant="outline" size="sm">
										Login
									</Button>
								</Link>
								<Link href="/register">
									<Button size="sm">Register</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="lg:hidden px-4 pb-4">
					<div className="flex flex-col space-y-2">
						{user ? (
							<>
								<div className="flex items-center space-x-2 text-sm text-gray-700 mb-2">
									<User className="h-4 w-4" />
									<span>{user.name}</span>
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
										{user.role}
									</span>
								</div>
								{user.role === "admin" ? (
									<Link
										href="/admin"
										onClick={() => setMenuOpen(false)}>
										<Button
											variant="outline"
											size="sm"
											className="w-full justify-start">
											<Briefcase className="h-4 w-4 mr-2" />
											Admin Panel
										</Button>
									</Link>
								) : (
									<>
										<Link
											href="/jobs"
											onClick={() => setMenuOpen(false)}>
											<Button
												variant="outline"
												size="sm"
												className="w-full justify-start">
												<Briefcase className="h-4 w-4 mr-2" />
												Jobs
											</Button>
										</Link>
										<Link
											href="/applications"
											onClick={() => setMenuOpen(false)}>
											<Button
												variant="outline"
												size="sm"
												className="w-full justify-start">
												<FileText className="h-4 w-4 mr-2" />
												My Applications
											</Button>
										</Link>
									</>
								)}
								<Link
									href="/"
									onClick={() => setMenuOpen(false)}>
									<Button
										onClick={logout}
										variant="outline"
										size="sm"
										className="w-full justify-start">
										<LogOut className="h-4 w-4 mr-2" />
										Logout
									</Button>
								</Link>
							</>
						) : (
							<>
								<Link
									href="/login"
									onClick={() => setMenuOpen(false)}>
									<Button
										variant="outline"
										size="sm"
										className="w-full justify-start">
										Login
									</Button>
								</Link>
								<Link
									href="/register"
									onClick={() => setMenuOpen(false)}>
									<Button
										size="sm"
										className="w-full justify-start">
										Register
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
