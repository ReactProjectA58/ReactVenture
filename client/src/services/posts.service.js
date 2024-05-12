import {
  ref,
  push,
  get,
  set,
  update,
  query,
  equalTo,
  orderByChild,
  orderByKey,
  limitToLast
} from "firebase/database";
import { db } from "../config/firebase-config";

export const addPost = async (title, content, author) => {
  const post = {
    title,
    content,
    author,
    createdOn: Date.now(),
    isDeleted: false,
  };

  const result = await push(ref(db, "posts"), post);
  console.log(result.key);
};

export const getAllPosts = async (search) => {
  const snapshot = await get(ref(db, "posts"));
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val())
    .map(([key, value]) => {
      return {
        ...value,
        id: key,
        likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
        createdOn: new Date(value.createdOn).toString(),
      };
    })
    .filter(
      (post) =>
        post.content &&
        post.content.toLowerCase().includes(search.toLowerCase()) &&
        !post.isDeleted
    );
};

export const getPostById = async (id) => {
  const snapshot = await get(ref(db, `posts/${id}`));

  if (!snapshot.val()) throw new Error("Post with this id does not exist!");

  return {
    ...snapshot.val(),
    id,
    likedBy: snapshot.val().likedBy ? Object.keys(snapshot.val().likedBy) : [],
    createdOn: new Date(snapshot.val().createdOn).toString(),
  };
};

export const getTopPosts = async () => {
  const postsRef = ref(db, 'posts');
  const snapshot = await get(postsRef);

  const postsWithComments = [];

  snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();
      const postId = childSnapshot.key;

      // Check if the post has comments
      if (post.comments) {
          const commentsCount = Object.keys(post.comments).length;
          postsWithComments.push({ id: postId, commentsCount, ...post });
      }
  });

  postsWithComments.sort((a, b) => b.commentsCount - a.commentsCount);

  if (postsWithComments.length <= 10) {
      return postsWithComments;
  } else {
      const topPosts = postsWithComments.slice(0, 10);    
      return topPosts;
  }
};


export const getRecentPosts = async () => {
  const postsRef = ref(db, 'posts');
  const postsQuery = query(postsRef, orderByChild('createdOn'), limitToLast(10));

  get(postsQuery)
  .then((snapshot) => {
      const numPosts = snapshot.size;
      if (numPosts < 10) {
          const newQuery = query(postsRef, orderByChild('createdOn'));

          return get(newQuery);
      } else {
          return snapshot;
      }
  }).catch((error) => {
      console.error("Error getting posts:", error);
  });    const snapshot = await get(postsQuery);
  
  let recentPosts = [];
  snapshot.forEach((childSnapshot) => {
      recentPosts.push({ id: childSnapshot.key, ...childSnapshot.val() });
  });

  recentPosts.reverse();
  return recentPosts;
};

export const getNumberOfUsers = async () => {
  try {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);

  if (usersSnapshot.exists()) {
  const usersCount = Object.keys(usersSnapshot.val()).length; // Get the number of users by counting keys

  return usersCount;

  } else {
      return 0; // If no users found, return 0
  }
  } catch (error) {
  console.error('Error fetching number of users:', error);

  return 0;
  }
};

export const getNumberOfPosts = async () => {
  try {
  const postsRef = ref(db, 'posts');
  const postsSnapshot = await get(postsRef);

  if (postsSnapshot.exists()) {
  const postsCount = Object.keys(postsSnapshot.val()).length; // Get the number of posts by counting key

  return postsCount;
  } else {
      return 0; // If no posts found, return 0
  }
  } catch (error) {

  console.error('Error fetching number of posts:', error);
  return 0;
  }
};

export const likePost = async (postId, handle) => {
  const updateVal = {};
  updateVal[`users/${handle}/likedPosts/${postId}`] = true;
  updateVal[`posts/${postId}/likedBy/${handle}`] = true;

  update(ref(db), updateVal);
};

export const dislikePost = async (postId, handle) => {
  const updateVal = {};
  updateVal[`users/${handle}/likedPosts/${postId}`] = null;
  updateVal[`posts/${postId}/likedBy/${handle}`] = null;

  update(ref(db), updateVal);
};

export const removePost = async (postId) => {
  await update(ref(db), { [`posts/${postId}/isDeleted`]: true });
};

export const restorePost = async (postId) => {
  const updateVal = {};
  updateVal[`posts/${postId}/isDeleted`] = null;

  await update(ref(db), updateVal);
};

export const getDeletedPosts = async () => {
  try {
    const postsRef = ref(db, "posts");
    const deletedPostsQuery = query(
      postsRef,
      orderByChild("isDeleted"),
      equalTo(true)
    );
    const snapshot = await get(deletedPostsQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const deletedPosts = [];
    snapshot.forEach((childSnapshot) => {
      deletedPosts.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    return deletedPosts;
  } catch (error) {
    console.error("Error fetching deleted posts:", error);
    return [];
  }
};

export const editPost = async (postId, updatedTitle, updatedContent) => {
  try {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, { title: updatedTitle, content: updatedContent });
    console.log("Post updated successfully!");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};
