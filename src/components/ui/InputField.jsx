import React from "react";

const InputField = ({ label, type, value, onChange, onFocus, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
      placeholder={placeholder}
    />
  </div>
);

export default InputField;
