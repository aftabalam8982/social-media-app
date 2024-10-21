import React, { useState } from "react";
import "./CreatePost.style.css";
import { db } from "../../firebase/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/userAuthContext";

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) {
      setError("You must be logged in to create a post.");
      return;
    }

    if (!imageUrl) {
      setError("Image URL is required.");
      return;
    }

    try {
      const postsCollectionRef = collection(db, "posts");
      await addDoc(postsCollectionRef, {
        imageUrl,
        username: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        createdAt: new Date(),
        likes: [],
        comments: [],
        savedBy: [],
      });

      // Notify the parent component about the new post
      onPostCreated();

      // Clear the input field
      setImageUrl("");
      setError("");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='create-post-form'>
      <input
        type='text'
        placeholder='Image URL'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
        className='form-input' // Add class for styling
      />
      <button type='submit' className='create-post-button'>
        Create Post
      </button>
      {error && <p className='error-message'>{error}</p>}
    </form>
  );
};

export default CreatePost;
