import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthForm from "../components/auth/AuthForm";
import { authService } from "../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
	
    try {
      await authService.login( {
        email,
        password,
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error|| "Login failed. Please try again.");
    }
  };

  const handleFocus = () => {
    setError(""); 
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Log In</h2>
          <p className="text-gray-600">Access your EventMaster account</p>
        </div>

        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          error={error}
          onSubmit={handleLogin}
          onFocus={handleFocus}
        />

        <div className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Register now
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
