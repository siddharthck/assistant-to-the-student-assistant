import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

function App() {
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [timeRange, setTimeRange] = React.useState("");

  const navigateToDashboard = (range) => {
    setTimeRange(range);
    setShowDashboard(true);
    setShowSettings(false);
  };

  const handleUpdateSettings = () => {
    setShowSettings(true);
    setShowDashboard(false);
  };

  return (
    <div>
      <Navbar onUpdateSettings={handleUpdateSettings} />
      {showSettings ? (
        <LandingPage navigateToDashboard={navigateToDashboard} />
      ) : showDashboard ? (
        <Dashboard timeRange={timeRange} />
      ) : (
        <LandingPage navigateToDashboard={navigateToDashboard} />
      )}
    </div>
  );
}

export default App;
