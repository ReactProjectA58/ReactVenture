import { NavLink } from "react-router-dom";
import Button from "./Button";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../services/auth.service";

export default function Header() {
  const { user, userData, setAppState } = useContext(AppContext);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
  };

  return (
    <header>
      <NavLink to="/">Home</NavLink>
      {user && <NavLink to="/posts">All posts</NavLink>}
      {user && <NavLink to="/posts-create">Create post</NavLink>}
      {user && userData && (
        <>
          {userData.isAdmin && <NavLink to="/deleted">Deleted Posts</NavLink>}
          {`Welcome, ${userData.handle || "Loading"}`}
          <Button onClick={logout}>LogOut</Button>
        </>
      )}
      {!user && (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </header>
  );
}
