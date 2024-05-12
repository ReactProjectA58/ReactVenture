import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { editNames } from "../services/users.service";

export default function ProfilePage() {
  const { userData } = useContext(AppContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      newFirstName.length < 4 ||
      newFirstName.length > 32 ||
      newFirstName.trim() === "" ||
      !newFirstName.match(/^[A-Z][a-zA-Z]*$/)
    ) {
      setError(
        "First name must be between 4 and 32 characters, cannot be empty, and must start with a capital letter."
      );
      return;
    }
    if (
      newLastName.length < 4 ||
      newLastName.length > 32 ||
      newLastName.trim() === "" ||
      !newLastName.match(/^[A-Z][a-zA-Z]*$/)
    ) {
      setError(
        "Last name must be between 4 and 32 characters, cannot be empty, and must start with a capital letter."
      );
      return;
    }

    try {
      await editNames(userData.handle, newFirstName, newLastName);
      userData.firstName = newFirstName;
      userData.lastName = newLastName;
      setNewFirstName("");
      setNewLastName("");
      setError("");
      setSuccessMessage("Name updated successfully!");
    } catch (error) {
      setError("Failed to update names. Please try again.");
      console.error("Error updating names:", error);
    }
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
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
}
