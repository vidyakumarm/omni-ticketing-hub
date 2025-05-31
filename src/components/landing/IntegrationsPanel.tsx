
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const IntegrationsPanel = () => {
  const integrations = [
    {
      name: "Slack",
      description: "Native Slack integration for seamless ticket management",
      logo: "🔗",
      category: "Communication",
      color: "from-purple-500 to-blue-500"
    },
    {
      name: "Microsoft Teams",
      description: "Full Teams integration with rich messaging support",
      logo: "💬",
      category: "Communication",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Zendesk",
      description: "Sync tickets and customer data with Zendesk",
      logo: "🎫",
      category: "Ticketing",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Intercom",
      description: "Connect with Intercom for unified customer communication",
      logo: "💡",
      category: "Support",
      color: "from-orange-500 to-red-500"
    },
    {
      name: "HubSpot",
      description: "CRM integration for complete customer context",
      logo: "📊",
      category: "CRM",
      color: "from-pink-500 to-purple-500"
    },
    {
      name: "Salesforce",
      description: "Enterprise CRM integration with case management",
      logo: "☁️",
      category: "CRM",
      color: "from-indigo-500 to-blue-500"
    },
    {
      name: "Freshdesk",
      description: "Bi-directional sync with Freshdesk ticketing",
      logo: "🎯",
      category: "Ticketing",
      color: "from-teal-500 to-green-500"
    },
    {
      name: "Jira",
      description: "Link support tickets with development issues",
      logo: "🔧",
      category: "Development",
      color: "from-blue-600 to-purple-600"
    }
  ];

  const categories = [...new Set(integrations.map(i => i.category))];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
            Integrations & Connectivity
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Connect with{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              your favorite tools
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly integrate with 50+ popular tools and platforms to create 
            a unified support ecosystem that works with your existing workflow.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant="outline" 
              className="px-4 py-2 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <Card 
              key={integration.name}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-md animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {integration.logo}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {integration.description}
                    </p>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Learn More
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-white space-y-4">
                <h3 className="text-2xl font-bold">Don't see your integration?</h3>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  We're constantly adding new integrations. Let us know what tools you use 
                  and we'll prioritize them in our roadmap.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                >
                  Request Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
