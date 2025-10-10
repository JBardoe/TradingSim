import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthenticated = (redirectIfUnauthorised = true) => {
	const [authenticated, setAuthenticated] = useState(false);
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.post(
				"http://localhost:5000/api/checkAuth",
				{},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.status === 200) {
					setAuthenticated(true);
					setEmail(res.data.email);
				} else if (redirectIfUnauthorised) {
					navigate("/login");
				}
			})
			.catch((err) => {
				console.error(err);
				navigate("/login");
			});
	}, [navigate, redirectIfUnauthorised]);

	return { authenticated, email };
};

export default useAuthenticated;
