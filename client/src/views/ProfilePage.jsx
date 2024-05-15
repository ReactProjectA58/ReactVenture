import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserByHandle } from "../services/users.service";
import { getDeletedPostsByAuthor } from "../services/posts.service";

function ProfilePage() {
  const { handle } = useParams();
  const [userData, setUserData] = useState(null);
  const [deletedUserPosts, setDeletedUserPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userSnapshot = await getUserByHandle(handle);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUserData(userData);

          // Fetch deleted posts by author's handle
          const deletedPosts = await getDeletedPostsByAuthor(userData.handle);

          // Set deleted user posts state
          setDeletedUserPosts(deletedPosts);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [handle]);

  return (
    <div style={{ marginTop: "13rem" }}>
      {userData && (
        <div>
          <p>
            <span style={{ fontWeight: "700" }}>Name: </span>
            {userData.firstName} {userData.lastName}
          </p>
          <p>
            <span style={{ fontWeight: "700" }}>Email:</span> {userData.email}
          </p>
          <p>
            <span style={{ fontWeight: "700" }}>Username:</span>{" "}
            {userData.handle}
          </p>
        </div>
      )}

      <div>
        <h2>User&apos;s Deleted Posts</h2>
        <ul>
          {deletedUserPosts.length > 0 ? (
            deletedUserPosts.map((post) => (
              <li key={post.id}>
                <div>
                  <h3>
                    <del>{post.title}</del> (Deleted)
                  </h3>
                  <p>
                    <i>This post has been deleted.</i>
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p>No deleted posts found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;
