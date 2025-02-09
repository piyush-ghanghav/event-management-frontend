import React from "react";
import InputField from "../ui/InputField";
import Alert from "../ui/Alert";

const AuthForm = ({
  email,
  password,
  setEmail,
  setPassword,
  error,
  onSubmit,
  onFocus,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <Alert message={error} />

    <InputField
      label="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onFocus={onFocus}
      placeholder="Enter your email"
    />

    <InputField
      label="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onFocus={onFocus}
      placeholder="Enter your password"
    />

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
    >
      Log In
    </button>
  </form>
);

export default AuthForm;
