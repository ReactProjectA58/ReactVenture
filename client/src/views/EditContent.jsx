import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { editPost } from '../services/post.services';
import { editComment } from '../services/comment.services';

const EditContent = ({ type, id, currentContent, onCancel, onUpdate }) => {
  const [updatedContent, setUpdatedContent] = useState(currentContent);

  const handleContentChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (type === 'post') {
        await editPost(id, updatedContent);
      } else if (type === 'comment') {
        await editComment(id, updatedContent);
      }
      onUpdate();
    } catch (error) {
      console.error('Error editing content:', error);
    }
  };

  return (
    <div>
      <textarea value={updatedContent} onChange={handleContentChange} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

// Prop validation
EditContent.propTypes = {
  type: PropTypes.oneOf(['post', 'comment']).isRequired,
  id: PropTypes.string.isRequired,
  currentContent: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditContent;
