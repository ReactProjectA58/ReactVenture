import React, { useContext } from "react";
import "./SearchedUser.css";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

export default function SearchedUser({ user }) {
  const { userData } = useContext(AppContext);
  const isAdmin = userData && userData.isAdmin;

  return (
    <div className="outer-border">
      <div className="user-info">
        <div>
          <p className="name-label">Name:</p>
          <div className="name">
            {user.firstName} {user.lastName}
          </div>
        </div>
        <div>
          <p className="username-label">Username:</p>
          <div className="username">{user.handle}</div>
        </div>
        <div>
          <p className="email-label">Email:</p>
          <div className="email">{user.email}</div>
        </div>
        {isAdmin ? (
          <>
            <button className="block-button">Block user</button>
            <Link to={`/user/${user.id}`} className="profile-link">
              <button className="profile-button">Profile</button>
            </Link>
          </>
        ) : (
          <p className="not-admin-message">You are not authorized to perform this action.</p>
        )}
      </div>
    </div>
  );
}
