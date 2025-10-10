import { useState } from "react";
import LogoutButton from "./login/LogoutButton";
import { useNavigate } from "react-router-dom";

interface MenuProps {
	home: boolean;
	email: string;
}

const TopBar = ({ home, email }: MenuProps) => {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<>
			<div className="sticky top-0 w-full shadow-md shadow-gray-500 dark:shadow-black h-[6vh] dark:bg-gray-800 flex items-center px-[2vw] flex-row-reverse z-20">
				{!accountMenuOpen && (
					<button
						onClick={() => setAccountMenuOpen(!accountMenuOpen)}
						className="cursor-pointer flex flex-row gap-3 w-fit items-center"
					>
						<p className="font-semibold">{email}</p>
						<img
							src="../public/user.png"
							className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
						></img>
					</button>
				)}
				{!home && (
					<button
						onClick={() => navigate("/")}
						className="absolute left-5 rounded-lg py-1 text-center transition-all cursor-pointer"
					>
						<img
							src="../public/home.png"
							className="size-8 rounded-full"
						></img>
					</button>
				)}
			</div>
			{accountMenuOpen && (
				<div className="fixed top-[1vh] right-[2vw] w-[20vw] rounded-2xl bg-gray-300 dark:bg-gray-600 p-[1%] flex flex-col items-center z-30">
					<div className="w-full">
						<div className="w-full flex flex-row justify-center items-center gap-2">
							<p className="font-semibold">{email}</p>
							<img
								src="../public/user.png"
								className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
							></img>
						</div>
						<button
							onClick={() => setAccountMenuOpen(!accountMenuOpen)}
							className="cursor-pointer absolute top-[2%] right-[4%]"
						>
							✕
						</button>
					</div>
					<hr className="w-full text-gray-400 rounded-full my-2" />
					<div className="flex flex-col items-center w-full">
						<LogoutButton />
					</div>
				</div>
			)}
		</>
	);
};

export default TopBar;
