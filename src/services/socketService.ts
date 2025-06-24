
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'worker';
  timestamp: Date;
  isOwn: boolean;
  roomId: string;
  userId: string;
}

interface Room {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private rooms: Map<string, Room> = new Map();
  private currentUserId: string = '';
  private currentRole: 'customer' | 'worker' = 'customer';

  connect(userId: string, role: 'customer' | 'worker') {
    this.currentUserId = userId;
    this.currentRole = role;
    
    // Connect to your Socket.io server
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    console.log(`Connecting to chat server as ${role} with ID: ${userId}`);

    // Set up Socket.io event listeners
    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      this.socket?.emit('join', { userId, role });
    });

    this.socket.on('connected', (data) => {
      console.log('Server confirmed connection:', data);
      this.initializeRooms();
      this.emit('connected', data);
    });

    this.socket.on('message-received', (message) => {
      // Convert timestamp string back to Date object
      message.timestamp = new Date(message.timestamp);
      message.isOwn = message.userId === this.currentUserId;
      
      const room = this.rooms.get(message.roomId);
      if (room) {
        room.messages.push(message);
      }
      
      this.emit('message-received', message);
    });

    this.socket.on('room-joined', (room) => {
      room.messages = room.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        isOwn: msg.userId === this.currentUserId
      }));
      room.createdAt = new Date(room.createdAt);
      this.rooms.set(room.id, room);
      this.emit('room-updated', room);
    });

    this.socket.on('room-updated', (room) => {
      room.messages = room.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        isOwn: msg.userId === this.currentUserId
      }));
      room.createdAt = new Date(room.createdAt);
      this.rooms.set(room.id, room);
      this.emit('room-updated', room);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    console.log('Disconnected from chat server');
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
      console.log(`Joining room: ${roomId}`);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
      console.log(`Left room: ${roomId}`);
    }
  }

  sendMessage(roomId: string, text: string) {
    if (this.socket) {
      this.socket.emit('send-message', { roomId, text });
    }
  }

  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  private initializeRooms() {
    // Create a default room and join it
    const defaultRoom: Room = {
      id: 'room-1',
      name: 'Customer Support - Live Chat',
      participants: [],
      messages: [],
      createdAt: new Date()
    };

    this.rooms.set('room-1', defaultRoom);
    
    // Auto-join the default room
    setTimeout(() => {
      this.joinRoom('room-1');
    }, 1000);
  }
}

export const socketService = new SocketService();
export type { Message, Room };
