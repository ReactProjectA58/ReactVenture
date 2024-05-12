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

export const sortPostsByAuthor = async () => {
  const postsSnapshot = await get(ref(db, "posts"));
  const posts = Object.entries(postsSnapshot.val())
    .map(([key, value]) => ({
      ...value,
      id: key,
    }));

  // Check if posts is an array
  if (!Array.isArray(posts)) {
    console.error("Posts data is not in the expected format.");
    return [];
  }

  // Sort posts by author
  posts.sort((a, b) => a.author.localeCompare(b.author));
  
  // console.log(posts.reverse())
  return posts.reverse();
};


export const sortPostsByDate = async () => {
  const postsSnapshot = await get(ref(db, "posts"));
  
  const posts = Object.entries(postsSnapshot.val())
    .map(([key, value]) => ({
      ...value,
      id: key,
    }));

  posts.sort((a, b) => b.createdOn - a.createdOn);

  // console.log(posts.reverse())
  return posts.reverse();
};


export const filterPostsByLikes = async () => {
  const postsSnapshot = await get(ref(db, "posts"));
  const posts = Object.entries(postsSnapshot.val())
    .map(([key, value]) => ({
      ...value,
      id: key,
    }));

  // Check if posts is an array
  if (!Array.isArray(posts)) {
    console.error("Posts data is not in the expected format.");
    return [];
  }

  // Filter posts with likes
  const likedPosts = posts.filter(post => post.likedBy && Object.keys(post.likedBy).length > 0);

  // console.log(likedPosts.reverse());
  return likedPosts.reverse();
};


export const filterPostsByComments = async () => {

  const postsSnapshot = await get(ref(db, "posts"));
  const posts = Object.entries(postsSnapshot.val())
    .map(([key, value]) => ({
      ...value,
      id: key,
    }));

  const commentsSnapshot = await get(ref(db, "comments"));
  const comments = Object.entries(commentsSnapshot.val())
    .map(([key, value]) => ({
      ...value,
      id: key,
    }));

  // Find posts with associated comments
  const postsWithComments = posts.filter(post =>
    comments.some(comment => comment.postId === post.id)
  );
  // console.log(postsWithComments.reverse());
  return postsWithComments.reverse();
};

export const getTopPosts = async () => {
  const postsRef = ref(db, 'posts');
  const snapshot = await get(postsRef);

  const postsWithComments = [];

  // Iterate through all the comments to determine the number of comments for each post
  const commentsSnapshot = await get(ref(db, 'comments'));
  const commentsData = commentsSnapshot.val();

  snapshot.forEach((childSnapshot) => {
    const postId = childSnapshot.key;
    const post = childSnapshot.val();

    // Check if the post has comments
    const commentsCount = commentsData ? Object.values(commentsData).filter(comment => comment.postId === postId).length : 0;

    postsWithComments.push({ id: postId, commentsCount, ...post });
  });

  // Sort the posts by the number of comments in descending order
  postsWithComments.sort((a, b) => b.commentsCount - a.commentsCount);

  // Return the top 10 posts with the most comments
  return postsWithComments.slice(0, 10);
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

export const editPost = async (postId, updatedContent) => {
  try {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, { content: updatedContent });
    console.log("Post updated successfully!");
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};