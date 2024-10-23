import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "../../components/post-card/PostCard.component";
import { db } from "../../firebase/firebase.config";
import { Post } from "../../types/types";

const Feeds: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // State to store posts
  const [lastVisible, setLastVisible] = useState<any>(null); // Keeps track of last document fetched
  const [hasMore, setHasMore] = useState(true); // Determines if more posts are available for infinite scroll

  console.log(posts);
  // Function to fetch initial posts
  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(5) // Limit the number of posts fetched
      );
      const querySnapshot = await getDocs(q); // Fetch documents
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">), // Ensure type safety
      }));

      setPosts(postsData); // Set posts in the state
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Set the last fetched document
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  // Function to fetch more posts on scroll
  const fetchMorePosts = async () => {
    if (!lastVisible) return; // If there's no more last document, stop fetching

    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible), // Start after the last document fetched
        limit(5) // Limit the number of posts fetched
      );

      const querySnapshot = await getDocs(q); // Fetch documents
      const postsData: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">), // Ensure type safety
      }));

      setPosts((prevPosts) => [...prevPosts, ...postsData]); // Append new posts to the existing posts
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Update the last fetched document

      if (querySnapshot.docs.length === 0) {
        setHasMore(false); // Stop fetching more if no more posts
      }
    } catch (error) {
      console.error("Error fetching more posts: ", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
