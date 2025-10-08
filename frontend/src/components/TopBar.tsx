import { useState } from "react";
import LogoutButton from "./login/LogoutButton";
import { Link, redirect, useNavigate } from "react-router-dom";

interface MenuProps {
	home: boolean;
}

const TopBar = ({ home }: MenuProps) => {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
	const navigate = useNavigate();

	return (
		<>
			<div className="sticky top-0 w-full shadow-md shadow-gray-500 dark:shadow-black h-[6vh] dark:bg-gray-800 flex items-center px-[2vw] flex-row-reverse">
				{!accountMenuOpen && (
					<button
						onClick={() => setAccountMenuOpen(!accountMenuOpen)}
						className="cursor-pointer flex flex-row gap-3 w-fit items-center"
					>
						<p className="font-semibold">user.mail.com</p>
						<img
							src="../public/user.png"
							className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
						></img>
					</button>
				)}
				{home && (
					<button
						onClick={() => navigate("/")}
						className="absolute left-5 rounded-lg py-1 text-center transition-all hover:cursor-pointer"
					>
						<img
							src="../public/home.png"
							className="size-8 rounded-full"
						></img>
					</button>
				)}
			</div>
			{accountMenuOpen && (
				<div className="fixed top-[1vh] right-[2vw] w-[20vw] rounded-2xl bg-gray-300 dark:bg-gray-600 p-[1%] flex flex-col items-center">
					<div className="w-full">
						<div className="w-full flex flex-row justify-center items-center gap-2">
							<p className="font-semibold">user.mail.com</p>
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
						{home && (
							<Link
								to="/"
								className="w-full rounded-lg py-1 text-center hover:bg-indigo-300 active:bg-indigo-500 dark:hover:bg-indigo-700 dark:active:bg-indigo-900 transition-all"
							>
								Home
							</Link>
						)}
						<LogoutButton />
					</div>
				</div>
			)}
		</>
	);
};

export default TopBar;
