import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";
import AdminPanelDropdown from "./AdminPanel/AdminPanel";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  return (
    <header className="header-container">
      <div className="navigation-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        {user && (
          <NavLink to="/posts" className="nav-link">
            All posts
          </NavLink>
        )}
        {user && (
          <NavLink to="/posts-create" className="nav-link">
            Create post
          </NavLink>
        )}
      </div>
      <div className="user-section">
        {user && userData && (
          <>
            <span className="user-welcome">{`Welcome, ${
              userData.handle || "Loading"
            }`}</span>

            <Button onClick={logout} className="logout-button">
              LogOut
            </Button>

            <span className="admin-panel">
              {userData.isAdmin && <AdminPanelDropdown />}{" "}
            </span>
          </>
        )}
        {!user && (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
