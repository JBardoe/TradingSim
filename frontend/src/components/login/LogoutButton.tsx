import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
	const navigate = useNavigate();
	const handleLogout = async () => {
		const resp = await fetch("http://localhost:5000/api/logout", {
			//TODO change
			credentials: "include",
		});

		if (resp.status === 200) {
			navigate("/login");
		}
		return resp;
	};
	return (
		<button
			className="hover:bg-indigo-300 active:bg-indigo-500 dark:hover:bg-indigo-700 dark:active:bg-indigo-900 cursor-pointer w-full rounded-lg py-1"
			onClick={handleLogout}
		>
			Logout
		</button>
	);
};

export default LogoutButton;
