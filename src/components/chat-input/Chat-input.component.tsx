import React from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => Promise<void>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
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
  );
};

export default ChatInput;
