// ChatUI.tsx
import React, { useEffect, useState } from "react";
import "./ChatUi.style.css";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { Message, User } from "../../types/types";
import { useAuth } from "../../contexts/userAuthContext";

// const mockChats = [
//   { id: "1", name: "Alice" },
//   { id: "2", name: "Bob" },
//   { id: "3", name: "Charlie" },
// ];

const mockMessages: Message[] = [
  { id: "1", text: "Hey there!", sender: "me", time: "10:00 AM" },
  { id: "2", text: "Hello! How are you?", sender: "other", time: "10:01 AM" },
];

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser, setCurrentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      //   const usersSnapshot = await getDocs(usersRef);
      const unsubscribe = onSnapshot(q, (usersSnapshot) => {
        const usersData = usersSnapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(usersData);
        const users = usersData?.map((user) => ({
          id: user.id,
          displayName: user.displayName,
        }));
        setUsers(users);
      });
      return () => unsubscribe();
    } catch (error: any) {
      console.log("getting error fetching users:", error.message);
    }
  };
  //   console.log(users);

  const fetchMessages = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const getDocSnapshot = await getDoc(userRef);
      if (getDocSnapshot.exists()) {
        const userMessages = getDocSnapshot.data();
        console.log(userMessages);
        setMessages(userMessages.messages);
      }
    } catch (error: any) {
      console.log("fetching message error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);
  //   console.log(currentUser);
  const handleSendMessage = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser?.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const date = new Date(); // Or any date object
        const timeString = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        const response = await updateDoc(userRef, {
          messages: arrayUnion({
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: currentUser.uid,
            time: timeString,
          }),
        });
        console.log(response);
        setNewMessage("");
      }
    } catch (error: any) {
      console.log("getting error while adding text:", error.message);
    }
  };

  return (
    <div className='chat-container'>
      {/* Chat List */}
      <div className='chat-list'>
        <h3>Chats</h3>
        <ul>
          {users.map((chat) => (
            <li key={chat.id}>{chat.displayName.toUpperCase()}</li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className='chat-window'>
        <div className='chat-header'>
          <h3>Chat with Alice</h3>
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
