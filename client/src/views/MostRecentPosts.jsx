import { useState, useEffect } from "react";
import { getRecentPosts } from "../services/posts.service.js";
import Post from "../components/Post/Post";

export default function RecentPosts() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    getRecentPosts().then((posts) => setRecentPosts(posts));
  }, []);

  return (
    <div>
      <h2>Recent Posts</h2>
      {recentPosts.map((post) => (
        <Post
          key={post.id}
          post={post}
          likeCount={post.likedBy.length}
          onRemove={() => false}
        /> // Pass the like count
      ))}
    </div>
  );
}
