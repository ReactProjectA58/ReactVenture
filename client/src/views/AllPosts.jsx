import { useContext } from "react";
import { useEffect, useState } from "react";
import {
  getAllPosts,
  removePost,
  restorePost,
} from "../services/posts.service";
import Post from "../components/Post/Post";
import { useSearchParams } from "react-router-dom";
import { ref, onChildChanged } from "firebase/database";
import { db } from "../config/firebase-config";
import { AppContext } from "../context/AppContext";


export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const { userData } = useContext(AppContext);

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    getAllPosts(search).then(setPosts);
  }, [search]);

  useEffect(() => {
    return onChildChanged(ref(db, "posts"), (snapshot) => {
      const value = snapshot.val();
      setPosts((posts) =>
        posts.map((t) => {
          if (
            t.title === value.title &&
            t.author === value.author &&
            t.content === value.content
          ) {
            if (value.likedBy) {
              t.likedBy = Object.keys(value.likedBy);
            } else {
              t.likedBy = [];
            }
            return t;
          } else {
            return t;
          }
        })
      );
    });
  }, []);

  const handleRemovePost = async (postId) => {
    await removePost(postId);
    const removedPost = posts.find((post) => post.id === postId);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleRestorePost = async (postId) => {
    await restorePost(postId);
    const restoredPost = deletedPosts.find((post) => post.id === postId);
    setDeletedPosts(deletedPosts.filter((post) => post.id !== postId));
  };

  const totalLikesCount = posts.reduce(
    (total, post) => total + (post.likedBy ? post.likedBy.length : 0),
    0
  );

  return (
    <div>

      <h1>All posts</h1>
      <label htmlFor="search">Search</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        name="search"
        id="search"
      />
      {posts.map((post) => (
        <div key={post.id}>
          <Post
            post={post}
            onRemove={() =>
              (userData.isAdmin || userData.handle === post.author) &&
              handleRemovePost(post.id)
            }
            showViewButton={true}
            likesCount={post.likedBy ? post.likedBy.length : 0}
          />
        </div>
      ))}
    </div>
  );
}
