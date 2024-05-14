import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "./services/auth.service";

export default function RestrictedHeader() {
  const { userData, setAppState } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData && userData.isBlocked) {
      navigate("/blocked");
    }
  }, [userData, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate("/login");
  };

  if (loading) {
    return `loading`;
  }

  return (
    <header className="header-container">
      <div className="navigation-links">
        {!userData.isBlocked && (
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
        )}
      </div>
      <div className="user-section">
        <NavLink onClick={handleLogout} className="nav-link">
          Logout
        </NavLink>
      </div>
    </header>
  );
}
