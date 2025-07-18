import React from 'react';

const RoomSelector = ({ setRoom }) => {
  const rooms = ['global', 'room1', 'room2'];

  return (
    <div className="mt-4">
      <h3 className="text-lg mb-2">Rooms</h3>
      {rooms.map((room) => (
        <button
          key={room}
          onClick={() => setRoom(room)}
          className="block mb-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {room}
        </button>
      ))}
    </div>
  );
};

export default RoomSelector;