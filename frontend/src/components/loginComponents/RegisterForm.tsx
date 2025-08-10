import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticated from "../hooks/useAuthenticated";

interface registerFormData {
	email: HTMLInputElement;
	password: HTMLInputElement;
	confirm: HTMLInputElement;
	fname: HTMLInputElement;
	lname: HTMLInputElement;
}

const RegisterForm = () => {
	const { authenticated } = useAuthenticated(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [existingUser, setExistingUser] = useState(false);
	const naviate = useNavigate();

	if (authenticated) naviate("/");

	const baseInputClasses =
		"text-center block w-[80%] rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6";

	const passwordRegex = new RegExp(
		"^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^A-Za-z0-9]).{8,}$"
	);
	const emailRegex = new RegExp(
		"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
	);
	const handleFormSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formElements = form.elements as typeof form.elements &
			registerFormData;

		if (!emailRegex.test(formElements.email.value)) {
			setInvalidEmail(true);
		} else if (!passwordRegex.test(formElements.password.value)) {
			setInvalidPassword(true);
		} else if (formElements.password.value !== formElements.confirm.value) {
			setPasswordMatch(false);
		} else {
			const resp = await sendData(
				JSON.stringify({
					email: formElements.email.value,
					password: formElements.password.value,
					fname: formElements.fname.value,
					lname: formElements.lname.value,
				})
			);
			if (resp.status !== 200) {
				setExistingUser(true);
			} else {
				naviate("/");
			}
			return resp;
		}
	};

	const sendData = async (data: string) => {
		const resp = await fetch("http://localhost:5000/api/register", {
			//TODO change
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: data,
		});

		return resp;
	};

	//TODO fix size
	return (
		<div className="flex h-fit w-[40vw] flex-col justify-center py-12 shadow-lg shadow-black mt-[2%] mb-[5%]">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					src="..\..\..\public\logo.png"
					alt="Trading Simulation"
					className="mx-auto h-20 w-auto"
				/>
				<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
					Create an Account
				</h2>
			</div>

			<div className="mt-10 w-full sm:mx-auto sm:w-full sm:max-w-sm">
				<form
					className="space-y-6 w-full flex flex-col items-center"
					onSubmit={handleFormSubmit}
				>
					<div className="w-full flex flex-col items-center">
						<label
							htmlFor="email"
							className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
						>
							Email Address
						</label>
						<div className="mt-2 w-full flex flex-col items-center">
							<input
								id="email"
								type="email"
								name="email"
								required
								autoComplete="email"
								onChange={() => {
									setExistingUser(false);
									setInvalidEmail(false);
								}}
								className={
									(invalidEmail || existingUser
										? "outline-red-300 dark:outline-red-300 focus:outline-red-600 dark:focus:outline-red-500"
										: "outline-gray-300 dark:outline-white/10 focus:outline-indigo-600 dark:focus:outline-indigo-500") +
									baseInputClasses
								}
							/>
							{existingUser && (
								<p className="text-md font-semibold text-red-500 text-center mt-1">
									There is already a user with that email.
								</p>
							)}
							{invalidEmail && (
								<p className="text-md font-semibold text-red-500 text-center mt-1">
									Invalid Email.
								</p>
							)}
						</div>
					</div>

					<div className="w-full flex flex-col items-center">
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
							>
								Password
							</label>
						</div>
						<div className="mt-2 w-full flex flex-col items-center">
							<input
								id="password"
								type="password"
								name="password"
								required
								autoComplete="current-password"
								onChange={() => setInvalidPassword(false)}
								className={
									(invalidEmail
										? "outline-red-300 dark:outline-red-300 focus:outline-red-600 dark:focus:outline-red-500"
										: "outline-gray-300 dark:outline-white/10 focus:outline-indigo-600 dark:focus:outline-indigo-500") +
									baseInputClasses
								}
							/>
							{invalidPassword && (
								<p className="text-sm font-semibold text-red-500 text-center mt-1">
									Passwords must be at least 8 characters and
									contain: a number, lowercase letter,
									uppercase letter, and a special character.
								</p>
							)}
						</div>
					</div>

					<div className="w-full flex flex-col items-center">
						<div className="flex items-center justify-between">
							<label
								htmlFor="confirm"
								className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
							>
								Confirm Password
							</label>
						</div>
						<div className="mt-2 w-full flex flex-col items-center">
							<input
								id="confirm"
								type="password"
								name="confirm"
								required
								autoComplete="current-password"
								onChange={() => setPasswordMatch(true)}
								className={
									(!passwordMatch
										? "outline-red-300 dark:outline-red-300 focus:outline-red-600 dark:focus:outline-red-500"
										: "outline-gray-300 dark:outline-white/10 focus:outline-indigo-600 dark:focus:outline-indigo-500") +
									baseInputClasses
								}
							/>
							{!passwordMatch && (
								<p className="text-sm font-semibold text-red-500 text-center mt-1">
									Passwords must match
								</p>
							)}
						</div>
					</div>

					<div className="w-full flex flex-col items-center">
						<div className="flex items-center justify-between">
							<label
								htmlFor="fname"
								className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
							>
								First Name
							</label>
						</div>
						<div className="mt-2 w-full flex flex-col items-center">
							<input
								id="fname"
								type="text"
								name="fname"
								required
								autoComplete="given-name"
								className="text-center block w-[80%] rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 dark:outline-white/10 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
							/>
						</div>
					</div>

					<div className="w-full flex flex-col items-center">
						<div className="flex items-center justify-between">
							<label
								htmlFor="lname"
								className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
							>
								Last Name
							</label>
						</div>
						<div className="mt-2 w-full flex flex-col items-center">
							<input
								id="lname"
								type="text"
								name="lname"
								required
								autoComplete="family-name"
								className="text-center block w-[80%] rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 dark:outline-white/10 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500 cursor-pointer active:scale-[97%]"
						>
							Register
						</button>
					</div>
				</form>

				<p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
					Already have an account?
					<a
						href="/login"
						className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 ml-3"
					>
						Login here
					</a>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
