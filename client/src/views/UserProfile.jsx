import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ProfilePage() {
  const { userData } = useContext(AppContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New First Name:", newFirstName);
    console.log("New Last Name:", newLastName);
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {userData && (
        <>
          <p>
            Name: {userData.firstName} {userData.lastName}
          </p>
          <p>Username: {userData.handle}</p>
          <p>Email: {userData.email}</p>
          {userData.isAdmin && <p>Status: Admin</p>}
        </>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New First Name"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Last Name"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <button type="submit">Update Name</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
