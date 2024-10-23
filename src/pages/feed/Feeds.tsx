import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../../components/post-card/PostCard.component";
import { db } from "../../firebase/firebase.config";
import { Post } from "../../types/types";

const Feeds: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // State to store posts
  const [lastVisible, setLastVisible] = useState<any>(null); // Keeps track of last document fetched
  const [hasMore, setHasMore] = useState(true); // Determines if more posts are available for infinite scroll
  const [loading, setLoading] = useState(false);

  console.log(posts);
  // Function to fetch initial posts
  const fetchPosts = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(5) // Limit the number of posts fetched
      );

      // Set up real-time listener for initial posts
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">), // Ensure type safety
        }));

        setPosts(postsData); // Set posts in the state
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Set the last fetched document

        // If fewer posts than the limit are returned, stop further fetching
        if (querySnapshot.docs.length < 5) {
          setHasMore(false);
        }
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    } catch (error) {
      console.error("Error fetching posts: ", error);
    } finally {
      setLoading(false); // Stop loading once the operation completes
    }
  };

  // Fetch more posts with real-time updates when scrolling
  const fetchMorePosts = async () => {
    if (!lastVisible || !hasMore || loading) return; // Stop if no more posts or loading

    setLoading(true);

    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible), // Start after the last document fetched
        limit(5) // Limit the number of posts fetched
      );

      // Set up real-time listener for paginated posts
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsData: Post[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">), // Ensure type safety
        }));

        // Append new posts to the existing posts
        setPosts((prevPosts) => [...prevPosts, ...postsData]);

        // Update the last visible document for future pagination
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // If fewer posts than the limit are returned, stop further fetching
        if (querySnapshot.docs.length < 5) {
          setHasMore(false);
        }
      });

      return () => unsubscribe(); // Cleanup listener on unmount
    } catch (error) {
      console.error("Error fetching more posts: ", error);
    } finally {
      setLoading(false); // Stop loading once the operation completes
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch initial posts when the component mounts
  }, []); // Empty dependency array ensures it only runs on mount

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMorePosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more posts to load</p>}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default Feeds;
