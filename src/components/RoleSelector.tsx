
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Users, MessageSquare, ArrowRight } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'customer' | 'worker') => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <MessageSquare className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">ChatConnect</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect customers with support workers through real-time chat. Choose your role to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Customer</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 mb-6">
                Get instant support and connect with available workers for help with your questions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Instant connection to available workers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Real-time messaging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>File sharing support</span>
                </li>
              </ul>
              <Button 
                onClick={() => onRoleSelect('customer')}
                className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-all duration-300"
                size="lg"
              >
                Continue as Customer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Headphones className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Worker</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 mb-6">
                Provide support to customers and manage multiple chat conversations efficiently.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Manage multiple customer chats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Quick response templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Customer history access</span>
                </li>
              </ul>
              <Button 
                onClick={() => onRoleSelect('worker')}
                className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700 transition-all duration-300"
                size="lg"
              >
                Continue as Worker
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Secure, fast, and reliable chat platform for customer support
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
