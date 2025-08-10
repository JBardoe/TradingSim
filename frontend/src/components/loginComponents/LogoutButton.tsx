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
		<button className="rounded-2xl cursor-pointer" onClick={handleLogout}>
			Logout
		</button>
	);
};

export default LogoutButton;
