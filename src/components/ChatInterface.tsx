
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, MoreVertical, Phone, Video, UserCheck, Clock, Wifi, WifiOff } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import CustomerList from "@/components/CustomerList";
import { useSocket } from "@/hooks/useSocket";

interface ChatInterfaceProps {
  role: 'customer' | 'worker';
  isAuthenticated: boolean;
}

const ChatInterface = ({ role, isAuthenticated }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Generate a user ID (in real app, this would come from authentication)
  const userId = `${role}-${Math.random().toString(36).substr(2, 9)}`;
  
  const {
    isConnected,
    rooms,
    messages,
    currentRoom,
    joinRoom,
    sendMessage
  } = useSocket({ userId, role });

  // Auto-join first room for demo
  useEffect(() => {
    if (rooms.length > 0 && !currentRoom) {
      joinRoom('room-1');
    }
  }, [rooms, currentRoom, joinRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && currentRoom) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {role === 'worker' && (
        <div className="lg:col-span-1">
          <CustomerList 
            activeCustomer={currentRoom || 'room-1'} 
            onCustomerSelect={joinRoom}
            rooms={rooms}
          />
        </div>
      )}
      
      <div className={`${role === 'worker' ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {role === 'customer' ? 'W' : 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {role === 'customer' ? 'Support Agent' : 'Customer Support Chat'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-green-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Room: {currentRoom || 'None'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t p-4 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                    className="pr-12 border-gray-200 focus:border-blue-500"
                    disabled={!isConnected || !currentRoom}
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected || !currentRoom}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isConnected 
                  ? "Press Enter to send, Shift + Enter for new line" 
                  : "Connecting to chat server..."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
