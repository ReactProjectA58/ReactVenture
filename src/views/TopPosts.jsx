// import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getTopPosts } from "../services/posts.service.js";
import Post from "../components/Post/Post";

export default function TopPosts() {
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    getTopPosts().then((posts) => setTopPosts(posts));
  }, []);

  return (
    <div>
      <hr></hr>
      <h2>Top Posts</h2>
      {topPosts.map((post) => (
        <Post key={post.id} post={post} likeCount={post.likedBy.length} /> 
      ))}
    </div>
  );
}
