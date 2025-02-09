const AuthLayout = ({ children }) => {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
  const title = "EventMaster";
  const subtitle = "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        {/* Left side - Hero section */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative">
          <img
            src={backgroundImageUrl}
            alt="Event background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 flex items-center justify-center">
            <div className="text-white text-center p-8 backdrop-blur-lg">
              <h1 className="text-5xl font-bold mb-4">{title}</h1>
              <p className="text-2xl font-light">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white bg-opacity-10 backdrop-blur-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
