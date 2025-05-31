
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const CustomerTestimonials = () => {
  const testimonials = [
    {
      quote: "Thena empowers us to offer Slack as a support channel while maintaining professional service levels. The AI insights have been game-changing for our response times.",
      author: "Jessica Chiu",
      role: "Head of Customer Success",
      company: "Amplitude",
      logo: "📊",
      rating: 5
    },
    {
      quote: "The seamless integration with our existing tools and the intelligent ticket routing has reduced our support workload by 60%. It's like having an AI assistant for our entire team.",
      author: "Michael Rodriguez",
      role: "VP of Engineering",
      company: "Vercel",
      logo: "⚡",
      rating: 5
    },
    {
      quote: "What impressed us most is how Thena learns from our support patterns. The custom field automation and smart categorization save us hours every day.",
      author: "Sarah Chen",
      role: "Customer Operations Lead",
      company: "ClickHouse",
      logo: "🔍",
      rating: 5
    },
    {
      quote: "The omnichannel inbox is incredible. Whether customers reach us via Slack, email, or Teams, everything flows into one organized view with full context and history.",
      author: "David Park",
      role: "Head of Support",
      company: "Linear",
      logo: "📐",
      rating: 5
    },
    {
      quote: "Thena's AI summaries and insights help us identify trends and improve our product based on real customer feedback. It's beyond just ticketing - it's customer intelligence.",
      author: "Emily Watson",
      role: "Chief Customer Officer",
      company: "Notion",
      logo: "📝",
      rating: 5
    },
    {
      quote: "The help center auto-generation from tickets is brilliant. We've built a comprehensive knowledge base that actually gets used, reducing repeat questions by 70%.",
      author: "Alex Thompson",
      role: "Product Manager",
      company: "Figma",
      logo: "🎨",
      rating: 5
    }
  ];

  const companiesUsing = [
    { name: "Vercel", logo: "⚡" },
    { name: "Amplitude", logo: "📊" },
    { name: "ClickHouse", logo: "🔍" },
    { name: "Linear", logo: "📐" },
    { name: "Notion", logo: "📝" },
    { name: "Figma", logo: "🎨" },
    { name: "Stripe", logo: "💳" },
    { name: "Discord", logo: "🎮" },
    { name: "GitLab", logo: "🦊" },
    { name: "Supabase", logo: "🚀" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-700">
            <Star className="w-4 h-4 mr-1" />
            Customer Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              top-performing teams
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading companies use Thena to transform their customer support 
            and drive better business outcomes.
          </p>
        </div>

        {/* Company Logos */}
        <div className="mb-16">
          <p className="text-center text-gray-500 mb-8 font-medium">Trusted by innovative companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {companiesUsing.map((company, index) => (
              <div 
                key={company.name}
                className="flex items-center gap-3 hover:scale-110 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="font-semibold text-gray-700">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.author}
              className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Quote */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                    <p className="text-gray-700 leading-relaxed italic pl-6">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
                      {testimonial.logo}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm font-medium text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-blue-600">4.9/5</div>
                  <div className="text-gray-600">Average Rating</div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-green-600">98%</div>
                  <div className="text-gray-600">Customer Satisfaction</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-purple-600">500+</div>
                  <div className="text-gray-600">Teams Using Thena</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-orange-600">1M+</div>
                  <div className="text-gray-600">Tickets Processed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
