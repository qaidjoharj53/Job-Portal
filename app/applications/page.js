"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, FileText, Clock } from "lucide-react";

export default function ApplicationsPage() {
	const { user, getAuthHeaders } = useAuth();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && user.role === "student") {
			fetchApplications();
		}
	}, [user]);

	const fetchApplications = async () => {
		try {
			const response = await fetch("/api/applications", {
				headers: getAuthHeaders(),
			});
			const data = await response.json();
			if (response.ok) {
				setApplications(data.applications);
			}
		} catch (error) {
			console.error("Error fetching applications:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "accepted":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
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
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						My Applications
					</h1>
					<p className="mt-2 text-gray-600">
						Track the status of your job applications
					</p>
				</div>

				{applications.length === 0 ? (
					<Card>
						<CardContent className="text-center py-12">
							<FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No Applications Yet
							</h3>
							<p className="text-gray-500">
								You haven't applied to any jobs yet. Browse
								available jobs to get started!
							</p>
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
												{application.title}
											</CardTitle>
											<CardDescription>
												{application.company_name} •
												Applied on{" "}
												{new Date(
													application.applied_at
												).toLocaleDateString()}
											</CardDescription>
										</div>
										<Badge
											className={getStatusColor(
												application.status
											)}>
											{application.status
												.charAt(0)
												.toUpperCase() +
												application.status.slice(1)}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="flex items-center text-gray-500">
											<MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="text-sm">
												{application.location}
											</span>
										</div>
										<div className="flex items-center text-gray-500">
											<Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="text-sm">
												Deadline:{" "}
												{new Date(
													application.deadline
												).toLocaleDateString()}
											</span>
										</div>
										<div className="flex items-center text-gray-500">
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
