
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Headphones } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import RoleSelector from "@/components/RoleSelector";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'worker' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={setSelectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">ChatConnect</h1>
              </div>
              <Badge variant={selectedRole === 'worker' ? 'default' : 'secondary'} className="ml-4">
                {selectedRole === 'worker' ? (
                  <><Headphones className="h-4 w-4 mr-1" /> Worker</>
                ) : (
                  <><Users className="h-4 w-4 mr-1" /> Customer</>
                )}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedRole(null)}
                className="text-sm"
              >
                Switch Role
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {isAuthenticated ? 'Profile' : 'Sign In'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChatInterface role={selectedRole} isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
};

export default Index;
