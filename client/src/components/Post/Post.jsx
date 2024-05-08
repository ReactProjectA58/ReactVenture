import PropTypes from "prop-types";
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

export default function Post({ post }) {
  const { userData, user } = useContext(AppContext);
  const like = () => likePost(post.id, userData.handle);
  const dislike = () => dislikePost(post.id, userData.handle);
  const remove = () => removePost(post.id);
  const restore = () => restorePost(post.id);

  const isLikedByUser =
    Array.isArray(post.likedBy) && post.likedBy.includes(userData?.handle);

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

      {user.isAdmin && post.isDeleted && (
        <button type="restore-but" onClick={restore}>
          Restore post
        </button>
      )}

      {user.isAdmin && !post.isDeleted && (
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
  }),
};
