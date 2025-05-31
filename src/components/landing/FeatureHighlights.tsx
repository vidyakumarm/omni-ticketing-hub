
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Brain, 
  FileText, 
  BookOpen, 
  Inbox,
  Sparkles
} from "lucide-react";

export const FeatureHighlights = () => {
  const features = [
    {
      icon: Zap,
      title: "AI Ticketing",
      description: "AI turns customer messages into actionable support tickets automatically, reducing manual work by 80%.",
      color: "from-blue-500 to-cyan-500",
      badge: "Core Feature"
    },
    {
      icon: Brain,
      title: "AI Custom Fields",
      description: "AI auto-applies custom fields to tickets based on content analysis and historical patterns.",
      color: "from-purple-500 to-pink-500",
      badge: "Smart"
    },
    {
      icon: Sparkles,
      title: "AI Summaries & Insights",
      description: "Concise AI-generated summaries, insights, and action items for every customer interaction.",
      color: "from-green-500 to-emerald-500",
      badge: "Analytics"
    },
    {
      icon: BookOpen,
      title: "Help Center / Articles",
      description: "Convert tickets into rich help center articles automatically with AI content generation.",
      color: "from-orange-500 to-red-500",
      badge: "Knowledge Base"
    },
    {
      icon: Inbox,
      title: "Omni-channel Inbox",
      description: "Manage Slack, MS Teams, email, and web requests from one unified, intelligent hub.",
      color: "from-indigo-500 to-purple-500",
      badge: "Unified"
    },
    {
      icon: FileText,
      title: "Smart Workflows",
      description: "Automated workflows that route tickets, assign agents, and trigger actions based on AI analysis.",
      color: "from-teal-500 to-blue-500",
      badge: "Automation"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
            AI-Powered Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              modern support
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge AI to transform your customer support operations 
            with intelligent automation and actionable insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
