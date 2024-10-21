import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./Comment.style.css";
import { db } from "../../firebase/firebase.config";

interface CommentModalProps {
  postId: string;
  comments: any[];
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleAddComment = async () => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion({
        username: "currentUsername", // Get username from Auth
        text: newComment,
      }),
    });
    setNewComment("");
  };

  return (
    <div className='comment-modal'>
      <div className='comments-section'>
        {comments.map((comment, index) => (
          <div key={index} className='comment'>
            <span>{comment.username}</span>
            <p>{comment.text}</p>
            <button onClick={() => setIsReplying(!isReplying)}>Reply</button>
            {isReplying && (
              <div className='reply-section'>
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder='Write a reply'
                />
                <button>Send</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='add-comment-section'>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Write a comment'
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default CommentModal;
