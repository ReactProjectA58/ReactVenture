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

// export const updateUserAdminStatus = (handle, isAdmin) => {
//   return update(ref(db, `users/${handle}`), { isAdmin: isAdmin });
// };

// updateUserAdminStatus("admin2024", true);
