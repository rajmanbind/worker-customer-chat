
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
      console.log('Socket connected successfully');
      setIsConnected(true);
      setRooms(socketService.getRooms());
    };

    const handleMessageReceived = (message: Message) => {
      console.log('Message received:', message);
      if (currentRoom && message.roomId === currentRoom) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleRoomUpdated = (room: Room) => {
      console.log('Room updated:', room);
      setRooms(prev => {
        const existingIndex = prev.findIndex(r => r.id === room.id);
        if (existingIndex >= 0) {
          const newRooms = [...prev];
          newRooms[existingIndex] = room;
          return newRooms;
        } else {
          return [...prev, room];
        }
      });
      
      // If this is the current room, update messages
      if (currentRoom === room.id) {
        setMessages(room.messages);
      }
    };

    socketService.on('connected', handleConnected);
    socketService.on('message-received', handleMessageReceived);
    socketService.on('room-updated', handleRoomUpdated);

    return () => {
      socketService.off('connected', handleConnected);
      socketService.off('message-received', handleMessageReceived);
      socketService.off('room-updated', handleRoomUpdated);
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [userId, role, currentRoom]);

  const joinRoom = useCallback((roomId: string) => {
    console.log('Joining room:', roomId);
    socketService.joinRoom(roomId);
    setCurrentRoom(roomId);
    
    // Load room messages if room exists
    const room = socketService.getRoom(roomId);
    if (room) {
      setMessages(room.messages);
    } else {
      setMessages([]);
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
    if (currentRoom && text.trim()) {
      console.log('Sending message:', text);
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
