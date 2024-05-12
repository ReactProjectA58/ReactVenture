import {
  get,
  set,
  ref,
  query,
  equalTo,
  orderByChild,
  update,
} from "firebase/database";
import { db } from "../config/firebase-config";

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (firstName, lastName, handle, uid, email) => {
  return set(ref(db, `users/${handle}`), {
    firstName: firstName,
    lastName: lastName,
    handle: handle,
    uid: uid,
    email: email,
    isAdmin: false,
    createdOn: new Date(),
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, "users"), orderByChild("uid"), equalTo(uid)));
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

export const editNames = async (handle, newFirstName, newLastName) => {
  try {
    const userRef = ref(db, `users/${handle}`);
    await update(userRef, { firstName: newFirstName, lastName: newLastName });
    console.log("Names updated successfully!");
  } catch (error) {
    console.error("Error updating names:", error);
    throw error;
  }
};

// export const updateUserAdminStatus = (handle, isAdmin) => {
//   return update(ref(db, `users/${handle}`), { isAdmin: isAdmin });
// };

// updateUserAdminStatus("admin2024", true);
