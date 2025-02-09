// src/pages/GuestLogin.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, UserPlus, Eye, Info } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";

const GuestLogin = () => {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
	localStorage.removeItem("token");
	navigate("/dashboard");
  };

  return (
	<AuthLayout>
	  <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl">
		<div className="text-center">
		  <h2 className="text-3xl font-bold text-gray-900 mb-2">
			Guest Access
		  </h2>
		  <p className="text-gray-600">
			Browse public events without registration
		  </p>
		</div>

		<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
		  <div className="flex items-start space-x-3">
			<Info className="w-5 h-5 text-purple-500 mt-0.5" />
			<div className="flex-1">
			  <h3 className="font-medium text-purple-900 mb-1">
				As a guest, you can:
			  </h3>
			  <ul className="text-purple-700 space-y-2">
				<li className="flex items-center">
				  <Eye className="w-4 h-4 mr-2" />
				  View all public events
				</li>
				<li className="flex items-center">
				  <Eye className="w-4 h-4 mr-2" />
				  Use search and filter features
				</li>
			  </ul>
			</div>
		  </div>
		</div>

		<div className="space-y-4">
		  <button
			onClick={handleGuestLogin}
			className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition duration-200"
		  >
			<LogIn className="w-5 h-5 inline mr-2" />
			Continue as Guest
		  </button>

		  <div className="flex justify-between">
			<Link
			  to="/login"
			  className="flex-1 mr-2 text-center py-3 px-4 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition duration-200"
			>
			  <LogIn className="w-5 h-5 inline mr-2" />
			  Login
			</Link>
			<Link
			  to="/register"
			  className="flex-1 ml-2 text-center py-3 px-4 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition duration-200"
			>
			  <UserPlus className="w-5 h-5 inline mr-2" />
			  Register
			</Link>
		  </div>
		</div>
	  </div>
	</AuthLayout>
  );
};

export default GuestLogin;
