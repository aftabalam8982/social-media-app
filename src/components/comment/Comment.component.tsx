import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import "./Comment.style.css";
import { db } from "../../firebase/firebase.config";
import Button from "../button/Button.component";
import { useAuth } from "../../contexts/userAuthContext";

interface CommentModalProps {
  postId: string;
  comments: any[];
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  comments,
  setIsOpen,
  isOpen,
}) => {
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { currentUser } = useAuth();

  const handleAddComment = async () => {
    console.log(postId);
    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        updateDoc(postRef, {
          comments: arrayUnion({
            username: currentUser?.displayName,
            text: newComment,
            replies: [],
          }),
        });
        setNewComment("");
      } else {
        console.error("Post does not exist");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='comment-modal'>
      <button onClick={handleClose} className='close-model'>
        close
      </button>
      <div className='comments-section'>
        {comments.map((comment, index) => (
          <div key={index} className='comment-sec'>
            <span>{comment.username}</span>
            <p>{comment.text}</p>
            <Button
              label='Reply'
              onClick={() => setIsReplying(!isReplying)}
              style='comment'
            />
            {isReplying && (
              <div className='reply-section'>
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder='Write a reply'
                />
                <Button label='Send' style='comment' />
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
        <Button
          label='Add Comment'
          onClick={handleAddComment}
          style='comment'
        />
      </div>
    </div>
  );
};

export default CommentModal;
