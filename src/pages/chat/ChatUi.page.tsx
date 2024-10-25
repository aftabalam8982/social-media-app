import React, { useEffect, useState } from "react";
import "./ChatUi.style.css";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { Message, User } from "../../types/types";
import { useAuth } from "../../contexts/userAuthContext";

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useAuth();

  // Fetch users and listen for changes
  const fetchUsers = (): Unsubscribe => {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const unsubscribe = onSnapshot(q, (usersSnapshot) => {
      const usersData = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as User[];
      setUsers(usersData);
    });

    return unsubscribe; // Return unsubscribe function to clean up listener
  };

  // Fetch messages for a specific user and return an unsubscribe function
  const fetchMessages = (uid: string): Unsubscribe | undefined => {
    if (!currentUser) return undefined;

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as User;
        setMessages(userData.messages || []);
      }
    });

    return unsubscribe; // Return unsubscribe function to clean up listener
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!user || !currentUser || !newMessage.trim()) return;

    try {
      const timeString = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: currentUser.uid,
        time: timeString,
      };

      // Update the recipient user's messages
      const otherUserRef = doc(db, "users", user.id);
      await updateDoc(otherUserRef, {
        messages: arrayUnion(message),
      });

      // Update local state to reflect the message immediately
      setNewMessage("");
    } catch (error: any) {
      console.log("Error while sending message:", error.message);
    }
  };

  // Handle user click and switch chat
  const handleUserClick = (id: string) => {
    const selectedUser = users.find((user) => user.id === id);
    if (selectedUser) {
      // Unsubscribe from previous user's messages
      if (user) {
        const prevUnsubscribe = fetchMessages(user.id);
        if (prevUnsubscribe) prevUnsubscribe(); // Call the previous unsubscribe function
      }

      setUser(selectedUser);

      // Fetch new user's messages in real-time
      const newUnsubscribe = fetchMessages(id);
      return newUnsubscribe; // Return unsubscribe function
    }
  };

  // Set up user fetching and cleanup on component unmount
  useEffect(() => {
    const unsubscribeUsers = fetchUsers(); // Fetch and listen to users

    return () => {
      unsubscribeUsers(); // Clean up user listener
    };
  }, []);

  return (
    <div className='chat-container'>
      {/* Chat List */}
      <div className='chat-list'>
        <h3>Chats</h3>
        <ul>
          {users?.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.displayName?.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className='chat-window'>
        <div className='chat-header'>
          <h3>{user?.displayName || "Anonymous"}</h3>
        </div>

        <div className='chat-body'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === currentUser?.uid ? "sent" : "received"
              }`}
            >
              <p>{message.text}</p>
              <span>{message.time}</span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className='chat-input'>
          <input
            type='text'
            placeholder='Type a message...'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
