
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

export const Footer = () => {
  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "AI Ticketing", href: "#" },
        { name: "Omnichannel Inbox", href: "#" },
        { name: "Analytics Dashboard", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Workflow Automation", href: "#" }
      ]
    },
    {
      title: "Integrations",
      links: [
        { name: "Slack Integration", href: "#" },
        { name: "Microsoft Teams", href: "#" },
        { name: "Salesforce", href: "#" },
        { name: "HubSpot", href: "#" },
        { name: "View All Integrations", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "API Documentation", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Community", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Security", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Thena
                </h3>
                <p className="text-gray-400 mt-2">
                  The modern B2B ticketing platform powered by AI
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>hello@thena.ai</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>

              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-gray-400 text-sm">
            © 2024 Thena. All rights reserved. Built with ❤️ for modern support teams.
          </div>
          
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Status Page
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Security
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
