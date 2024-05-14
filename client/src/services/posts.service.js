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

export const getAllPosts = async (author = null, search = '') => {
  const snapshot = await get(ref(db, "posts"));
  if (!snapshot.exists()) return [];

  let posts = Object.entries(snapshot.val())
    .map(([key, value]) => {
      return {
        ...value,
        id: key,
        likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
        createdOn: new Date(value.createdOn).toString(),
      };
    })
    .filter((post) => !post.isDeleted);

  if (author) {
    posts = posts.filter((post) => post.author === author);
  }

  if (search) {
    posts = posts.filter((post) =>
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  return posts;
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
  return posts;
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
  const postsSnapshot = await get(ref(db, 'posts'));
  if (!postsSnapshot.exists()) return [];

  const commentsSnapshot = await get(ref(db, 'comments'));
  const commentsData = commentsSnapshot.val();

  const postsWithComments = Object.entries(postsSnapshot.val()).map(([key, value]) => {
    const postId = key;
    const commentsCount = commentsData ? Object.values(commentsData).filter(comment => comment.postId === postId).length : 0;
    return { id: postId, commentsCount, ...value };
  });

  postsWithComments.sort((a, b) => b.commentsCount - a.commentsCount);

  const mappedPosts = postsWithComments.map(post => ({
    ...post,
    likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    createdOn: new Date(post.createdOn).toString(),
  }));

  return mappedPosts.slice(0, 10);
};




export const getRecentPosts = async () => {
  const snapshot = await get(ref(db, "posts"));
  if (!snapshot.exists()) return [];

  const posts = Object.entries(snapshot.val())
    .map(([key, value]) => {
      return {
        ...value,
        id: key,
        likedBy: value.likedBy ? Object.keys(value.likedBy) : [],
        createdOn: new Date(value.createdOn).toString(),
      };
    })

    .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
    .slice(0, 10);

  return posts;
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



export const getPostsByAuthor = (handle) => {
  return get(query(ref(db, 'posts'), orderByChild('author'), equalTo(handle)));
}

export const getDeletedPostsByAuthor = async (handle) => {
  try {
    const deletedPostsRef = query(
      ref(db, 'posts'),
      orderByChild('author'),
      equalTo(handle)
    );

    const snapshot = await get(deletedPostsRef);
    const deletedPosts = [];

    snapshot.forEach((childSnapshot) => {
      const post = childSnapshot.val();
      if (post.isDeleted) {
        deletedPosts.push({
          id: childSnapshot.key,
          ...post
        });
      }
    });

    return deletedPosts;
  } catch (error) {
    console.error("Error fetching deleted posts:", error);
    throw error;
  }
};