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

export default function Post({ post, showViewButton }) {
    const { userData } = useContext(AppContext);
    const like = () => likePost(post.id, userData.handle);
    const dislike = () => dislikePost(post.id, userData.handle);
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
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            {/* Conditionally render the View button based on the showViewButton prop */}
            {showViewButton && <Link to={`/posts/${post.id}`}>View</Link>}
            {post?.likedBy.includes(userData?.handle)
            ? <button onClick={dislike}>Dislike</button>
            : <button onClick={like}>Like</button>
            }
        </div>
    )
}

Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string,
        author: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdOn: PropTypes.string,
        likedBy: PropTypes.array,
    }),
    showViewButton: PropTypes.bool.isRequired, // Define prop type for showViewButton
}
