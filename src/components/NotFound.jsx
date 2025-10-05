import { Smile } from "lucide-react";
import React from "react";

const NotFound = ({ title = "", linkName = "Home", url = "/" }) => {
  return (
    <div className="max-w-lg w-full mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Illustration Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="text-center">
            <Smile className="w-24 h-24 mx-auto mb-2 text-blue-500" />
            <h1 className="text-6xl font-bold text-blue-500 mb-2">404</h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {title ? `${title} Not Found` : "Page Not Found"}
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {title
              ? `We couldn't find any repositories for "${title}". The user might not exist or have no public repositories.`
              : "The page you're looking for doesn't exist or has been moved."}
          </p>

          <div className="space-y-4">
            <a
              href={url}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Back to {linkName}
            </a>

            <button
              onClick={() => window.history.back()}
              className="text-blue-500 hover:text-blue-600 font-medium transition duration-200"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NotFound);
