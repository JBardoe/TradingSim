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
	};
	return (
		<button
			className="fixed right-2 top-2 rounded-2xl"
			onClick={handleLogout}
		>
			Logout
		</button>
	);
};

export default LogoutButton;
