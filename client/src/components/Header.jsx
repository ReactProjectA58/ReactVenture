import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import AdminPanelDropdown from "./AdminPanel/AdminPanel";
import { BASE } from "../common/constants";

export default function Header() {
  const { user, userData } = useContext(AppContext);
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

  return (
    <header
      className="header-container"
      style={{
        backgroundColor: "rgba(255,255,255, 0.6)",
      }}
    >
      <div className="navigation-links">
        <NavLink to={`${BASE}`} className="nav-link">
          Home
        </NavLink>
        {user && (
          <NavLink to={`${BASE}posts`} className="nav-link">
            All posts
          </NavLink>
        )}
        {user && (
          <NavLink to={`${BASE}posts-create`} className="nav-link">
            Create post
          </NavLink>
        )}
      </div>
      <div className="user-section">
        {user && userData && (
          <>
            <span className="user-welcome">
              Welcome,{" "}
              <span className="handle">{userData.handle || "Loading"}</span>
            </span>

            <NavLink to={`${BASE}my-profile`} className="nav-link">
              My Profile
            </NavLink>

            <Link
              onClick={logout}
              className="logout-nav-link"
              style={{ color: "rgb(90, 68, 22)" }}
            >
              Logout
            </Link>

            {/* <Button onClick={logout} className="logout-button">
              LogOut
            </Button> */}

            <span className="admin-panel">
              {userData.isAdmin && <AdminPanelDropdown />}{" "}
            </span>
          </>
        )}
        {!user && (
          <>
            <NavLink to={`${BASE}login`} className="nav-link">
              Login
            </NavLink>
            <NavLink to={`${BASE}register`} className="nav-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
