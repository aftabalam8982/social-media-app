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

// const mockMessages: Message[] = [
//   { id: "1", text: "Hey there!", sender: "me", time: "10:00 AM" },
//   { id: "2", text: "Hello! How are you?", sender: "other", time: "10:01 AM" },
// ];

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const { currentUser } = useAuth();

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
        // console.log(usersData);
        // const users = usersData?.map((user) => ({
        //   id: user.id,
        //   displayName: user.displayName,
        // }));
        setUsers(usersData);
      });
      return () => unsubscribe();
    } catch (error: any) {
      console.log("getting error fetching users:", error.message);
    }
  };
  //   console.log(users);

  const fetchMessages = async (uid: string) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", uid);
      const getDocSnapshot = await getDoc(userRef);
      if (getDocSnapshot.exists()) {
        const userMessages = getDocSnapshot.data();
        // console.log(userMessages);
        setMessages(userMessages.messages);
      }
    } catch (error: any) {
      console.log("fetching message error:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  //   console.log(currentUser);
  const handleSendMessage = async () => {
    if (!user) return;
    if (!currentUser) return;
    console.log(user.id, currentUser.uid);
    try {
      const userRef = doc(db, "users", currentUser?.uid);
      const otherUserRef = doc(db, "users", user?.id);
      const otherUserDoc = await getDoc(otherUserRef);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && otherUserDoc.exists()) {
        const date = new Date(); // Or any date object
        const timeString = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        await updateDoc(otherUserRef, {
          messages: arrayUnion({
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: currentUser.uid,
            time: timeString,
          }),
        });
        // if (user.id !== currentUser.uid) {
        //   await updateDoc(otherUserRef, {
        //     messages: arrayUnion({
        //       id: Date.now().toString(),
        //       text: newMessage.trim(),
        //       sender: user.id,
        //       time: timeString,
        //     }),
        //   });
        // }

        setNewMessage("");
      }
    } catch (error: any) {
      console.log("getting error while adding text:", error.message);
    }
  };

  const handleUserClick = (id: string) => {
    const userData = users.find((user) => user.id === id);

    fetchMessages(id);
    setUser(userData);
    setMessages(userData?.messages || []);
  };

  return (
    <div className='chat-container'>
      {/* Chat List */}
      <div className='chat-list'>
        <h3>Chats</h3>
        <ul>
          {users?.map((user) => {
            const { id, displayName } = user;
            return (
              <li onClick={() => handleUserClick(id)} key={id}>
                {displayName?.toUpperCase()}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat Window */}
      <div className='chat-window'>
        <div className='chat-header'>
          <h3>{user?.displayName || "Anonymous"}</h3>
        </div>

        <div className='chat-body'>
          {messages?.map((message) => (
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
