import { addDoc, collection, Timestamp } from "firebase/firestore"; // Firestore SDK functions
import { db } from "./firebase.config";
import { Post } from "../types/types";

// Define the post data structure
// export interface Comment {
//     commentId: string;
//     userId: string;
//     username: string;
//     text: string;
//     replies: Reply[];
// }

// export interface Reply {
//     replyId: string;
//     userId: string;
//     username: string;
//     text: string;
// }

// export interface Post {
//     postId: string;
//     userId: string;
//     username: string;
//     imageUrl: string;
//     likes: string[]; // Array of user IDs
//     comments: Comment[];
//     createdAt: any; // Timestamp
//     savedBy: string[]; // Array of user IDs
// }

// Function to add a post
export const addPost = async (post: Post) => {
    try {
        // Reference to the 'posts' collection
        const postsCollectionRef = collection(db, "posts");

        // Add the post to Firestore
        const docRef = await addDoc(postsCollectionRef, {
            ...post,
            createdAt: Timestamp.now() // Firestore's timestamp
        });

        console.log("Post added with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding post: ", error);
    }
};


// Example usage
export const postData: Post = {
    id: '1',
    postId: "post1",  // You can generate this manually or use Firestore-generated ID with addDoc
    userId: "user123",
    username: "john_doe",
    imageUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg",
    likes: ["user123", "user456"],
    comments: [
        {
            commentId: "comment1",
            userId: "user456",
            username: "jane_doe",
            text: "Nice picture!",
            replies: []
        }
    ],
    createdAt: Timestamp.now(), // Firestore Timestamp for creation
    savedBy: ["user789"]
};

// Call the function to add the post
addPost(postData);
