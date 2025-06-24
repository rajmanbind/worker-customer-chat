
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  status: 'online' | 'away' | 'offline';
  unreadCount: number;
  priority: 'low' | 'medium' | 'high';
}

interface CustomerListProps {
  activeCustomer: string | null;
  onCustomerSelect: (customerId: string) => void;
}

const CustomerList = ({ activeCustomer, onCustomerSelect }: CustomerListProps) => {
  const customers: Customer[] = [
    {
      id: 'customer-1',
      name: 'Alex Johnson',
      lastMessage: 'I need help with my account settings',
      timestamp: new Date(Date.now() - 120000),
      status: 'online',
      unreadCount: 2,
      priority: 'high'
    },
    {
      id: 'customer-2', 
      name: 'Sarah Chen',
      lastMessage: 'Thanks for the help earlier!',
      timestamp: new Date(Date.now() - 300000),
      status: 'away',
      unreadCount: 0,
      priority: 'low'
    },
    {
      id: 'customer-3',
      name: 'Mike Rodriguez',
      lastMessage: 'When will the new feature be available?',
      timestamp: new Date(Date.now() - 600000),
      status: 'online',
      unreadCount: 1,
      priority: 'medium'
    },
    {
      id: 'customer-4',
      name: 'Emma Wilson',
      lastMessage: 'Payment issue resolved, thank you!',
      timestamp: new Date(Date.now() - 900000),
      status: 'offline',
      unreadCount: 0,
      priority: 'low'
    }
  ];

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Active Chats
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {customers.filter(c => c.unreadCount > 0).length} new
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-2">
            {customers.map((customer) => (
              <Button
                key={customer.id}
                variant="ghost"
                className={cn(
                  "w-full p-3 h-auto justify-start mb-2 hover:bg-gray-50",
                  activeCustomer === customer.id ? "bg-blue-50 border border-blue-200" : ""
                )}
                onClick={() => onCustomerSelect(customer.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      getStatusColor(customer.status)
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        {customer.priority === 'high' && (
                          <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                        {customer.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 text-xs px-1.5 bg-blue-600">
                            {customer.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {customer.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(customer.timestamp)}
                      </span>
                      <Badge variant="outline" className={cn("text-xs h-5", getPriorityColor(customer.priority))}>
                        {customer.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
