
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
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private rooms: Map<string, Room> = new Map();
  private currentUserId: string = '';
  private currentRole: 'customer' | 'worker' = 'customer';

  connect(userId: string, role: 'customer' | 'worker') {
    this.currentUserId = userId;
    this.currentRole = role;
    
    // Simulate WebSocket connection
    console.log(`Connecting to chat server as ${role} with ID: ${userId}`);
    
    // Create initial rooms for demo
    this.initializeRooms();
    
    // Simulate connection established
    setTimeout(() => {
      this.emit('connected', { userId, role });
    }, 500);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    console.log('Disconnected from chat server');
  }

  joinRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room && !room.participants.includes(this.currentUserId)) {
      room.participants.push(this.currentUserId);
      this.emit('joined-room', { roomId, userId: this.currentUserId });
      this.emit('room-updated', room);
      console.log(`Joined room: ${roomId}`);
    }
  }

  leaveRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(id => id !== this.currentUserId);
      this.emit('left-room', { roomId, userId: this.currentUserId });
      this.emit('room-updated', room);
      console.log(`Left room: ${roomId}`);
    }
  }

  sendMessage(roomId: string, text: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: this.currentRole,
      timestamp: new Date(),
      isOwn: true,
      roomId,
      userId: this.currentUserId
    };

    room.messages.push(message);
    
    // Simulate real-time message delivery
    setTimeout(() => {
      this.emit('message-received', message);
      
      // Simulate response from other party after 2 seconds
      if (this.currentRole === 'customer') {
        setTimeout(() => {
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: this.getWorkerResponse(text),
            sender: 'worker',
            timestamp: new Date(),
            isOwn: false,
            roomId,
            userId: 'worker-1'
          };
          room.messages.push(responseMessage);
          this.emit('message-received', responseMessage);
        }, 2000);
      }
    }, 100);
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
    const room1: Room = {
      id: 'room-1',
      name: 'Customer Support - Alex Johnson',
      participants: [],
      messages: [
        {
          id: '1',
          text: 'Hello! How can I help you today?',
          sender: 'worker',
          timestamp: new Date(Date.now() - 300000),
          isOwn: this.currentRole === 'worker',
          roomId: 'room-1',
          userId: 'worker-1'
        },
        {
          id: '2',
          text: 'Hi! I need help with my account settings.',
          sender: 'customer',
          timestamp: new Date(Date.now() - 240000),
          isOwn: this.currentRole === 'customer',
          roomId: 'room-1',
          userId: 'customer-1'
        }
      ],
      createdAt: new Date(Date.now() - 600000)
    };

    this.rooms.set('room-1', room1);
  }

  private getWorkerResponse(customerMessage: string): string {
    const responses = [
      "I understand your concern. Let me help you with that.",
      "Thank you for reaching out. I'll look into this right away.",
      "That's a great question! Here's what I can do to help.",
      "I see the issue. Let me provide you with a solution.",
      "Thanks for the information. I'll resolve this for you."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const socketService = new SocketService();
export type { Message, Room };
