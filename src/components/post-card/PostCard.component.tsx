import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCard.style.css";
import {
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../../contexts/userAuthContext";
import { db } from "../../firebase/firebase.config";
import { Post } from "../../types/types";
import CommentModal from "../comment/Comment.component";
import Button from "../button/Button.component";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { id, userId, imageUrl, username, likes, comments, postId } = post;

  console.log("re-render");
  const handleLike = async () => {
    if (!currentUser) {
      alert("Please sign in first to like this post!");
      return; // Early return if user is not signed in
    }

    try {
      const postRef = doc(db, "posts", postId);
      const postDocSnapshot = await getDoc(postRef);
      if (postDocSnapshot.exists()) {
        const postData = postDocSnapshot.data();
        const likedData = postData?.likes;
        const hasLiked = likedData.some(
          (user: any) => user.uid === currentUser.uid
        );
        if (likedData.length !== 0) {
          if (hasLiked) {
            await updateDoc(postRef, {
              likes: arrayRemove({ uid: currentUser.uid }),
            });
          }
        }
        await updateDoc(postRef, {
          likes: arrayUnion({ uid: currentUser.uid }),
        });
        setIsLiked(!hasLiked);
      }
    } catch (error: any) {
      console.error("Error updating likes:", error.message);
    }
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

  const handleComment = () => {
    if (!currentUser) {
      alert("User need to sign in first");
      return;
    }
    setIsOpen(!isOpen);
  };

  const totalLikes = likes.length; // Count likes as the length of the array

  return (
    <div className='post-card'>
      <div className='post-card-header'>
        <h4 onClick={handleUsernameClick} className='username-link'>
          {username}
        </h4>
      </div>
      <div>
        <img
          loading='eager'
          src={imageUrl}
          alt='Post'
          className='post-card-image'
        />
      </div>
      <div className='post-card-actions'>
        <Button
          label={isLiked ? "❤️ Liked" : "🤍 Like"}
          onClick={handleLike}
          style='comment'
        />
        <span>{totalLikes} Likes</span>
        <Button
          label={isSaved ? "🔖 Saved" : "📑 Save"}
          onClick={handleSave}
          style='comment'
        />
      </div>
      <div>
        <Button
          label={`🗨️ Comments ${comments.length}`}
          onClick={handleComment}
          style='comment'
        />
        {isOpen && (
          <CommentModal
            postId={postId}
            comments={comments}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(PostCard);
