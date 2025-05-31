
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Star, ArrowRight, Slack } from "lucide-react";

export const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const productImages = [
    "photo-1649972904349-6e44c42644a7",
    "photo-1488590528505-98d2b5aba04b",
    "photo-1581091226825-a6a2a5aee158"
  ];

  const handleDemoRequest = () => {
    const event = new CustomEvent('openDemoModal');
    window.dispatchEvent(event);
  };

  const handleSlackAuth = () => {
    // In a real app, this would initiate Slack OAuth
    window.open('https://slack.com/oauth/v2/authorize?client_id=your_client_id&scope=channels:read,groups:read,chat:write&redirect_uri=https://app.yourdomain.com/oauth/slack/callback', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                <Star className="w-4 h-4 mr-1" />
                4.9/5 Rating • Trusted by top performing teams
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                The modern{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  B2B ticketing
                </span>{" "}
                platform
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Support and grow your customers in Slack, MS Teams, Email & Web with 
                AI-powered ticketing that turns every conversation into actionable insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={handleDemoRequest}
              >
                Request a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
                onClick={handleSlackAuth}
              >
                <Slack className="mr-2 w-5 h-5" />
                Add to Slack
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Tickets Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Teams Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-fade-in delay-200">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl" />
              <div className="relative">
                <img 
                  src={`https://images.unsplash.com/${productImages[currentImage]}?auto=format&fit=crop&w=800&q=80`}
                  alt="Thena AI Ticketing Platform Dashboard"
                  className="w-full h-96 object-cover rounded-xl"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-900">AI Ticket Analysis</div>
                  <div className="text-xs text-gray-600">Processing customer insights...</div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 bg-white rounded-xl shadow-lg p-4 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Live Support Active</span>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-lg p-4 animate-float delay-1000">
              <div className="text-xs text-gray-600">Response Time</div>
              <div className="text-lg font-bold text-green-600">< 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
