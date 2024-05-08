import { useEffect, useState } from "react";
import { getDeletedPosts, restorePost } from "../services/posts.service";
import Post from "../components/Post/Post";

export default function DeletedPosts() {
  const [deletedPosts, setDeletedPosts] = useState([]);

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
          post={post}
          onRestore={() => handleRestorePost(post.id)}
        />
      ))}
    </div>
  );
}
