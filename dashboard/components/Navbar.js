import React from "react";

function Navbar({ onUpdateSettings }) {
  return (
    <nav>
      <button onClick={onUpdateSettings}>Update Settings</button>
      <button>View Custom Date</button>
    </nav>
  );
}

export default Navbar;
