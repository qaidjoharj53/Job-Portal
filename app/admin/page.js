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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Briefcase, MapPin, Calendar, IndianRupee } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminPage() {
	const { user, getAuthHeaders } = useAuth();
	const [jobs, setJobs] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		companyName: "",
		type: "",
		deadline: "",
		salaryRange: "",
		requirements: "",
	});

	useEffect(() => {
		if (user && user.role === "admin") {
			fetchJobs();
		}
	}, [user]);

	useEffect(() => {
		if (message) {
			toast(message, { icon: "ℹ️" });
			setMessage(""); // Clear message after showing toast
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
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/jobs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...getAuthHeaders(),
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				setMessage("Job posted successfully!");
				setFormData({
					title: "",
					description: "",
					location: "",
					companyName: "",
					type: "",
					deadline: "",
					salaryRange: "",
					requirements: "",
				});
				setShowForm(false);
				fetchJobs();
			} else {
				setMessage(data.error || "Failed to post job");
			}
		} catch (error) {
			setMessage("Failed to post job");
		}

		setLoading(false);
	};

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	if (!user || user.role !== "admin") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg text-red-600 font-semibold">
					Unauthorized
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Admin Dashboard
						</h1>
						<p className="mt-2 text-gray-600">
							Manage job postings for your college
						</p>
					</div>
					<Button onClick={() => setShowForm(!showForm)}>
						<Plus className="h-4 w-4 mr-2" />
						Post New Job
					</Button>
				</div>

				{showForm && (
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Post New Job</CardTitle>
							<CardDescription>
								Fill in the details for the new job posting
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="title">Job Title</Label>
										<Input
											id="title"
											value={formData.title}
											onChange={(e) =>
												setFormData({
													...formData,
													title: e.target.value,
												})
											}
											required
											placeholder="e.g. Software Developer Intern"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="companyName">
											Company Name
										</Label>
										<Input
											id="companyName"
											value={formData.companyName}
											onChange={(e) =>
												setFormData({
													...formData,
													companyName: e.target.value,
												})
											}
											required
											placeholder="e.g. Infosys"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="location">
											Location
										</Label>
										<Input
											id="location"
											value={formData.location}
											onChange={(e) =>
												setFormData({
													...formData,
													location: e.target.value,
												})
											}
											required
											placeholder="e.g. Bangalore, Karnataka"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="type">Type</Label>
										<select
											id="type"
											value={formData.type}
											onChange={(e) =>
												setFormData({
													...formData,
													type: e.target.value,
												})
											}
											required
											className="border border-gray-300 rounded px-3 py-2 w-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
											<option value="">
												Select type
											</option>
											<option value="internship">
												Internship
											</option>
											<option value="part-time">
												Part-Time
											</option>
											<option value="full-time">
												Full-Time
											</option>
										</select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="deadline">
											Application Deadline
										</Label>
										<Input
											id="deadline"
											type="date"
											value={formData.deadline}
											onChange={(e) =>
												setFormData({
													...formData,
													deadline: e.target.value,
												})
											}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="salaryRange">
											Salary Range
										</Label>
										<Input
											id="salaryRange"
											value={formData.salaryRange}
											onChange={(e) =>
												setFormData({
													...formData,
													salaryRange: e.target.value,
												})
											}
											placeholder="e.g. 5-7 LPA"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">
										Job Description
									</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										required
										placeholder="Describe the job role, responsibilities, and what you're looking for..."
										rows={4}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="requirements">
										Requirements
									</Label>
									<Textarea
										id="requirements"
										value={formData.requirements}
										onChange={(e) =>
											setFormData({
												...formData,
												requirements: e.target.value,
											})
										}
										placeholder="List the required skills, qualifications, or experience..."
										rows={3}
									/>
								</div>

								<div className="flex gap-2">
									<Button type="submit" disabled={loading}>
										{loading ? "Posting..." : "Post Job"}
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowForm(false)}>
										Cancel
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				<div className="space-y-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						Posted Jobs ({jobs.length})
					</h2>

					{jobs.length === 0 ? (
						<Card>
							<CardContent className="text-center py-8">
								<Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">
									No jobs posted yet. Create your first job
									posting!
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-6">
							{jobs.map((job) => (
								<Card key={job.id}>
									<CardHeader>
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-xl">
													{job.title}
												</CardTitle>
												{job.company_name && (
													<div className="text-blue-700 font-semibold mb-1 text-base">
														{job.company_name}
													</div>
												)}
												<CardDescription className="mt-2">
													Posted on{" "}
													{formatDate(job.created_at)}
												</CardDescription>
											</div>
											<div className="text-right flex flex-col items-end gap-2">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														new Date(job.deadline) >
														new Date()
															? "bg-green-100 text-green-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{new Date(job.deadline) >
													new Date()
														? "Active"
														: "Expired"}
												</span>
												<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1 whitespace-nowrap">
													{job.applications_count ??
														0}{" "}
													Applications
												</span>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col md:flex-row md:gap-8 text-sm">
											<div className="flex items-center text-gray-500">
												<MapPin className="h-4 w-4 mr-2" />
												{job.location}
											</div>
											<div className="flex items-center text-gray-500">
												<Calendar className="h-4 w-4 mr-2" />
												Deadline:{" "}
												{formatDate(job.deadline)}
											</div>
											{job.salary_range && (
												<div className="flex items-center text-gray-500">
													<IndianRupee className="h-4 w-4 mr-2" />
													{job.salary_range}
												</div>
											)}
										</div>

										<p className="text-gray-600 mt-4">
											{job.description}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
