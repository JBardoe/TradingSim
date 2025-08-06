import { useState } from "react";
import { redirect } from "react-router-dom";

interface loginFormData {
	email: HTMLInputElement;
	password: HTMLInputElement;
}

const LoginForm = () => {
	const [loginFailed, setLoginFailed] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoginFailed(false);
		const form = event.currentTarget;
		const formElements = form.elements as typeof form.elements &
			loginFormData;

		sendData(
			JSON.stringify({
				email: formElements.email.value,
				password: formElements.password.value,
			})
		);
	};

	const sendData = async (data: string) => {
		const resp = await fetch("/api/register", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: { "Content-Types": "application/json" },
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: data,
		});

		if (resp.status !== 200) {
			setLoginFailed(true);
		} else {
			redirect("/");
		}
	};
	return (
		<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					src="..\..\..\public\logo.png"
					alt="Trading Simulation"
					className="mx-auto h-20 w-auto"
				/>
				<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
					Sign In To Your Account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
						>
							Email Address
						</label>
						<div className="mt-2">
							<input
								id="email"
								type="email"
								name="email"
								required
								autoComplete="email"
								className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 dark:outline-white/10 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
							>
								Password
							</label>
							<div className="text-sm">
								<a
									href="#"
									className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
								>
									Forgot password?
								</a>
							</div>
						</div>
						<div className="mt-2">
							<input
								id="password"
								type="password"
								name="password"
								required
								autoComplete="current-password"
								className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 dark:outline-white/10 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
							/>
						</div>
					</div>

					{loginFailed && (
						<p className="text-md font-semibold text-red-500 text-center mt-1">
							Incorrect Username or Passsword.
						</p>
					)}

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 cursor-pointer active:scale-[97%]"
						>
							Sign in
						</button>
					</div>
				</form>

				<p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
					Don't have an account?
					<a
						href="/register"
						className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 ml-3"
					>
						Register here
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;
