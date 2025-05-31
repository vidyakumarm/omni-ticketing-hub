
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket, 
  Bell, 
  Settings, 
  Clock, 
  Link, 
  BarChart3, 
  Megaphone, 
  HelpCircle 
} from "lucide-react";

export const UseCaseGrid = () => {
  const useCases = [
    {
      icon: Ticket,
      title: "Ticketing",
      subtitle: "Connect all channels that matter",
      description: "Automatically convert messages from Slack, Teams, email, and web into organized tickets with smart routing.",
      metrics: "80% reduction in manual ticket creation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bell,
      title: "Inbox",
      subtitle: "Smart notifications & SLAs",
      description: "Intelligent notification system with customizable SLA tracking and escalation workflows.",
      metrics: "95% SLA compliance rate",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Settings,
      title: "Custom Fields",
      subtitle: "Create, assign, streamline",
      description: "AI-powered custom field assignment based on ticket content and historical data patterns.",
      metrics: "60% faster ticket categorization",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "SLAs & Alerts",
      subtitle: "Track & deliver on time",
      description: "Automated SLA monitoring with proactive alerts and escalation rules to ensure timely responses.",
      metrics: "40% improvement in response times",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Link,
      title: "External Links & CRM",
      subtitle: "Link with Jira, Zendesk, Salesforce",
      description: "Seamless integration with your existing tools and CRM systems for unified workflow management.",
      metrics: "50+ integrations available",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      subtitle: "Data-driven customer insights",
      description: "Comprehensive analytics dashboard with AI-powered insights into customer satisfaction and team performance.",
      metrics: "Real-time performance tracking",
      color: "from-teal-500 to-blue-500"
    },
    {
      icon: Megaphone,
      title: "Broadcasts",
      subtitle: "Outreach in Slack & MS Teams",
      description: "Targeted messaging and announcements directly within your team's communication channels.",
      metrics: "3x higher engagement rates",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: HelpCircle,
      title: "Help Centers",
      subtitle: "Self-service knowledge base",
      description: "AI-generated help articles from resolved tickets, creating a comprehensive self-service portal.",
      metrics: "70% reduction in repeat queries",
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700">
            Use Cases & Benefits
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Built for every{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              support scenario
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From ticket management to customer insights, our platform adapts to your workflow 
            and scales with your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <Card 
              key={useCase.title}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-md animate-fade-in h-full"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="space-y-4 flex-grow">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <useCase.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-sm font-medium text-purple-600 mb-3">
                      {useCase.subtitle}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {useCase.metrics}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
