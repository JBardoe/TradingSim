import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AllStocks from "./pages/AllStocks";
import SingleStock from "./pages/SingleStock";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/allStocks" element={<AllStocks />} />
				<Route
					path="/singleStock/:stockCode"
					element={<SingleStock />}
				/>
				<Route path="*" element={<Home />} />
			</Routes>
		</Router>
	);
}

export default App;
