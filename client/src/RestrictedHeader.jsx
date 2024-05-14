import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { NavLink } from "react-router-dom";
import { logoutUser } from "./services/auth.service";

export default function RestrictedHeader() {
  const { userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  if (loading) {
    return `loading`;
  }

  console.log(userData.isBlocked);

  return (
    <header className="header-container">
      <div className="navigation-links">
        {userData && (
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
        )}
      </div>
      <div className="user-section">
        {userData && (
          <NavLink onClick={logout} className="nav-link">
            Logout
          </NavLink>
        )}
      </div>
    </header>
  );
}
