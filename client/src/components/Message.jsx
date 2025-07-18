import React from 'react';

const Message = ({ message, user }) => {
  const isOwnMessage = message.sender.id === user.id;
  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block p-2 rounded-lg ${isOwnMessage ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <strong>{message.sender.username}</strong>: {message.text}
        <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default Message;