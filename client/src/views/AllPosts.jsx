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
import { Link } from "react-router-dom";
import "./AllPosts.css"; // Import CSS file for styling

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const { userData } = useContext(AppContext);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
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
      <div className="search-filter-container">
        <div className="search-container">
          <label htmlFor="search">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            id="search"
          />
      </div>
        <div className="dropdowns-container">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              Filter
            </button>
            <ul
              className={`dropdown-menu${showFilterDropdown ? " show" : ""}`}
              style={{}}
            >
              <li>
                <Link className="dropdown-item" to="/filtered-by-comments">
                  by Comments
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/filtered-by-likes">
                  by Likes
                </Link>
              </li>
            </ul>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              Sort
            </button>
            <ul
              className={`dropdown-menu${showSortDropdown ? " show" : ""}`}
              style={{}}
            >
              <li>
                <Link className="dropdown-item" to="/sorted-by-author">
                  by Author
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/sorted-by-date">
                  by Date
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Render posts */}
      {posts.reverse().map((post) => (
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
