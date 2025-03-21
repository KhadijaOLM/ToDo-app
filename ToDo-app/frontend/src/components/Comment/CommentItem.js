import React from 'react';
import './CommentItem.css';

const CommentItem = ({ comment }) => {
  return (
    <div className="comment-item">
      <p><strong>{comment.userId.username}</strong>: {comment.text}</p>
    </div>
  );
};

export default CommentItem;