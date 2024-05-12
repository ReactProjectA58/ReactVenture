import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByHandle } from "../services/users.service";

function ProfilePage() {
  const { handle } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const snapshot = await getUserByHandle(handle);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUserData();
  }, [handle]);

  return (
    <div>
      {userData && (
        <div>
          <h1>{userData.firstName} {userData.lastName}</h1>
          <p>Email: {userData.email}</p>
          <p>Handle: {userData.handle}</p>
          {/* Render other user data as needed */}
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
