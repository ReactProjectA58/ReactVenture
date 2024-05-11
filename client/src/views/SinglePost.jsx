import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getPostById, restorePost, removePost, editPost } from "../services/posts.service";
import Post from "../components/Post/Post";
import Comment from "../components/Comments/Comment";
import { addComment, getAllComments, editComment } from "../services/comment.service";
import { db } from "../config/firebase-config";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { AppContext } from "../context/AppContext";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedCommentId, setEditedCommentId] = useState("");
  const [editedCommentContent, setEditedCommentContent] = useState("");
  
  const { id } = useParams();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    return onValue(ref(db, `posts/${id}`), (snapshot) => {
      const postData = snapshot.val();
      if (postData) {
        const likedByArray = postData.likedBy ? Object.keys(postData.likedBy) : [];
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
    const commentsRef = ref(db, 'comments');
    const commentsQuery = query(commentsRef, orderByChild('postId'), equalTo(id));

    return onValue(commentsQuery, (snapshot) => {
      const commentsData = snapshot.val();
      if (commentsData) {
        const commentsArray = Object.keys(commentsData).map((key) => ({
          id: key,
          ...commentsData[key],
          likedBy: commentsData[key].likedBy ? Object.keys(commentsData[key].likedBy) : [],
          createdOn: commentsData[key].createdOn ? new Date(commentsData[key].createdOn).toString() : "",
        }));
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    });
  }, [id]);

  const isAdmin = userData && userData.role === "admin";

  const isPostOwner = userData && post && userData.handle === post.author;
  
  const isCommentOwner = (comment) => userData && comment && userData.handle === comment.author;

  const handleAddComment = async () => {
    if (!userData) {
      return;
    }
    await addComment(id, userData.handle, newCommentContent);
    const newComments = await getAllComments(id);
    setComments(newComments);
    setNewCommentContent("");
  };

  const handlePostEdit = () => {
    setIsEditingPost(true);
    setEditedPostContent(post.content);
  };

  const handlePostUpdate = async () => {
    try {
      await editPost(post.id, editedPostContent);
      setPost({ ...post, content: editedPostContent });
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleCommentEdit = (commentId, commentContent) => {
    setIsEditingComment(true);
    setEditedCommentId(commentId);
    setEditedCommentContent(commentContent);
  };

  const handleCommentUpdate = async () => {
    try {
      await editComment(editedCommentId, editedCommentContent);
      const updatedComments = comments.map((comment) =>
        comment.id === editedCommentId ? { ...comment, content: editedCommentContent } : comment
      );
      setComments(updatedComments);
      setIsEditingComment(false);
      setEditedCommentId("");
      setEditedCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div>
      <h1>Single Post</h1>
      {post && (
        <>
          {isEditingPost ? (
            <div>
              <textarea value={editedPostContent} onChange={(e) => setEditedPostContent(e.target.value)} />
              <button onClick={handlePostUpdate}>Save</button>
            </div>
          ) : (
            <div>
              <Post
                post={post}
                showViewButton={false}
                onRemove={() => removePost(post.id) && window.open(`/posts`, "_self")}
                onRestore={() => restorePost(post.id) && window.open(`/posts`, "_self")}
              />
              <p>Likes: {post.likedBy.length}</p>
              {isAdmin || isPostOwner ? <button onClick={handlePostEdit}>Edit Post</button> : null}
            </div>
          )}
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
            {isEditingComment && editedCommentId === comment.id ? (
              <div>
                <textarea value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)} />
                <button onClick={handleCommentUpdate}>Save</button>
              </div>
            ) : (
              <div>
                <Comment comment={comment} />
                {isAdmin || isCommentOwner(comment) ? <button onClick={() => handleCommentEdit(comment.id, comment.content)}>Edit Comment</button> : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
