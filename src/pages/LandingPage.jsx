import { useNavigate } from "react-router-dom";

export default function HeroSection() {
	
  const navigate = useNavigate();

  return (
    <div className="relative h-screen">
      <img
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
        alt="Event venue"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Create Unforgettable Events
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Your all-in-one platform for planning, managing, and hosting
              successful events
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition duration-200"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/guest")}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition duration-200"
              >
                Guest Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
