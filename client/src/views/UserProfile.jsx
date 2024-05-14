import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link
import { AppContext } from "../context/AppContext";
import { editNames } from "../services/users.service";
import { getAllPosts } from "../services/posts.service";
import "./UserProfile.css"; // Import CSS file for styling

export default function UserProfile() {
  const { userData, user } = useContext(AppContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        if (userData) {
          const posts = await getAllPosts(userData.handle);
          setUserPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setError("Failed to fetch user posts. Please try again.");
      }
    }

    fetchUserPosts();
  }, [userData]);

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
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update names. Please try again.");
      console.error("Error updating names:", error);
    }
  };

  return (
    <div className="user-profile-container">
      {userData && (
        <div className="user-outer-border-container">
          <h1 style={{ fontSize: 24 }}>My Profile</h1>
          <div className="user-info-container">
            <div className="profile-info">
              {!isEditing && (
                <>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Name: </span>{" "}
                    {userData.firstName} {userData.lastName}{" "}
                    <button
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Username: </span>{" "}
                    {userData.handle}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Email: </span>{" "}
                    {userData.email}
                  </p>
                </>
              )}
              {isEditing && (
                <form onSubmit={handleSubmit}>
                  <div className="edit-row">
                    <p style={{ fontWeight: "bold" }}>Name:</p>
                    <div className="new-first-name-field">
                      <input
                        type="text"
                        placeholder={userData.firstName}
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                      />
                    </div>
                    <div className="new-last-name-field">
                      <input
                        type="text"
                        placeholder={userData.lastName}
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                      />
                    </div>
                    <div>
                      <button className="update-button" type="submit">
                        Update
                      </button>
                    </div>
                    <div>
                      <button
                        className="cancel-button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Username: </span>{" "}
                    {userData.handle}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Email: </span>{" "}
                    {userData.email}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="posts-outer-border-container">
        <div className="user-posts-title">
          <h2 style={{ fontSize: 24 }}>My Posts</h2>
        </div>
        <div className="user-posts-container">
          {userPosts.length > 0 ? (
            <ul>
              {userPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/posts/${post.id}`}>
                    <h1 style={{ fontSize: 28 }}>{post.title}</h1>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found.</p>
          )}
          {error && <p>{error}</p>}
          {successMessage && <p>{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}
