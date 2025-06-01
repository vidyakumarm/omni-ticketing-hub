
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, MessageSquare, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Multi-channel Support",
      description: "Handle tickets from Slack, Teams, Email, and Web in one place"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Assign tickets, track performance, and work together seamlessly"
    },
    {
      icon: Zap,
      title: "Automation & Workflows",
      description: "Automate repetitive tasks and create custom workflows"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with advanced security features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="/lovable-uploads/9ac2f9b7-9c86-409e-8218-08684cd425b6.png" 
            alt="Syncrivo Logo" 
            className="h-14 w-auto hover:scale-105 transition-transform duration-200"
          />
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Customer Support Reimagined
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn conversations into 
            <span className="text-blue-600"> customer success</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage customer support across Slack, Teams, Email, and Web. 
            Automate workflows, track performance, and deliver exceptional customer experiences.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/dashboard">
              <Button size="lg" className="flex items-center space-x-2">
                <span>Try Syncrivo Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for customer support
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed to help your team deliver exceptional support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to get started?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Manage tickets from any channel</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Track team performance</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">Automate workflows</span>
            </div>
          </div>
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img 
            src="/lovable-uploads/9ac2f9b7-9c86-409e-8218-08684cd425b6.png" 
            alt="Syncrivo Logo" 
            className="h-14 w-auto mx-auto mb-4 hover:scale-105 transition-transform duration-200"
          />
          <p className="text-gray-400">
            © 2024 Syncrivo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
