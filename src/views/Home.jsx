import { useState, useEffect } from "react";
import {
  getTopPosts,
  getRecentPosts,
  getNumberOfPosts,
  getNumberOfUsers,
} from "../services/posts.service.js";
import TopPosts from "./TopPosts.jsx";
import RecentPosts from "./MostRecentPosts.jsx";
export default function Home() {
  const [topPosts, setTopPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(0);

  useEffect(() => {
    // Fetch top posts
    getTopPosts().then((posts) => setTopPosts(posts));

    // Fetch recent posts
    getRecentPosts().then((posts) => setRecentPosts(posts));

    // Fetch number of users
    getNumberOfUsers().then((count) => setNumberOfUsers(count));

    // Fetch number of posts
    getNumberOfPosts().then((count) => setNumberOfPosts(count));
  }, []);

  // {sortPostsByAuthor()}
  // {sortPostsByDate()}
  // {filterPostsByComments()}
  // {filterPostsByLikes()}
  return (
    <div>
      <div
        style={{
          color: "rgb(0,0,0)",
          textShadow: "-1px 1px 2px white",
          fontWeight: "500",
        }}
      >
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
            fontSize: "64px",
            color: "white",
            textShadow: "-4px -2px 2px #063a1d",
          }}
        >
          Welcome to the ReactVenture Forum
        </h1>
        {/* Core features */}
        <div style={{ marginTop: "4.5rem" }}>
          <br></br>
          <br></br>
          <div>
            <h3 style={{ fontSize: "32px" }}>
              Here you can enjoy the following perks:
            </h3>
            <ul>
              <li>
                Share your thoughts with the world by creating any posts you
                want.
              </li>
              <li>Like and comment on those posts</li>
              <li>View the most commented and recent posts</li>
              <li>And many more...</li>
            </ul>
          </div>
        </div>

        {/* Statistics */}
        <div
          style={{
            marginTop: "-10rem",
            marginLeft: "40rem",
          }}
        >
          <h2>App Statistics</h2>
          <p>Total Users: {numberOfUsers}</p>
          <p>Total Posts: {numberOfPosts}</p>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>

      <div>
        <RecentPosts />
      </div>
      <div>
        <TopPosts />
      </div>
    </div>
  );
}
