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

    if (newCommentContent.length < COMMENT_MIN_LENGTH || newCommentContent.length > COMMENT_MAX_LENGTH) {
      alert(`Comment length must be between ${COMMENT_MIN_LENGTH} and ${COMMENT_MAX_LENGTH} characters.`);
      return;
    }

    await addComment(id, userData.handle, newCommentContent);
    const newComments = await getAllComments(id);
    setComments(newComments);
    setNewCommentContent("");
  };

  return (
    <div>
      <h1>Single Post</h1>
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
      <div>
        <h2>Comments</h2>
        {/* Input field for adding new comment */}
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post Comment</button>
        {/* Display comments */}
        {comments.map((comment) => (
          <div key={comment.id}>
            <Comment comment={comment} />
            {(isAdmin || isCommentOwner(comment)) && (
              <EditComment comment={comment} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
