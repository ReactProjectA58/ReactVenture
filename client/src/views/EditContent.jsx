import React, { useState } from "react";
import PropTypes from "prop-types";
import { editPost, removePost } from "../services/posts.service";
import { editComment } from "../services/comment.service";
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH, POST_CONTENT_MAX_LENGTH, POST_CONTENT_MIN_LENGTH, POST_TITLE_MAX_LENGTH, POST_TITLE_MIN_LENGTH } from "../common/constants";


export function EditPost({ post }) {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostTitle, setEditedPostTitle] = useState(post.title);
  const [editedPostContent, setEditedPostContent] = useState(post.content);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePostEdit = () => {
    setIsEditingPost(true);
    setEditedPostTitle(post.title);
    setEditedPostContent(post.content);
  };

  const validatePost = () => {
    if (editedPostTitle.length === 0 || editedPostContent.length === 0) {
      setErrorMessage("Title and content cannot be empty.");
      return false;
    }
    if (editedPostTitle.length < POST_TITLE_MIN_LENGTH) { // Check if title is too short
      setErrorMessage(`Title must be at least ${POST_TITLE_MIN_LENGTH} characters.`);
      return false;
    }
    if (editedPostTitle.length > POST_TITLE_MAX_LENGTH) {
      setErrorMessage(`Title cannot exceed ${POST_TITLE_MAX_LENGTH} characters.`);
      return false;
    }
    if (editedPostContent.length < POST_CONTENT_MIN_LENGTH) {
      setErrorMessage(`Content must be at least ${POST_CONTENT_MIN_LENGTH} characters.`);
      return false;
    }
    if (editedPostContent.length > POST_CONTENT_MAX_LENGTH) {
      setErrorMessage(`Content cannot exceed ${POST_CONTENT_MAX_LENGTH} characters.`);
      return false;
    }
    return true;
  };

  const handlePostUpdate = async () => {
    try {
      if (validatePost()) {
        await editPost(post.id, editedPostTitle, editedPostContent);
        post.title = editedPostTitle;
        post.content = editedPostContent;
        setIsEditingPost(false);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPost(false);
    setEditedPostTitle(post.title);
    setEditedPostContent(post.content);
    setErrorMessage("");
  };

  return (
    <div>
      {isEditingPost ? (
        <div>
          <input type="text" value={editedPostTitle} onChange={(e) => setEditedPostTitle(e.target.value)} />
          <textarea value={editedPostContent} onChange={(e) => setEditedPostContent(e.target.value)} />
          <button onClick={handlePostUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <button onClick={handlePostEdit}>Edit Post</button>
        </div>
      )}
    </div>
  );
}

EditPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export function EditComment({ comment }) {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState(comment.content);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCommentEdit = () => {
    setIsEditingComment(true);
    setEditedCommentContent(comment.content);
  };

  const validateComment = () => {
    if (editedCommentContent.length < COMMENT_MIN_LENGTH) {
      setErrorMessage(`Comment must be at least ${COMMENT_MIN_LENGTH} characters.`);
      return false;
    }
    if (editedCommentContent.length > COMMENT_MAX_LENGTH) {
      setErrorMessage(`Comment cannot exceed ${COMMENT_MAX_LENGTH} characters.`);
      return false;
    }
    return true;
  };

  const handleCommentUpdate = async () => {
    try {
      if (validateComment()) {
        await editComment(comment.id, editedCommentContent);
        comment.content = editedCommentContent;
        setIsEditingComment(false);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setEditedCommentContent(comment.content);
    setErrorMessage("");
  };

  return (
    <div>
      {isEditingComment ? (
        <div>
          <textarea value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)} />
          <button onClick={handleCommentUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      ) : (
        <button onClick={handleCommentEdit}>Edit Comment</button>
      )}
    </div>
  );
}

EditComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};
