import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import PlatformRewards from "./pages/PlatformRewards";
import Staking from "./pages/Staking";
import Leaderboard from "./pages/Leaderboard";
import HolderRewards from "./pages/HoldersReward";
import TempleToMoon from "./pages/TempleToMoon";
import TokenDetail from "./pages/TokenDetail";

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<Start />} />
          <Route path="/token/:id" element={<TokenDetail />} />
          <Route path="/platform" element={<PlatformRewards />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/holder-rewards" element={<HolderRewards />} />
          <Route path="/moon" element={<TempleToMoon />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
