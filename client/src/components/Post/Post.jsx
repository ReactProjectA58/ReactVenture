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

export default function Post({ post, onRemove, onRestore }) {
  const { user, userData } = useContext(AppContext);

  const [isLikedByUser, setIsLikedByUser] = useState(
    Array.isArray(post.likedBy) && post.likedBy.includes(userData?.handle)
  );

  // console.log(typeof post.likedBy);
  // console.log(typeof post.isDeleted);

  const [isPostDeleted, setIsPostDeleted] = useState(post.isDeleted);

  // console.log(post.isDeleted);

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
    // removePost(post.id);
    setIsPostDeleted(true);
  };

  const restore = () => {
    onRestore(post.id);
    // restorePost(post.id);
    setIsPostDeleted(false);
  };

  // console.log(userData.isAdmin);

  return (
    <div className="post">
      <p>{post.content}</p>
      <p>
        by {post.author},{" "}
        {new Date(post.createdOn).toLocaleDateString("bg-BG").toString()}
      </p>

      <Link to={`/posts/${post.id}`}>View</Link>

      {isLikedByUser ? (
        <button onClick={dislike}>Dislike</button>
      ) : (
        <button onClick={like}>Like</button>
      )}

      {userData.isAdmin && (
        <button
          type={isPostDeleted ? "restore-but" : "remove-but"}
          onClick={isPostDeleted ? restore : remove}
        >
          {isPostDeleted ? "Restore post" : "Remove post"}
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
  }),
};
