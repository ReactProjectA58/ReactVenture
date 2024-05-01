import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPostById } from "../services/posts.service";
import Post from "../components/Post/Post";
import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey, onValue } from 'firebase/database';
import { db } from "../config/firebase-config";

export default function SinglePost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        return onValue(ref(db, `posts/${id}`), snapshot => {
            setPost({
                ...snapshot.val(),
                id,
                likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
                createdOn: new Date(snapshot.val().createdOn).toString(),
            });
        });
    }, [id]);

    return (
        <div>
            <h1>Single Post</h1>
            {post && <Post post={post} />}
        </div>
    )
}