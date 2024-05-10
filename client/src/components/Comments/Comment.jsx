import React, { useContext } from "react";
import PropTypes from "prop-types";
// import './Comment.css';
import { likeComment, dislikeComment } from "../../services/comment.service"; // Update the import path accordingly
import { AppContext } from "../../context/AppContext";

/**
 * Comment component to display a single comment.
 * @param {Object} props - The props for the component.
 * @param {Object} props.comment - The comment object containing id, author, content, createdOn, and likedBy.
 */
export default function Comment({ comment }) {
  const { userData } = useContext(AppContext);

  // Function to handle liking a comment
  const handleLike = () => likeComment(comment.id, userData.handle);

  // Function to handle disliking a comment
  const handleDislike = () => dislikeComment(comment.id, userData.handle);

  return (
    <div className="comment">
        <p>{comment?.content}</p>
        <p>by {comment?.author}, {new Date(comment?.createdOn).toLocaleDateString('bg-BG')}</p>
        
        {/* Conditional rendering for Like/Dislike button based on whether the comment is liked by the user */}
        {comment?.likedBy.includes(userData?.handle) ? 
            <button onClick={handleDislike}>Dislike</button> : 
            <button onClick={handleLike}>Like</button>
        }
    </div>
);
}

// Prop types for Comment component
Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string,
    likedBy: PropTypes.array,
  }).isRequired,
};
