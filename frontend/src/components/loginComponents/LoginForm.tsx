const LoginForm = () => {
	return (
		<form
			target="/api/login"
			className="flex flex-col items-center justify-center"
		>
			<input
				placeholder="Email"
				type="email"
				id="email"
				name="email"
			></input>
			<input
				placeholder="Password"
				type="password"
				id="password"
				name="password"
			></input>
		</form>
	);
};

export default LoginForm;
