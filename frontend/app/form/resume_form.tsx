"use client";

import React, { useState } from "react";
import { backendFormPost } from "util/fetching";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	styled,
	Typography,
} from "@mui/material";

/*https://mui.com/material-ui/react-button/#file-upload*/
const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function ResumeForm(props: { onSubmit?: () => void }) {
	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] || null;
		setSelectedFile(file);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get("file");

		// Checks if a file was selected
		if (!file || typeof file == "string" || file.name == "") {
			setMessage("Please select a file");
			return;
		}

		// Checks if file is PDF
		if (file.type !== "application/pdf") {
			setMessage("PDF files are only allowed");
			return;
		}

		// Checks if file is over 2MB
		if (file.size > 2 * 1024 * 1024) {
			setMessage("File size must be under 2MB");
			return;
		}

		setMessage("");
		setLoading(true);
		// This will upload the resume
		backendFormPost("api/resume-upload", formData)
			.then((data) => {
				setLoading(false);
				setMessage(data.message);
				if (props.onSubmit) {
					props.onSubmit();
				}
			})
			.catch((reason) => {
				setMessage("Error: " + (reason?.message ?? reason));
				setLoading(false);
			});
	};
	return (
		<Card>
			<CardHeader title="Resume Upload" />
			{isLoading ? <CircularProgress /> : undefined}
			<CardContent>
				<form onSubmit={handleSubmit} name="resume upload">
					<Button
						component="label"
						role="button"
						variant="contained"
						tabIndex={-1}
					>
						UPLOAD RESUME
						<VisuallyHiddenInput
							name="file"
							type="file"
							accept="application/pdf"
							onChange={handleFileChange}
						/>
					</Button>
					{selectedFile && (
						<Typography
							variant="body2"
							style={{ marginTop: "0.5rem" }}
						>
							Selected File: {selectedFile.name}
						</Typography>
					)}
					<Button
						type="submit"
						variant="contained"
						fullWidth
						style={{ marginTop: "1rem" }}
					>
						Submit Resume
					</Button>
					{message ?? ""}
				</form>
			</CardContent>
		</Card>
	);
}
