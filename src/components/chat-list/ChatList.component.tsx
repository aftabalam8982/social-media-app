import { User } from "../../types/types";

interface ChatListProps {
  users: User[];
  handleUserClick: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ users, handleUserClick }) => {
  return (
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
  );
};

export default ChatList;
