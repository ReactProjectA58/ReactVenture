import { useState, useEffect } from "react";
import { getTopPosts, getRecentPosts, getNumberOfPosts, getNumberOfUsers } from "../services/posts.service.js";
import TopPosts from "./TopPosts.jsx";
import RecentPosts from "./MostRecentPosts.jsx";
export default function Home() {

const [topPosts, setTopPosts] = useState([]);
const [recentPosts, setRecentPosts] = useState([]);


const [numberOfUsers, setNumberOfUsers] = useState(0);
const [numberOfPosts, setNumberOfPosts] = useState(0);


useEffect(() => {
    // Fetch top posts
    getTopPosts().then(posts => setTopPosts(posts));

    // Fetch recent posts
    getRecentPosts().then(posts => setRecentPosts(posts));

    // Fetch number of users
    getNumberOfUsers().then(count => setNumberOfUsers(count));

    // Fetch number of posts
    getNumberOfPosts().then(count => setNumberOfPosts(count));
}, []);

// {sortPostsByAuthor()}
// {sortPostsByDate()}
// {filterPostsByComments()}
// {filterPostsByLikes()}
 return (
   <div>
     <h1>Welcome to the ReactVenture Forum</h1>
     {/* Core features */}
     <div>
       <br></br>
       <br></br>
        <h3>Here you can enjoy the following perks:</h3>
            <ul>
                <li>Share your thoughts with the world by creating any posts you want.</li>
                <li>Like and comment on those posts</li>
                <li>View the most commented and recent posts</li>
                <li>And many more...</li>
            </ul>
         </div>

     {/* Statistics */}
     <div>
       <h2>App Statistics</h2>
       <p>Total Users: {numberOfUsers}</p>
       <p>Total Posts: {numberOfPosts}</p>
       <br></br>
       <br></br>
       <br></br>
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


