import React, { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const UserList = ({ setRecipientId }) => {
  const { users } = useContext(SocketContext);

  return (
    <div className="w-1/4 bg-gray-200 p-4">
      <h3 className="text-lg mb-2">Users</h3>
      {users.map((user) => (
        <div
          key={user.userId}
          onClick={() => setRecipientId(user.userId)}
          className="cursor-pointer hover:bg-gray-300 p-1 rounded"
        >
          {user.username} {user.online ? '(Online)' : '(Offline)'}
        </div>
      ))}
    </div>
  );
};

export default UserList;