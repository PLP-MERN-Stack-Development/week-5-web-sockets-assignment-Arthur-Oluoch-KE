
import React, { createContext } from 'react';
import { useSocket } from '../socket/socket';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketData = useSocket();

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};
