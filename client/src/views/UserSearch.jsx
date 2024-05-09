import React, { useState } from "react";
import { searchUsers } from "../services/admin.service";

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
      <button onClick={handleSearch}>Search</button>

      <h2>Search Results:</h2>
      {searchPerformed && searchResults.length === 0 && <p>No users found.</p>}

      <div>
        <ul>
          {searchResults.map((user) => (
            <li key={user.id}>
              <div>{user.handle}</div>
              <div>{user.email}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
