import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

function App() {
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");

  const navigateToDashboard = (date) => {
    setSelectedDate(date || new Date().toISOString().split('T')[0]);
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
        <Dashboard selectedDate={selectedDate} />
      ) : (
        <LandingPage navigateToDashboard={navigateToDashboard} />
      )}
    </div>
  );
}

export default App;
