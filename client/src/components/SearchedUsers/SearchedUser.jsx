import React, { useContext } from "react";
import "./SearchedUser.css";
import { AppContext } from "../../context/AppContext";

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
        {isAdmin && <button className="block-user">Block user</button>}
      </div>
    </div>
  );
}
