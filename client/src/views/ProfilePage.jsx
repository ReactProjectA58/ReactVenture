import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function UserPage() {
  const { userData } = useContext(AppContext);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Name:</p>
      <p>Email: </p>
      {userData.isAdmin && <p>Admin: </p>}
    </div>
  );
}
