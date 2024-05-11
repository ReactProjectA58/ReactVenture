import React, { useState } from "react";
import { searchUsers } from "../services/admin.service";
import SearchedUser from "../components/SearchedUsers/SearchedUser";

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    const results = await searchUsers(searchTerm);
    setSearchResults(results);
    setSearchPerformed(true);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for user..."
      />

      <button onClick={handleSearch}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>

      {searchPerformed && searchResults.length === 0 && (
        <>
          <h2>Search Results:</h2>
          <p>No users found.</p>
        </>
      )}

      <div>
        {searchResults.map((user, index) => (
          <SearchedUser
            key={user.id}
            user={user}
            styleType={
              index === 0
                ? "alternate-first"
                : index === searchResults.length - 1
                ? "alternate-last"
                : "default"
            }
          />
        ))}
      </div>
    </div>
  );
}
