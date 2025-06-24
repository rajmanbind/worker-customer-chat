
import { useEffect, useState, useCallback } from 'react';
import { socketService, Message, Room } from '@/services/socketService';

interface UseSocketProps {
  userId: string;
  role: 'customer' | 'worker';
}

export const useSocket = ({ userId, role }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  useEffect(() => {
    // Connect to socket
    socketService.connect(userId, role);

    // Set up event listeners
    const handleConnected = () => {
      setIsConnected(true);
      setRooms(socketService.getRooms());
    };

    const handleMessageReceived = (message: Message) => {
      if (currentRoom && message.roomId === currentRoom) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleRoomUpdated = (room: Room) => {
      setRooms(prev => prev.map(r => r.id === room.id ? room : r));
    };

    socketService.on('connected', handleConnected);
    socketService.on('message-received', handleMessageReceived);
    socketService.on('room-updated', handleRoomUpdated);

    return () => {
      socketService.off('connected', handleConnected);
      socketService.off('message-received', handleMessageReceived);
      socketService.off('room-updated', handleRoomUpdated);
      socketService.disconnect();
    };
  }, [userId, role, currentRoom]);

  const joinRoom = useCallback((roomId: string) => {
    socketService.joinRoom(roomId);
    setCurrentRoom(roomId);
    
    // Load room messages
    const room = socketService.getRoom(roomId);
    if (room) {
      setMessages(room.messages);
    }
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketService.leaveRoom(roomId);
    if (currentRoom === roomId) {
      setCurrentRoom(null);
      setMessages([]);
    }
  }, [currentRoom]);

  const sendMessage = useCallback((text: string) => {
    if (currentRoom) {
      socketService.sendMessage(currentRoom, text);
    }
  }, [currentRoom]);

  return {
    isConnected,
    rooms,
    messages,
    currentRoom,
    joinRoom,
    leaveRoom,
    sendMessage
  };
};
