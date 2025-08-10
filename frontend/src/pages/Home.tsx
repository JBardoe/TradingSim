import useAuthenticated from "../components/hooks/useAuthenticated";
import LogoutButton from "../components/loginComponents/LogoutButton";

const Home = () => {
	const { authenticated } = useAuthenticated();

	if (!authenticated) return null;
	return (
		<>
			<div>Home</div>
			<LogoutButton />
		</>
	);
};

export default Home;
