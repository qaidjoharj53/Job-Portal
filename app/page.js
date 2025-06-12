"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Briefcase, Users, Building, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

export default function HomePage() {
	const { user, getAuthHeaders } = useAuth();
	const [recentJobs, setRecentJobs] = useState([]);
	const [loadingJobs, setLoadingJobs] = useState(false);
	const [totalJobs, setTotalJobs] = useState(0);
	const [totalApplications, setTotalApplications] = useState(0);
	const [recentActiveJobs, setRecentActiveJobs] = useState([]);

	useEffect(() => {
		if (user && user.role !== "admin") {
			setLoadingJobs(true);
			fetch("/api/jobs", {
				headers: getAuthHeaders(),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.jobs) {
						// Sort by created_at descending and take 5
						const sorted = data.jobs
							.sort(
								(a, b) =>
									new Date(b.created_at) -
									new Date(a.created_at)
							)
							.slice(0, 5);
						setRecentJobs(sorted);
					}
				})
				.finally(() => setLoadingJobs(false));
		}

		if (user && user.role === "admin") {
			// Fetch jobs with applications count for admin dashboard
			setLoadingJobs(true);
			fetch("/api/jobs", {
				headers: getAuthHeaders(),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.jobs) {
						setTotalJobs(data.jobs.length);
						setTotalApplications(
							data.jobs.reduce(
								(acc, job) =>
									acc + (Number(job.applications_count) || 0),
								0
							)
						);
						// Sort by most recent application (assuming job has last_application_at or fallback to created_at)
						const sortedByRecentApp = [...data.jobs]
							.filter((j) => Number(j.applications_count) > 0)
							.sort(
								(a, b) =>
									new Date(
										b.last_application_at || b.created_at
									) -
									new Date(
										a.last_application_at || a.created_at
									)
							)
							.slice(0, 5);
						setRecentActiveJobs(sortedByRecentApp);
					}
				})
				.finally(() => setLoadingJobs(false));
		}
	}, [user]);

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
							Welcome to{" "}
							<span className="text-blue-600">JobPortal</span>
						</h1>
						<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
							Connect colleges with students through our
							comprehensive job portal. Post opportunities, find
							talent, and build careers.
						</p>
						<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
							<div className="rounded-md shadow">
								<Link href="/register">
									<Button size="lg" className="w-full">
										Get Started
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</div>
							<div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
								<Link href="/login">
									<Button
										variant="outline"
										size="lg"
										className="w-full">
										Sign In
									</Button>
								</Link>
							</div>
						</div>
					</div>

					<div className="mt-16">
						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<Building className="h-8 w-8 text-blue-600" />
									<CardTitle>For Colleges</CardTitle>
									<CardDescription>
										Post job opportunities and connect with
										talented students from your institution.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<Users className="h-8 w-8 text-green-600" />
									<CardTitle>For Students</CardTitle>
									<CardDescription>
										Discover job opportunities posted
										specifically by your college and apply
										with ease.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card>
								<CardHeader>
									<Briefcase className="h-8 w-8 text-purple-600" />
									<CardTitle>Easy Management</CardTitle>
									<CardDescription>
										Simple and intuitive interface for
										posting jobs, managing applications, and
										tracking progress.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Welcome back, {user.name}!
					</h1>
					<p className="mt-2 text-gray-600">
						{user.role === "admin"
							? "Manage job postings and connect with students."
							: "Discover new job opportunities from your college."}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{user.role === "admin" ? (
						<>
							<Link href="/admin">
								<Card className="hover:shadow-lg transition-shadow cursor-pointer">
									<CardHeader>
										<Briefcase className="h-8 w-8 text-blue-600" />
										<CardTitle>Manage Jobs</CardTitle>
										<CardDescription>
											Post new job opportunities and view
											existing listings.
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>

							<Card>
								<CardHeader>
									<Briefcase className="h-8 w-8 text-blue-600" />
									<CardTitle>Total Jobs Posted</CardTitle>
									<CardDescription>
										<span className="text-2xl font-bold text-gray-900">
											{totalJobs}
										</span>
									</CardDescription>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<FileText className="h-8 w-8 text-green-600" />
									<CardTitle>Total Applications</CardTitle>
									<CardDescription>
										<span className="text-2xl font-bold text-gray-900">
											{totalApplications}
										</span>
									</CardDescription>
								</CardHeader>
							</Card>
						</>
					) : (
						<>
							<Link href="/jobs">
								<Card className="hover:shadow-lg transition-shadow cursor-pointer">
									<CardHeader>
										<Briefcase className="h-8 w-8 text-blue-600" />
										<CardTitle>Browse Jobs</CardTitle>
										<CardDescription>
											View available job opportunities
											from your college.
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>

							<Link href="/applications">
								<Card className="hover:shadow-lg transition-shadow cursor-pointer">
									<CardHeader>
										<Users className="h-8 w-8 text-green-600" />
										<CardTitle>My Applications</CardTitle>
										<CardDescription>
											Track your job applications and
											their status.
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>
						</>
					)}
				</div>

				{/* Recent Jobs Section */}
				{user.role !== "admin" && (
					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4 text-gray-900">
							Recent Jobs
						</h2>
						{loadingJobs ? (
							<div className="text-gray-500">
								Loading recent jobs...
							</div>
						) : recentJobs.length === 0 ? (
							<div className="text-gray-500">
								No recent jobs available.
							</div>
						) : (
							<div className="grid gap-4">
								{recentJobs.map((job) => (
									<Link key={job.id} href={`/jobs`}>
										<Card className="hover:shadow-md transition-shadow cursor-pointer">
											<CardHeader className="flex flex-row items-center justify-between">
												<div>
													<CardTitle className="text-lg">
														{job.title}
													</CardTitle>
													<CardDescription>
														{job.company_name}{" "}
														&middot;{" "}
														{formatDate(
															job.created_at
														)}
													</CardDescription>
												</div>
												<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200 font-medium">
													{job.type}
												</span>
											</CardHeader>
										</Card>
									</Link>
								))}
							</div>
						)}
					</div>
				)}

				{user.role === "admin" && (
					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4 text-gray-900">
							Recent Job Applications
						</h2>
						{loadingJobs ? (
							<div className="text-gray-500">Loading jobs...</div>
						) : recentActiveJobs.length === 0 ? (
							<div className="text-gray-500">
								No jobs with recent applications.
							</div>
						) : (
							<div className="grid gap-4">
								{recentActiveJobs.map((job) => (
									<Card
										key={job.id}
										className="hover:shadow-md transition-shadow cursor-pointer">
										<CardHeader className="flex flex-row items-center justify-between">
											<div>
												<CardTitle className="text-lg">
													{job.title}
												</CardTitle>
												<CardDescription>
													{job.company_name} &middot;{" "}
													{formatDate(job.created_at)}
												</CardDescription>
											</div>

											<span className="ml-2 text-xs px-2 py-1 rounded bg-green-100 text-green-800 border border-green-200 font-medium whitespace-nowrap">
												{job.applications_count ?? 0}{" "}
												Applications
											</span>
										</CardHeader>
									</Card>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
