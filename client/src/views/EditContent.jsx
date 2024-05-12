import React, { useState } from "react";
import PropTypes from "prop-types";
import { editPost, removePost } from "../services/posts.service";
import {editComment } from "../services/comment.service";

export function EditPost({ post }) {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState(post.content);

  const handlePostEdit = () => {
    setIsEditingPost(true);
    setEditedPostContent(post.content);
  };

  const handlePostUpdate = async () => {
    try {
      await editPost(post.id, editedPostContent);
      post.content = editedPostContent;
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPost(false);
    setEditedPostContent(post.content);
  };

  return (
    <div>
      {isEditingPost ? (
        <div>
          <textarea value={editedPostContent} onChange={(e) => setEditedPostContent(e.target.value)} />
          <button onClick={handlePostUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
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
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export function EditComment({ comment }) {
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState(comment.content);

  const handleCommentEdit = () => {
    setIsEditingComment(true);
    setEditedCommentContent(comment.content);
  };

  const handleCommentUpdate = async () => {
    try {
      await editComment(comment.id, editedCommentContent);
      comment.content = editedCommentContent;
      setIsEditingComment(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingComment(false);
    setEditedCommentContent(comment.content);
  };

  return (
    <div>
      {isEditingComment ? (
        <div>
          <textarea value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)} />
          <button onClick={handleCommentUpdate}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
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
