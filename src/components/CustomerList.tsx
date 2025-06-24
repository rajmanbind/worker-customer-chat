
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, AlertCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Room } from "@/services/socketService";

interface CustomerListProps {
  activeCustomer: string | null;
  onCustomerSelect: (roomId: string) => void;
  rooms: Room[];
}

const CustomerList = ({ activeCustomer, onCustomerSelect, rooms }: CustomerListProps) => {
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getLastMessage = (room: Room) => {
    const lastMessage = room.messages[room.messages.length - 1];
    return lastMessage ? lastMessage.text : 'No messages yet';
  };

  const getLastMessageTime = (room: Room) => {
    const lastMessage = room.messages[room.messages.length - 1];
    return lastMessage ? lastMessage.timestamp : room.createdAt;
  };

  const getUnreadCount = (room: Room) => {
    // Simulate unread count based on recent messages
    return Math.floor(Math.random() * 3);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Chat Rooms
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {rooms.length} active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-2">
            {rooms.map((room) => {
              const unreadCount = getUnreadCount(room);
              const lastMessage = getLastMessage(room);
              const lastMessageTime = getLastMessageTime(room);
              
              return (
                <Button
                  key={room.id}
                  variant="ghost"
                  className={cn(
                    "w-full p-3 h-auto justify-start mb-2 hover:bg-gray-50",
                    activeCustomer === room.id ? "bg-blue-50 border border-blue-200" : ""
                  )}
                  onClick={() => onCustomerSelect(room.id)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          R{room.id.split('-')[1]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {room.name}
                        </p>
                        <div className="flex items-center space-x-1">
                          {unreadCount > 0 && (
                            <Badge variant="default" className="h-5 text-xs px-1.5 bg-blue-600">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 truncate mb-1">
                        {lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(lastMessageTime)}
                        </span>
                        <Badge variant="outline" className="text-xs h-5 text-green-600 bg-green-50">
                          {room.participants.length} online
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
