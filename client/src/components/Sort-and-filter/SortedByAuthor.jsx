import React, { useState, useEffect } from 'react';
import { sortPostsByAuthor } from '../../services/posts.service.js';
import Post from '../Post/Post.jsx';
import { useContext } from "react";
import { AppContext } from '../../context/AppContext';
import { removePost } from '../../services/posts.service.js';





const SortedByAuthor = () => {
  const [posts, setPosts] = useState([]);
  const { userData } = useContext(AppContext);


  const handleRemovePost = async (postId) => {
    await removePost(postId);
    const removedPost = posts.find((post) => post.id === postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };


  useEffect(() => {
    const fetchPosts = async () => {
      const sortedPosts = await sortPostsByAuthor();
      setPosts(sortedPosts);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts Sorted By Author</h2>
      <ul>
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            post={post}
            onRemove={() =>
              (userData.isAdmin || userData.handle === post.author) &&
              handleRemovePost(post.id)
            }
            showViewButton={true}
            likesCount={post.likedBy ? post.likedBy.length : 0}
          />
        </div>
      ))}
      </ul>
    </div>
  );
};

export default SortedByAuthor;
