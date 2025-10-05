import { Github } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const RepoCard = ({ repo, username }) => {
  console.log(username);
  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "today";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white rounded-lg h-80 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 flex flex-col items-start ">
            <Link
              to={`/user/${username}/repo/${repo.name}`}
              className="group-hover:text-blue-600 transition-colors duration-200"
            >
              <h3 className="hover:text-blue-600 transition-colors duration-200 text-lg font-semibold text-gray-900 truncate mb-1 inline-block">
                {repo.name}
              </h3>
            </Link>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                repo.private
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-green-100 text-green-800 border border-green-200"
              }`}
            >
              {repo.private ? "Private" : "Public"}
            </span>
          </div>

          {/* Star count badge */}
          {repo.stargazers_count > 0 && (
            <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-sm ml-2">
              ⭐ {repo.stargazers_count}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Description */}
          <div className="flex-1 mb-3">
            {repo.description ? (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {repo.description}
              </p>
            ) : (
              <p className="text-gray-400 text-sm italic">
                No description provided.
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              {repo.language && (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  {repo.language}
                </span>
              )}
              <span className="flex items-center">
                🍴 {repo.forks_count || 0}
              </span>
              {repo.license && (
                <span className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                  📄 {repo.license.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Updated {formatRelativeTime(repo.updated_at)}
          </span>

          <div className="flex space-x-2">
            <div className="text-black bg-gray-100 rounded-full w-7 h-7 flex items-center justify-center hover:text-gray-600 transition-colors duration-200">
              <Github className="w-4 h-4" />
            </div>
            <Link
              to={`/user/${username}/repo/${repo.name}`}
              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition-colors duration-200"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
