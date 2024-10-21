// types/Post.ts
export interface Comment {
    text: string;
    username: string;
    userId: string;
    commentId: string;
    replies: Comment[];  // Nested replies, which are also of type Comment
}

export interface Post {
    id: string;
    imageUrl: string;
    postId: string;
    comments: Comment[];
    savedBy: string[];  // Array of user IDs who saved the post
    username: string;
    userId: string;
    createdAt: FirebaseTimestamp;  // A type for Firebase timestamps
    likes: string[];  // Array of user IDs who liked the post
}

export interface FirebaseTimestamp {
    seconds: number;
    nanoseconds: number;
}



// firebase user

export interface UserAuthProps {
    displayName: string | null,
    email: string | null,
    uid: string
}

// formData

export type FormDataProps = {
    displayName?: string,
    email: string,
    password: string,
    confirmPassword?: string
}