import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import Loading from "../ui/Loading";
import { getRepoDetails } from "../utils";

function RepoDetails() {
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const { username, repoName } = useParams();

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const repoDetails = await getRepoDetails(username, repoName);

        if (repoDetails) {
          setRepo(repoDetails);
        } else {
          setError("Repository not found");
        }
      } catch (err) {
        setError("Failed to fetch repository details");
        console.error("Error fetching repo details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username && repoName) {
      fetchRepoDetails();
    }
  }, [username, repoName]);

  const handleCopyUrl = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(type);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedUrl(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <NotFound
          title="Repository Not Found"
          message={error || "The repository you're looking for doesn't exist."}
          linkName="Back to Repositories"
          url={`/user/${username}/repos`}
        />
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format file size
  const formatSize = (size) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link
                to={`/${username}/repos`}
                className="hover:text-blue-600 transition-colors"
              >
                {username}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-40">
                {repo.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {repo.name}
                </h1>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    repo.private
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {repo.private ? "Private" : "Public"}
                </span>
              </div>

              {repo.description && (
                <p className="text-gray-600 text-lg mb-4">{repo.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  ⭐ {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  🍴 {repo.forks_count}
                </span>
                <span className="flex items-center gap-1">
                  👁️ {repo.watchers_count}
                </span>
                {repo.license && (
                  <span className="flex items-center gap-1">
                    📄 {repo.license.name}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex gap-3">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span>View on GitHub</span>
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Repository Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Repository Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {repo.stargazers_count}
                  </div>
                  <div className="text-sm text-gray-600">Stars</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {repo.forks_count}
                  </div>
                  <div className="text-sm text-gray-600">Forks</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {repo.watchers_count}
                  </div>
                  <div className="text-sm text-gray-600">Watchers</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {repo.open_issues_count}
                  </div>
                  <div className="text-sm text-gray-600">Open Issues</div>
                </div>
              </div>
            </div>

            {/* Repository Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Repository Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium">{formatSize(repo.size)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Default Branch</span>
                  <span className="font-medium">{repo.default_branch}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {formatDate(repo.created_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Push</span>
                  <span className="font-medium">
                    {formatDate(repo.pushed_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Fork</span>
                  <span
                    className={`font-medium ${
                      repo.fork ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {repo.fork ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Clone URLs */}
            {repo.clone_url && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Clone Repository
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTTPS
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={repo.clone_url}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50"
                      />
                      <button
                        onClick={() => handleCopyUrl(repo.clone_url, "https")}
                        className={`px-4 py-2 rounded-r-lg transition-colors ${
                          copiedUrl === "https"
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {copiedUrl === "https" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  {repo.ssh_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SSH
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={repo.ssh_url}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50"
                        />
                        <button
                          onClick={() => handleCopyUrl(repo.ssh_url, "ssh")}
                          className={`px-4 py-2 rounded-r-lg transition-colors ${
                            copiedUrl === "ssh"
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {copiedUrl === "ssh" ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Owner
              </h2>
              <div className="flex items-center space-x-3">
                <img
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {repo.owner.login}
                  </h3>
                  <p className="text-sm text-gray-600">{repo.owner.type}</p>
                  <a
                    href={repo.owner.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Links
              </h2>
              <div className="space-y-2">
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <span>🌐 Homepage</span>
                  </a>
                )}
                <a
                  href={repo.html_url + "/issues"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <span>🐛 Issues ({repo.open_issues_count})</span>
                </a>
                <a
                  href={repo.html_url + "/pulls"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <span>🔀 Pull Requests</span>
                </a>
                <a
                  href={repo.html_url + "/wiki"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <span>📖 Wiki</span>
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Issues</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      repo.has_issues
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {repo.has_issues ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Projects</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      repo.has_projects
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {repo.has_projects ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wiki</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      repo.has_wiki
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {repo.has_wiki ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discussions</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      repo.has_discussions
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {repo.has_discussions ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoDetails;
