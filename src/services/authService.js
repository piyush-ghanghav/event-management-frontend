import axios from "axios";
import { API_URL } from "../config";
export const authService = {
    register:async(userData) =>{
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, userData);
            return res.data;
        } catch (error) {
            throw error.response?.data?.error || "Registration failed. Please try again.";
        }
    },

    login: async (credentials) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`,credentials );
            localStorage.setItem("token", res.data.token);
            return res.data;
        } catch (error) {
            throw error.response?.data?.error || "Login failed. Please try again.";
        }
    },
    logout: () => {
        localStorage.removeItem("token");
      }

};
