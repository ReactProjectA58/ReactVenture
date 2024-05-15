import { useContext, useEffect, useState } from "react";
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
import "./AllPosts.css";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const { userData } = useContext(AppContext);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterDeleted, setFilterDeleted] = useState(false);

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  useEffect(() => {
    console.log("Fetching posts with search term:", search); // Debugging line
    getAllPosts(null, search).then(setPosts);
  }, [search]);

  useEffect(() => {
    return onChildChanged(ref(db, "posts"), (snapshot) => {
      const value = snapshot.val();
      setPosts((posts) =>
        posts.map((t) =>
          t.title === value.title &&
          t.author === value.author &&
          t.content === value.content
            ? { ...t, likedBy: value.likedBy ? Object.keys(value.likedBy) : [] }
            : t
        )
      );
    });
  }, []);

  const handleRemovePost = async (postId) => {
    await removePost(postId);
    setPosts((posts) => posts.filter((post) => post.id !== postId));
  };

  const handleRestorePost = async (postId) => {
    await restorePost(postId);
    const restoredPost = deletedPosts.find((post) => post.id === postId);
    if (restoredPost) {
      setDeletedPosts((deletedPosts) =>
        deletedPosts.filter((post) => post.id !== postId)
      );
      setPosts((posts) => [...posts, restoredPost]);
    }
  };

  const totalLikesCount = posts.reduce(
    (total, post) => total + (post.likedBy ? post.likedBy.length : 0),
    0
  );

  return (
    <div>
      <div className="search-filter-container">
        <div className="search-container">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            name="search"
            id="search"
            style={{
              borderStyle: "inset",
              borderWidth: "2px",
              borderColor: "green",
              backgroundColor: "white",
              color: "black",
              boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, 0.5)",
              marginLeft: "15px",
            }}
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
            <ul className={`dropdown-menu${showFilterDropdown ? " show" : ""}`}>
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
              {userData && userData.isAdmin && (
                <li>
                  <Link className="dropdown-item" to="/deleted">
                    by Deleted Posts
                  </Link>
                </li>
              )}
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
            <ul className={`dropdown-menu${showSortDropdown ? " show" : ""}`}>
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
      {posts
        .slice()
        .reverse()
        .map((post) => (
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
