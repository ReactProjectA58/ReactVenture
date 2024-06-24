import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  getPostById,
  restorePost,
  removePost,
  editPost,
} from "../services/posts.service";
import Post from "../components/Post/Post";
import Comment from "../components/Comments/Comment";
import { addComment, getAllComments } from "../services/comment.service";
import { db } from "../config/firebase-config";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { AppContext } from "../context/AppContext";
import { EditPost, EditComment } from "./EditContent";
import { COMMENT_MIN_LENGTH, COMMENT_MAX_LENGTH } from "../common/constants";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentErrorMessage, setCommentErrorMessage] = useState("");
  const { userData } = useContext(AppContext);
  const { id } = useParams();

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), (snapshot) => {
      const postData = snapshot.val();
      if (postData) {
        const likedByArray = postData.likedBy
          ? Object.keys(postData.likedBy)
          : [];
        setPost({
          ...postData,
          id,
          likedBy: likedByArray,
          createdOn: new Date(postData.createdOn).toString(),
          comments: postData.comments || [],
        });
      } else {
        setPost(null);
      }
    });
  }, [id]);

  useEffect(() => {
    const commentsRef = ref(db, "comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("postId"),
      equalTo(id)
    );

    return onValue(commentsQuery, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsArray = Object.keys(commentsData).map((key) => ({
          id: key,
          ...commentsData[key],
          likedBy: commentsData[key].likedBy
            ? Object.keys(commentsData[key].likedBy)
            : [],
          createdOn: commentsData[key].createdOn
            ? new Date(commentsData[key].createdOn).toString()
            : "",
        }));
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    });
  }, [id]);

  const isAdmin = userData && userData.isAdmin === true;
  const isPostOwner = userData && post && userData.handle === post.author;
  const isCommentOwner = (comment) =>
    userData && comment && userData.handle === comment.author;

  const handleAddComment = async () => {
    if (!userData) {
      return;
    }

    if (
      newCommentContent.length < COMMENT_MIN_LENGTH ||
      newCommentContent.length > COMMENT_MAX_LENGTH
    ) {
      setCommentErrorMessage(
        `Comment length must be between ${COMMENT_MIN_LENGTH} and ${COMMENT_MAX_LENGTH} characters.`
      );
      return;
    }

    await addComment(id, userData.handle, newCommentContent);
    const newComments = await getAllComments(id);
    setComments(newComments);
    setNewCommentContent("");
    setCommentErrorMessage("");
  };

  return (
    <div className="container">
      {post && (
        <>
          <Post
            post={post}
            showViewButton={false}
            onRemove={() =>
              removePost(post.id) && window.open(`/posts`, "_self")
            }
            onRestore={() =>
              restorePost(post.id) && window.open(`/posts`, "_self")
            }
          />
          {(isAdmin || isPostOwner) && <EditPost post={post} />}
        </>
      )}
      <div className="mt-4" style={{ marginLeft: "1.2rem" }}>
        <h2 style={{ fontWeight: "600", color: "rgb(81, 126, 51)" }}>
          Comments
        </h2>
        <textarea
          className="form-control mb-2"
          value={newCommentContent}
          onChange={(e) => {
            setNewCommentContent(e.target.value);
            setCommentErrorMessage("");
          }}
          placeholder="Add a comment..."
        />
        <button
          className="btn btn-primary mb-2"
          onClick={handleAddComment}
          style={{ fontWeight: "600", color: "white" }}
        >
          Post Comment
        </button>
        {commentErrorMessage && (
          <p className="text-danger">{commentErrorMessage}</p>
        )}
        {/* Display comments */}
        <ol>
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <li style={{ marginBottom: "-0.4rem" }}>
                <Comment comment={comment} />
                {(isAdmin || isCommentOwner(comment)) && (
                  <EditComment comment={comment} />
                )}
              </li>
            </div>
          ))}
        </ol>
      </div>
    </div>
  );
}
