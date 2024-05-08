import { ref, push, get, set, update, query, equalTo, orderByChild, orderByKey } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addComment = async(postId, author, content) => {
    const comment = {
        postId,
        author,
        content,
        createdOn: Date.now(),
    };

    const result = await push(ref(db, 'comments'), comment);
    console.log(result.key);
};

export const getAllComments = async (postId) => {
    const snapshot = await get(ref(db, 'comments'));
    if (!snapshot.exists()) return [];

    const comments = Object.entries(snapshot.val()).map(([key, value]) => ({
        ...value,
        id: key,
        likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
        createdOn: new Date(value.createdOn).toString(),
    }));

    return comments.filter(comment => comment.postId === postId);
};

export const getCommentById = async(id) => {
    const snapshot = await get(ref(db, `comments/${id}`));

    if (!snapshot.val()) throw new Error('Comment with this id does not exist!');

    return {
        ...snapshot.val(),
        id,
        likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
        createdOn: new Date(snapshot.val().createdOn).toString(),
    }
};

export const likeComment = async(commentId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedComments/${commentId}`] = true;
    updateVal[`comments/${commentId}/likedBy/${handle}`] = true;

    update(ref(db), updateVal);
};

export const dislikeComment = async(commentId, handle) => {
    const updateVal = {};
    updateVal[`users/${handle}/likedComments/${commentId}`] = null;
    updateVal[`comments/${commentId}/likedBy/${handle}`] = null;

    update(ref(db), updateVal);
};