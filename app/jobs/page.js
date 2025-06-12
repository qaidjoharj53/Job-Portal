"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	MapPin,
	Calendar,
	DollarSign,
	Briefcase,
	CheckCircle,
	ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";

const getTypeBadgeClass = (type) => {
	switch (type?.toLowerCase()) {
		case "internship":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "full-time":
			return "bg-green-100 text-green-800 border-green-200";
		case "part-time":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

const formatDate = (dateStr) => {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

export default function JobsPage() {
	const { user, getAuthHeaders } = useAuth();
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [applying, setApplying] = useState({});
	const [message, setMessage] = useState("");
	const [filter, setFilter] = useState("all");
	const [sort, setSort] = useState("created_at_desc");

	const filterOptions = [
		{ value: "all", label: "All Types" },
		{ value: "full-time", label: "Full-Time" },
		{ value: "part-time", label: "Part-Time" },
		{ value: "internship", label: "Internship" },
	];

	const sortOptions = [
		{ value: "deadline_asc", label: "Deadline ↑" },
		{ value: "deadline_desc", label: "Deadline ↓" },
		{ value: "created_at_asc", label: "Posted Date ↑" },
		{ value: "created_at_desc", label: "Posted Date ↓" },
	];

	useEffect(() => {
		if (user && user.role === "student") {
			fetchJobs();
		}
	}, [user]);

	useEffect(() => {
		if (message) {
			toast(message, { icon: "ℹ️" });
			setMessage("");
		}
	}, [message]);

	const fetchJobs = async () => {
		try {
			const response = await fetch("/api/jobs", {
				headers: getAuthHeaders(),
			});
			const data = await response.json();
			if (response.ok) {
				setJobs(data.jobs);
			}
		} catch (error) {
			console.error("Error fetching jobs:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleApply = async (jobId) => {
		setApplying({ ...applying, [jobId]: true });
		setMessage("");

		try {
			const response = await fetch("/api/jobs/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
				body: JSON.stringify({ jobId }),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage("Application submitted successfully!");
				// Update the job to show it's been applied to
				setJobs(
					jobs.map((job) =>
						job.id === jobId ? { ...job, hasApplied: true } : job
					)
				);
			} else {
				setMessage(data.error || "Failed to apply to job");
			}
		} catch (error) {
			setMessage("Failed to apply to job");
		}

		setApplying({ ...applying, [jobId]: false });
	};

	const getFilteredJobs = () => {
		let filtered = [...jobs];
		if (["full-time", "part-time", "internship"].includes(filter)) {
			filtered = filtered.filter(
				(job) => job.type?.toLowerCase() === filter
			);
		}
		switch (sort) {
			case "deadline_asc":
				filtered.sort(
					(a, b) => new Date(a.deadline) - new Date(b.deadline)
				);
				break;
			case "deadline_desc":
				filtered.sort(
					(a, b) => new Date(b.deadline) - new Date(a.deadline)
				);
				break;
			case "created_at_asc":
				filtered.sort(
					(a, b) => new Date(a.created_at) - new Date(b.created_at)
				);
				break;
			case "created_at_desc":
				filtered.sort(
					(a, b) => new Date(b.created_at) - new Date(a.created_at)
				);
				break;
			default:
				break;
		}
		return filtered;
	};

	if (!user || user.role !== "student") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg text-red-600 font-semibold">
					Unauthorized
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading jobs...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Available Jobs
						</h1>
						<p className="mt-2 text-gray-600">
							Job opportunities from{" "}
							{user.collegeName || "your college"}
						</p>
					</div>
					{/* Filter and Sort Controls */}
					<div className="flex flex-col sm:flex-row items-end gap-2 self-end">
						<div className="flex items-center gap-2">
							<label
								htmlFor="job-filter"
								className="text-sm text-gray-700 font-medium mr-1">
								Filter:
							</label>
							<div className="relative">
								<select
									id="job-filter"
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
									{filterOptions.map((opt) => (
										<option
											key={opt.value}
											value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<label
								htmlFor="job-sort"
								className="text-sm text-gray-700 font-medium mr-1 ml-2">
								Sort:
							</label>
							<div className="relative">
								<select
									id="job-sort"
									value={sort}
									onChange={(e) => setSort(e.target.value)}
									className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
									{sortOptions.map((opt) => (
										<option
											key={opt.value}
											value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>
					</div>
				</div>

				{message && (
					<Alert className="mb-6">
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				)}

				{getFilteredJobs().length === 0 ? (
					<Card>
						<CardContent className="text-center py-12">
							<Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No Jobs Available
							</h3>
							<p className="text-gray-500">
								There are currently no job postings from your
								college. Check back later!
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6">
						{getFilteredJobs().map((job) => (
							<Card
								key={job.id}
								className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-xl mb-2">
												{job.title}
											</CardTitle>
											<CardDescription>
												Posted by {job.company_name} •{" "}
												{formatDate(job.created_at)}
											</CardDescription>
										</div>
										<div className="flex flex-col items-end gap-2">
											<div>
												<Badge
													className={
														getTypeBadgeClass(
															job.type
														) + " uppercase"
													}>
													{job.type}
												</Badge>
											</div>
											{job.hasApplied && (
												<Badge
													variant="outline"
													className="text-green-600 border-green-600">
													<CheckCircle className="h-3 w-3 mr-1" />
													Applied
												</Badge>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 mb-6">
										{job.description}
									</p>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
										<div className="flex items-center text-gray-500">
											<MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="text-sm">
												{job.location}
											</span>
										</div>

										{job.salary_range && (
											<div className="flex items-center text-gray-500">
												<DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
												<span className="text-sm">
													{job.salary_range}
												</span>
											</div>
										)}

										<div className="flex items-center text-gray-500">
											<Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="text-sm">
												Deadline:{" "}
												{formatDate(job.deadline)}
											</span>
										</div>
									</div>

									{job.requirements && (
										<div className="mb-6">
											<h4 className="font-medium text-gray-900 mb-2">
												Requirements:
											</h4>
											<p className="text-gray-600 text-sm">
												{job.requirements}
											</p>
										</div>
									)}

									<div className="flex justify-end">
										<Button
											onClick={() => handleApply(job.id)}
											disabled={
												applying[job.id] ||
												job.hasApplied ||
												new Date(job.deadline) <=
													new Date()
											}
											className="min-w-[120px]">
											{applying[job.id]
												? "Applying..."
												: job.hasApplied
												? "Applied"
												: new Date(job.deadline) <=
												  new Date()
												? "Expired"
												: "Apply Now"}
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
