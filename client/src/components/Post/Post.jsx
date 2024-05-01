import PropTypes from 'prop-types';
import './Post.css';
import { Link } from 'react-router-dom';
import { likePost, dislikePost } from '../../services/posts.service';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

/**
 * 
 * @param {{post: { id: number, author: string, content: string, createdOn: string, likedBy: string[]}}} props 
 */
export default function Post({ post }) {
    const { userData } = useContext(AppContext);
    const like = () => likePost(post.id, userData.handle);
    const dislike = () => dislikePost(post.id, userData.handle);

    return (
        <div className="post">
            <p>{post.content}</p>
            <p>by {post.author}, {new Date(post.createdOn).toLocaleDateString('bg-BG')}</p>
            <Link to={`/posts/${post.id}`}>View</Link>
            {post?.likedBy.includes(userData?.handle)
            ? <button onClick={dislike}>Dislike</button>
            : <button onClick={like}>Like</button>
            }
            
            
        </div>
    )
}

Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string,
        author: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        createdOn: PropTypes.string,
        likedBy: PropTypes.array,
    })
}