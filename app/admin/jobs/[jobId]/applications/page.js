"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function JobApplicationsPage() {
	const { jobId } = useParams();
	const router = useRouter();
	const { user, getAuthHeaders } = useAuth();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [processingIds, setProcessingIds] = useState({});

	const searchParams = useSearchParams();
	const jobTitle = searchParams.get("jobTitle");
	const companyName = searchParams.get("companyName");

	useEffect(() => {
		if (user && user.role === "admin") {
			fetchApplications();
		}
	}, [user, jobId]);

	useEffect(() => {
		if (message) {
			toast(message, { icon: "ℹ️" });
			setMessage("");
		}
	}, [message]);

	const fetchApplications = async () => {
		try {
			const response = await fetch(`/api/jobs/${jobId}/applications`, {
				headers: getAuthHeaders(),
			});
			const data = await response.json();

			if (response.ok) {
				setApplications(data.applications);
			} else {
				setMessage(data.error || "Failed to fetch applications");
			}
		} catch (error) {
			console.error("Error fetching applications:", error);
			setMessage("Failed to fetch applications");
		} finally {
			setLoading(false);
		}
	};

	const updateApplicationStatus = async (applicationId, newStatus) => {
		setProcessingIds((prev) => ({ ...prev, [applicationId]: true }));
		setMessage("");

		try {
			const response = await fetch(
				`/api/applications/${applicationId}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...getAuthHeaders(),
					},
					body: JSON.stringify({ status: newStatus }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				// Update the application status in the local state
				setApplications(
					applications.map((app) =>
						app.id === applicationId
							? { ...app, status: newStatus }
							: app
					)
				);
				setMessage(`Application ${newStatus} successfully`);
			} else {
				setMessage(data.error || "Failed to update application status");
			}
		} catch (error) {
			console.error("Error updating application status:", error);
			setMessage("Failed to update application status");
		} finally {
			setProcessingIds((prev) => ({ ...prev, [applicationId]: false }));
		}
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "pending":
				return (
					<Badge className="bg-yellow-100 text-yellow-800">
						Pending
					</Badge>
				);
			case "accepted":
				return (
					<Badge className="bg-green-100 text-green-800">
						Accepted
					</Badge>
				);
			case "rejected":
				return (
					<Badge className="bg-red-100 text-red-800">Rejected</Badge>
				);
			default:
				return <Badge>Unknown</Badge>;
		}
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

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Loading applications...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Applications for
						</h1>
						<h1 className="text-2xl font-semibold mt-2 text-gray-800">
							{jobTitle && companyName ? (
								<>
									<span className="text-blue-600">
										{companyName}
									</span>{" "}
									- {jobTitle}
								</>
							) : (
								""
							)}
						</h1>
						<p className="mt-2 text-gray-600">
							Review and manage student applications
						</p>
					</div>
				</div>

				{applications.length === 0 ? (
					<Card>
						<CardContent className="text-center py-12">
							<AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No Applications Yet
							</h3>
							<p className="text-gray-500">
								There are no applications for this job posting
								yet.
							</p>
							<div className="mt-6">
								<Link href="/admin">
									<Button variant="outline">
										Return to Dashboard
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6">
						{applications.map((application) => (
							<Card
								key={application.id}
								className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<CardTitle className="text-xl mb-2">
												{application.student_name}
											</CardTitle>
											<CardDescription className="flex items-center">
												<Mail className="h-4 w-4 mr-2" />
												{application.student_email}
											</CardDescription>
										</div>
										<div className="flex flex-col items-end gap-2">
											{getStatusBadge(application.status)}
											<span className="text-xs text-gray-500">
												Applied on{" "}
												{new Date(
													application.applied_at
												).toLocaleDateString()}
											</span>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center text-gray-500 mb-6">
										<Clock className="h-4 w-4 mr-2 flex-shrink-0" />
										<span className="text-sm">
											Applied{" "}
											{Math.floor(
												(new Date() -
													new Date(
														application.applied_at
													)) /
													(1000 * 60 * 60 * 24)
											)}{" "}
											days ago
										</span>
									</div>

									<div className="flex justify-end space-x-3">
										{application.status === "pending" && (
											<>
												<Button
													variant="outline"
													className="border-red-200 text-red-600 hover:bg-red-50"
													onClick={() =>
														updateApplicationStatus(
															application.id,
															"rejected"
														)
													}
													disabled={
														processingIds[
															application.id
														]
													}>
													<XCircle className="h-4 w-4 mr-2" />
													Reject
												</Button>
												<Button
													variant="outline"
													className="border-green-200 text-green-600 hover:bg-green-50"
													onClick={() =>
														updateApplicationStatus(
															application.id,
															"accepted"
														)
													}
													disabled={
														processingIds[
															application.id
														]
													}>
													<CheckCircle className="h-4 w-4 mr-2" />
													Accept
												</Button>
											</>
										)}
										{application.status === "rejected" && (
											<Button
												variant="outline"
												className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
												onClick={() =>
													updateApplicationStatus(
														application.id,
														"pending"
													)
												}
												disabled={
													processingIds[
														application.id
													]
												}>
												<AlertCircle className="h-4 w-4 mr-2" />
												Mark as Pending
											</Button>
										)}
										{application.status === "accepted" && (
											<Button
												variant="outline"
												className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
												onClick={() =>
													updateApplicationStatus(
														application.id,
														"pending"
													)
												}
												disabled={
													processingIds[
														application.id
													]
												}>
												<AlertCircle className="h-4 w-4 mr-2" />
												Mark as Pending
											</Button>
										)}
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
