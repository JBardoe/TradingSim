import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthenticated = (redirectIfUnauthorised = true) => {
	const [authenticated, setAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				//TODO remove
				setAuthenticated(true);
				return;

				const resp = await fetch(
					"http://localhost:5000/api/checkAuth",
					{
						credentials: "include",
					}
				); //TODO change
				if (resp.status === 200) {
					setAuthenticated(true);
				} else if (redirectIfUnauthorised) {
					navigate("/login");
				}
			} catch (err) {
				navigate("/login");
			}
		};

		checkAuth();
	}, [navigate, redirectIfUnauthorised]);

	return { authenticated };
};

export default useAuthenticated;
