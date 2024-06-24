<div style="display: flex; justify-content:center; margin-bottom:20px"><img src="https://firebasestorage.googleapis.com/v0/b/reactventure-9cf76.appspot.com/o/logo.jpg?alt=media&token=a0643e4d-02c7-4231-8895-3f95e2eb2df0" width="200"></div>

# ReactVenture

Welcome to ReactVenture, where travelers come together to share their adventures, tips, and experiences!

**Languages:** <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" height="20"> <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" height="20">

**Frameworks/Libraries:** <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" height="20"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" height="20">

**Database:** <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white" height="20">

## Why ReactVenture?

- Connect with fellow travelers and share your travel stories and tips.
- Clean and intuitive user interface for seamless browsing.
- Easy register and login process.
- Flexible profile and content management.
- Structured role system for community engagement.

## Features

- **Home Page:**

  - Display of most recent and popular posts.

- **Register:**

  - Create your profile with username, email, and password.

- **Login:**

  - Access your account quickly through the login page.

- **All posts:**

  - Browse posts or search by keywords.
  - Sort posts by Author, by Date.
  - Create posts with titles and content.
  - Edit posts and comments.

- **Individual Post View:**

  - View full post content and comments.
  - Interact with posts and comments through likes and comments.

- **Profile:**

  - View user activity and liked posts/comments.

- **Admin:**

  - Moderate content by deleting posts/comments.
  - Block users if necessary.

- **Enjoy the adventure!** ;)

## Getting Started

### Setup and run locally:

1. Clone the ReactVenture repository.
2. Install project dependencies with `npm install`.
3. Run the project with `npm run dev`.
4. Open localhost link in your browser.
5. Start your own ReactVenture journey!

## Database Structure

### Posts document:

Each document in the "posts" collection represents a single post created by a user on the platform.
Fields:

    postId (Auto-generated Unique Identifier)
        A unique identifier for each post document.

    author (String)
        The username of the user who authored the post.

    title (String)
        The title of the post.

    content (String)
        The content of the post.

    createdOn (Timestamp)
        The timestamp indicating when the post was created.

    likedBy (Map)
        A map containing usernames of users who liked the post as keys and boolean values indicating whether they liked the post.

### Comments document:

Each document in the "comments" collection represents a single comment posted by a user on the platform.
Fields:

    commentId (Auto-generated Unique Identifier)
        A unique identifier for each comment document.

    postId (String)
        The ID of the post to which the comment belongs.

    author (String)
        The username of the user who authored the comment.

    content (String)
        The content of the comment.

    createdOn (Timestamp)
        The timestamp indicating when the comment was created.

    likedBy (Array of Strings)
        An array containing the usernames of users who liked the comment.

### Users document:

Each document in the "users" collection represents a single user registered on the platform.
Fields:

    userId (Auto-generated Unique Identifier)
        A unique identifier for each user document.

    username (String)
        The username chosen by the user.

    email (String)
        The email address of the user.

    firstName (String)
        The first name of the user.

    lastName (String)
        The last name of the user.

    handle (String)
        A handle or alias chosen by the user.

    isAdmin (Boolean)
        Indicates whether the user has administrative privileges.

    isBlocked (Boolean)
        Indicates whether the user is currently blocked from the platform.

    likedComments (Map)
        A map containing IDs of comments liked by the user as keys and boolean values indicating whether the comment is liked.

    likedPosts (Map)
        A map containing IDs of posts liked by the user as keys and boolean values indicating whether the post is liked.

## Frequently Asked Questions

- **How can I create a profile on ReactVenture?**
  - Simply click `Register`, enter your details, and start sharing your travel experiences!
- **How can I browse discussions on the forum?**
  - Navigate to the `All Post` tab, filter posts, search, and enjoy reading and engaging with fellow travelers.
- **What actions can I take within the forum?**
  - You can edit your posts and comments, like and save others' posts/comments, and explore users' profiles.
- **How can I become an admin?**
  - Apply for admin role from your profile page, and upon approval, you can help moderate the community.

## Community and Contributions

ReactVenture is developed by **TEAM 3**.

We value open communication with our community to enhance the platform continuously. Your feedback is invaluable in shaping ReactVenture's future.

## External Resources

ReactVenture leverages Firebase in accordance with their _Terms and Conditions_ for fair usage of their services.
