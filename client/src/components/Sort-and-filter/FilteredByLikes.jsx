import React, { useState, useEffect } from "react";
import { filterPostsByLikes, likePost } from "../../services/posts.service.js";
import Post from "../Post/Post.jsx";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { removePost } from "../../services/posts.service.js";

const FilteredByLikes = () => {
  const [posts, setPosts] = useState([]);
  const { userData } = useContext(AppContext);

  const handleRemovePost = async (postId) => {
    await removePost(postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleLikePost = async (postId) => {
    await likePost(postId, userData.handle);
    const updatedPosts = await filterPostsByLikes();
    setPosts(updatedPosts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const filteredPosts = await filterPostsByLikes();
      const postsWithLikedBy = filteredPosts.map((post) => ({
        ...post,
        likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
        likeCount: post.likedBy ? post.likedBy.length : 0,
      }));
      setPosts(postsWithLikedBy);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Liked posts</h2>
      <ul>
        {posts.map((post) => (
          <div key={post.id}>
            <Post
              post={post}
              onRemove={() =>
                (userData.isAdmin || userData.handle === post.author) &&
                handleRemovePost(post.id)
              }
              onLike={() => handleLikePost(post.id)}
              showViewButton={true}
              likesCount={post.likedBy ? post.likedBy.length : 0}
            />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FilteredByLikes;
