import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.style.css";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../../contexts/userAuthContext";
import { db } from "../../firebase/firebase.config";
import { Post } from "../../types/types";

const PostCard: React.FC<Post> = ({
  id,
  userId,
  imageUrl,
  username,
  likes, // Assuming this is an array of strings (user IDs)
  comments,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert("Please login to save posts");
      return;
    }
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        savedPosts: arrayUnion(id),
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const handleUsernameClick = () => {
    navigate(`/user/${userId}`);
  };

  // Calculate total likes based on the likes array
  const totalLikes = likes.length + (isLiked ? 1 : 0); // Count likes as the length of the array

  return (
    <div className='post-card'>
      <div className='post-card-header'>
        <h4 onClick={handleUsernameClick} className='username-link'>
          {username}
        </h4>
      </div>
      <div>
        <img src={imageUrl} alt='Post' className='post-card-image' />
      </div>
      <div className='post-card-actions'>
        <button onClick={handleLike}>{isLiked ? "❤️ Liked" : "🤍 Like"}</button>
        <span>{totalLikes} Likes</span> {/* Display total likes here */}
        <button onClick={handleSave}>{isSaved ? "🔖 Saved" : "📑 Save"}</button>
      </div>
      <div>
        <button>🗨️ Comments ({comments.length})</button>
      </div>
    </div>
  );
};

export default PostCard;
