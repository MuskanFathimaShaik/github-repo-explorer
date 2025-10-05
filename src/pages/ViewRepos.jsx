import { useParams, Link } from "react-router-dom";
import { getUserRepos } from "../utils";
import { useEffect, useState } from "react";
import NotFound from "../components/NotFound";
import Loading from "../ui/Loading";
import RepoCard from "../components/RepoCard";
import SearchBar from "../ui/SearchBar";

function ViewRepos() {
  const [repoList, setRepoList] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("updated");
  const [searchTerm, setSearchTerm] = useState("");
  const { username } = useParams();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const repos = await getUserRepos(username);

        if (repos && repos.length > 0) {
          setRepoList(repos);
          setFilteredRepos(repos);
        } else {
          setRepoList([]);
          setFilteredRepos([]);
        }
      } catch (err) {
        setError("Failed to fetch repositories");
        console.error("Error fetching repos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchRepos();
    }
  }, [username]);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredRepos(repoList);
      return;
    }

    const filtered = repoList.filter(
      (repo) =>
        repo.name.toLowerCase().includes(term.toLowerCase()) ||
        (repo.description &&
          repo.description.toLowerCase().includes(term.toLowerCase())) ||
        (repo.language &&
          repo.language.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredRepos(filtered);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);

    const sortedRepos = [...filteredRepos].sort((a, b) => {
      switch (sortType) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    setFilteredRepos(sortedRepos);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("updated");
    setFilteredRepos(repoList);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && repoList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <NotFound
          title={`Repositories for ${username}`}
          linkName="Home Page"
          url="/"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {username}'s Repositories
              </h1>
              <p className="text-gray-600">
                {filteredRepos.length} of {repoList.length} repositories
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <Link
                to={`/`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search repositories by name, description, or language..."
                value={searchTerm}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="updated">Last updated</option>
                  <option value="stars">Most stars</option>
                  <option value="forks">Most forks</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {(searchTerm || sortBy !== "updated") && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 transition duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Repository Grid */}
        <div className="w-full">
          {filteredRepos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No repositories found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No repositories match "${searchTerm}". Try adjusting your search terms.`
                  : "No repositories available."}
              </p>
              {searchTerm && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Repository Stats Summary */}
              <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {repoList.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Repos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {repoList.reduce(
                      (sum, repo) => sum + repo.stargazers_count,
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Stars</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {repoList.reduce((sum, repo) => sum + repo.forks_count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Forks</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      new Set(
                        repoList.map((repo) => repo.language).filter(Boolean)
                      ).size
                    }
                  </div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
              </div>

              {/* Repository Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} username={username} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewRepos;
