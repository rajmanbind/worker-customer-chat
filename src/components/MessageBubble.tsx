
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'worker';
  timestamp: Date;
  isOwn: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex items-start space-x-3",
      message.isOwn ? "flex-row-reverse space-x-reverse" : ""
    )}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(
          "text-xs",
          message.sender === 'worker' 
            ? "bg-purple-100 text-purple-600" 
            : "bg-blue-100 text-blue-600"
        )}>
          {message.sender === 'worker' ? 'W' : 'C'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-xs lg:max-w-md",
        message.isOwn ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-lg shadow-sm",
          message.isOwn 
            ? "bg-blue-600 text-white ml-auto" 
            : "bg-white border text-gray-900"
        )}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <span className={cn(
          "text-xs text-gray-500 mt-1 block",
          message.isOwn ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
