
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, MoreVertical, Phone, Video, UserCheck, Clock } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import CustomerList from "@/components/CustomerList";

interface ChatInterfaceProps {
  role: 'customer' | 'worker';
  isAuthenticated: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'worker';
  timestamp: Date;
  isOwn: boolean;
}

const ChatInterface = ({ role, isAuthenticated }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "worker",
      timestamp: new Date(Date.now() - 300000),
      isOwn: role === 'worker'
    },
    {
      id: "2", 
      text: "Hi! I'm having trouble with my account settings.",
      sender: "customer",
      timestamp: new Date(Date.now() - 240000),
      isOwn: role === 'customer'
    },
    {
      id: "3",
      text: "I'd be happy to help you with that. Can you tell me more about the specific issue you're experiencing?",
      sender: "worker", 
      timestamp: new Date(Date.now() - 180000),
      isOwn: role === 'worker'
    }
  ]);
  
  const [activeCustomer, setActiveCustomer] = useState<string | null>(role === 'customer' ? 'self' : 'customer-1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: role,
        timestamp: new Date(),
        isOwn: true
      };
      setMessages([...messages, newMessage]);
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
          <CustomerList activeCustomer={activeCustomer} onCustomerSelect={setActiveCustomer} />
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
                    {role === 'customer' ? 'Support Agent' : 'Customer #1234'}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Online</span>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Active 2m
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
                    placeholder="Type your message..."
                    className="pr-12 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
