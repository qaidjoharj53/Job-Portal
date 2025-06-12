import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Campus Jobs Portal",
	description:
		"A comprehensive job portal connecting colleges with students for internships and job opportunities.",
	keywords:
		"job portal, internships, job opportunities, college students, career development",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<div className="min-h-screen bg-gray-50">
						<Navbar />
						<Toaster />
						<main>{children}</main>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
