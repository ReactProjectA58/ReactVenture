import { useContext, useState } from "react";
import Button from "../components/Button";
import { addPost } from "../services/posts.service";
import { AppContext } from "../context/AppContext";
import {
  POST_CONTENT_MAX_LENGTH,
  POST_CONTENT_MIN_LENGTH,
  POST_TITLE_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
} from "../common/constants";
import { Navigate, useNavigate } from "react-router-dom";
import "./CreatePost.css";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const updatePost = (value, key) => {
    setPost({
      ...post,
      [key]: value,
    });
  };

  const validateTitle = (title) => {
    return (
      title.length >= POST_TITLE_MIN_LENGTH &&
      title.length <= POST_TITLE_MAX_LENGTH
    );
  };

  const validateContent = (content) => {
    return (
      content.length >= POST_CONTENT_MIN_LENGTH &&
      content.length <= POST_CONTENT_MAX_LENGTH
    );
  };

  const createPost = async () => {
    if (!validateTitle(post.title)) {
      return alert(
        `Title must be between ${POST_TITLE_MIN_LENGTH} and ${POST_TITLE_MAX_LENGTH} characters long.`
      );
    }

    if (!validateContent(post.content)) {
      return alert(
        `Content must be between ${POST_CONTENT_MIN_LENGTH} and ${POST_CONTENT_MAX_LENGTH} characters long.`
      );
    }

    await addPost(post.title, post.content, userData.handle);

    setPost({
      title: "",
      content: "",
    });

    navigate("/posts");
  };

  return (
    <div className="outer-create-post-container">
      <div className="inner-create-post-container">
        <div className="create-post-header">
          <h1>Create post</h1>
        </div>

        <div className="post-title">
          <label htmlFor="input-title">Title:</label>

          <div className="input-field">
            <input
              className="title-input-style"
              type="text"
              value={post.title}
              onChange={(e) => updatePost(e.target.value, "title")}
              name="input-title"
              id="input-title"
            />
          </div>
        </div>

        <div className="post-content">
          <label htmlFor="input-content">Content:</label>
        </div>

        <div className="comment-field">
          <textarea
            className="comment-field-style"
            value={post.content}
            onChange={(e) => updatePost(e.target.value, "content")}
            name="input-content"
            id="input-content"
            cols="30"
            rows="10"
          ></textarea>
        </div>

        <div className="create-button">
          <Button className="create-button-style" onClick={createPost}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
