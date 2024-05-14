import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"; // Import Link
import { AppContext } from "../context/AppContext";
import { editNames } from "../services/users.service";
import { getAllPosts } from "../services/posts.service";

export default function UserProfile() {
  const { userData } = useContext(AppContext);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userPosts, setUserPosts] = useState([]);

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
    } catch (error) {
      setError("Failed to update names. Please try again.");
      console.error("Error updating names:", error);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
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

      <h2>Your Posts</h2>
      {userPosts.length > 0 ? (
        <ul>
          {userPosts.map((post) => (
            <li key={post.id}>
              {/* Link to SinglePost view */}
              <Link to={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
              <p>{post.content}</p>
              {/* Render other post details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
      {error && <p>{error}</p>}
      {successMessage && <p>{successMessage}</p>}

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
      </form>
    </div>
  );
}
