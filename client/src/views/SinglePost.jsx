import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/posts.service";
import Post from "../components/Post/Post";
import Comment from "../components/Comments/Comment";
import { addComment, getAllComments } from "../services/comment.service";
import { db } from "../config/firebase-config"; 
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database"; 
import { AppContext } from "../context/AppContext";

export default function SinglePost() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]); 
    const [newCommentContent, setNewCommentContent] = useState('');
    const { id } = useParams();
    const { userData } = useContext(AppContext);

    useEffect(() => {
        async function fetchPost() {
            const fetchedPost = await getPostById(id);
            setPost(fetchedPost);
        }
        fetchPost();
    }, [id]);

    useEffect(() => {
        const postCommentsRef = ref(db, `posts/${id}/comments`);
        const postCommentsQuery = query(postCommentsRef);
    
        return onValue(postCommentsQuery, (snapshot) => {
            const commentsData = snapshot.val();
            if (commentsData) {
                const commentsArray = Object.keys(commentsData).map(key => ({
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
    

    const handleAddComment = async () => {
        if (!userData) {
            return;
        }
        await addComment(id, userData.handle, newCommentContent);
        setNewCommentContent('');
    };

    return (
        <div>
            <h1>Single Post</h1>
            {post && <Post post={post} />}
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
                {comments.map(comment => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}
