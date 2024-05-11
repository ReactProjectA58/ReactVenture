import PropTypes from "prop-types";
import React, { useState } from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import {
  likePost,
  dislikePost,
  removePost,
  restorePost,
} from "../../services/posts.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function Post({ post, showViewButton, onRemove, onRestore }) {
  const { user, userData } = useContext(AppContext);

  const [isLikedByUser, setIsLikedByUser] = useState(
    Array.isArray(post.likedBy) && post.likedBy.includes(userData?.handle)
  );

  const [isPostDeleted, setIsPostDeleted] = useState(post.isDeleted);

  const like = () => {
    likePost(post.id, userData.handle);
    setIsLikedByUser(true);
  };

  const dislike = () => {
    dislikePost(post.id, userData.handle);
    setIsLikedByUser(false);
  };

  const remove = () => {
    onRemove(post.id);
    setIsPostDeleted(true);
  };

  const restore = () => {
    onRestore(post.id);
    setIsPostDeleted(false);
  };

  const isAdmin = userData && userData.isAdmin;

  return (
    <div className="post">
      <p>{post.title}</p>
      <p>{post.content}</p>
      <p>
        by {post.author},{" "}
        {new Date(post.createdOn).toLocaleDateString("bg-BG").toString()}
      </p>

      {showViewButton && <Link to={`/posts/${post.id}`}>View</Link>}

      {isLikedByUser ? (
        <button onClick={dislike}>Dislike</button>
      ) : (
        <button onClick={like}>Like</button>
      )}

      <p>Likes: {post.likedBy.length}</p>

      {isPostDeleted && isAdmin && post.isDeleted && (
        <button type="restore-but" onClick={restore}>
          Restore post
        </button>
      )}

      {!isPostDeleted && isAdmin && !post.isDeleted && (
        <button type="remove-but" onClick={remove}>
          Remove post
        </button>
      )}
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string,
    likedBy: PropTypes.array,
    isDeleted: PropTypes.bool,
    title: PropTypes.string.isRequired,
    showViewButton: PropTypes.bool,
  }),
};
