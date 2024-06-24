import React, { useContext } from "react";
import PropTypes from "prop-types";
import { likeComment, dislikeComment } from "../../services/comment.service";
import { AppContext } from "../../context/AppContext";

const Comment = ({ comment }) => {
  const { userData } = useContext(AppContext);

  const handleLike = () => likeComment(comment.id, userData.handle);

  const handleDislike = () => dislikeComment(comment.id, userData.handle);

  return (
    <div
      className="comment-container card mb-3"
      style={{ padding: "0", height: "auto" }}
    >
      <div className="card-body" style={{ padding: "0.3rem" }}>
        <p className="card-text">{comment?.content}</p>
        <p className="card-text comment-details">
          <small className="text-muted">
            by {comment?.author},{" "}
            {new Date(comment?.createdOn).toLocaleDateString("bg-BG")}
          </small>
        </p>
        <div className="btn-group" role="group" aria-label="Comment Actions">
          {comment?.likedBy.includes(userData?.handle) ? (
            <button
              className="btn btn-danger comment-button-dislike"
              onClick={handleDislike}
            >
              Dislike
            </button>
          ) : (
            <button
              className="btn btn-primary comment-button-like"
              onClick={handleLike}
              style={{
                marginTop: "1rem",
                fontWeight: "600",
                color: "white",
              }}
            >
              Like
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string,
    likedBy: PropTypes.array,
  }).isRequired,
};

export default Comment;
