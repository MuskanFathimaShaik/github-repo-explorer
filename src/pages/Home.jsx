import {
  ArrowUp,
  Loader,
  Search,
  SquareCode,
  Star,
  Clock,
  ExternalLink,
  Github,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setIsLoading(true);

    // Basic validation - check if username contains only allowed characters
    const githubUsernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernamePattern.test(username)) {
      setError("Please enter a valid GitHub username");
      setIsLoading(false);
      return;
    }

    try {
      // Optional: Verify the user exists before routing
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      navigate(`/${username}/repos`);
    } catch (err) {
      setError(
        "GitHub user not found. Please check the username and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (event) => {
    const { value } = event.target;
    setUsername(value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white">
      <div className="max-w-3xl w-full space-y-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full opacity-20 blur-md group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-pulse"></div> */}
            <img
              src="/images/github-gif.gif"
              alt="GitHub Octocat"
              width="200"
              height="200"
              className="relative  transform transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            GitHub Repositories Explorer
          </h1>
          <p className="text-lg text-gray-600 max-w-md mt-4 leading-relaxed">
            Discover GitHub users and explore their repositories with a simple
            search
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex flex-col space-y-2">
            <div className="relative flex items-center bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-lg hover:shadow-lg">
              <div className="absolute left-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                className="w-full py-4 pl-12 pr-20 rounded-xl outline-none text-gray-800 placeholder-gray-500 text-lg font-medium"
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={handleOnChange}
                disabled={isLoading}
                aria-label="GitHub username"
              />
              <button
                className="absolute right-2 flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                type="submit"
                disabled={isLoading || !username.trim()}
                aria-label="Search user"
              >
                {isLoading ? (
                  <Loader className="animate-spin text-xl" />
                ) : (
                  <ArrowUp className="transform rotate-90" />
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 transition-all duration-300 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Helper Text */}
            <p className="text-sm text-gray-500 px-2 font-medium">
              Enter a valid GitHub username to view their public repositories
            </p>
          </div>
        </form>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 group">
            <div className="text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg inline-flex group-hover:bg-blue-100 transition-colors duration-300">
              <SquareCode size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-700 transition-colors duration-300">
              Browse Repositories
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Explore all public repositories of any GitHub user with detailed
              information and metrics
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 group">
            <div className="text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg inline-flex group-hover:bg-blue-100 transition-colors duration-300">
              <Star size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-700 transition-colors duration-300">
              Project Insights
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              View stars, forks, languages and other key metrics to evaluate
              project popularity
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 group">
            <div className="text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg inline-flex group-hover:bg-blue-100 transition-colors duration-300">
              <Clock size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-700 transition-colors duration-300">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              See the latest updates and project activity to stay informed about
              development progress
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
