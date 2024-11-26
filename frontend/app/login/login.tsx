"use client";

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
	Input,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { backendPost } from "util/fetching";

export function Login() {
	const [postData, setPostData] = useState<string | undefined>();
	const [blankMessage, setBlankMessage] = useState("");
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();
	return (
		<>
			<Card>
				<CardHeader component="h2" title="Login" />
				{isLoading ? <CircularProgress /> : undefined}
				<CardContent>
					<p data-testid="backend-login-post">{postData}</p>
					<form
						encType="text/plain"
						onSubmit={(event) => {
							event.preventDefault();
							const data = new FormData(
								event.target as HTMLFormElement,
							);
							// read fields
							const fields = {
								email: data.get("email")?.toString() ?? "",
								password:
									data.get("password")?.toString() ?? "",
							};

							// verify fields are not empty
							let isBlank = false;
							for (const [_key, value] of Object.entries(
								fields,
							)) {
								if (!value) isBlank = true;
							}
							if (isBlank)
								setBlankMessage(
									"Please make sure you didn't leave any of the fields blank.",
								);
							else {
								setLoading(true);
								//input is valid
								backendPost("api/login", {
									email: data.get("email")?.toString() ?? "",
									password:
										data.get("password")?.toString() ?? "",
								})
									.then((data) => {
										setLoading(false);
										setPostData(data.message);
										router.push("/form");
									})
									.catch((reason) => {
										setLoading(false);
										setPostData("" + reason);
									});
							}
						}}
					>
						<Input name="email" placeholder="email" />
						<br />
						<Input
							name="password"
							type="password"
							placeholder="password"
						/>
						<br />
						{/* will let the user know when that fields cannot be left blank*/}
						<label data-testid="blank-message">
							{blankMessage}
						</label>
						<br />
						<Button variant="contained" type="submit">
							login
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
