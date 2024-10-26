import React from "react";
import { Message } from "../../types/types";
import { useAuth } from "../../contexts/userAuthContext";
interface ChatBodyProps {
  messages: Message[];
}
const ChatBody: React.FC<ChatBodyProps> = ({ messages }) => {
  const { currentUser } = useAuth();
  return (
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
  );
};

export default ChatBody;
