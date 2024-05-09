import { useContext, useEffect, useState } from "react";
import { getDeletedPosts, restorePost } from "../services/posts.service";
import Post from "../components/Post/Post";
import { AppContext } from "../context/AppContext";

export default function DeletedPosts() {
  const [deletedPosts, setDeletedPosts] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getDeletedPosts().then(setDeletedPosts);
  }, []);

  const handleRestorePost = async (postId) => {
    await restorePost(postId);
    setDeletedPosts(deletedPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h1>Deleted Posts</h1>
      {deletedPosts.map((post) => (
        <Post
          key={post.id}
          post={{
            ...post,
            likedBy: Array.isArray(post.likedBy) ? post.likedBy : [],
            createdOn: new Date(post.createdOn).toString(),
          }}
          onRestore={() => userData.isAdmin && handleRestorePost(post.id)}
        />
      ))}
    </div>
  );
}
