import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ViewRepos from "./pages/ViewRepos";
import RepoDetails from "./components/RepoDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:username/repos" element={<ViewRepos />} />
      <Route path="/user/:username/repo/:repoName" element={<RepoDetails />} />
    </Routes>
  );
}

export default App;
