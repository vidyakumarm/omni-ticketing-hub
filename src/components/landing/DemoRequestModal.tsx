
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Users, Building, Mail, User, X } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  company: string;
  teamSize: string;
  role: string;
  slackWorkspaceUrl: string;
  msTeamsTenantId: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const DemoRequestModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    role: "",
    slackWorkspaceUrl: "",
    msTeamsTenantId: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setErrors({});
    };

    window.addEventListener('openDemoModal', handleOpenModal);
    return () => window.removeEventListener('openDemoModal', handleOpenModal);
  }, []);

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        return value.trim() ? null : 'Full name is required';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Work email is required';
        return emailRegex.test(value) ? null : 'Please enter a valid email address';
      case 'company':
        return value.trim() ? null : 'Company name is required';
      case 'role':
        return value.trim() ? null : 'Role/Title is required';
      case 'slackWorkspaceUrl':
        if (!value.trim()) return null; // Optional field
        const slackRegex = /^https?:\/\/[a-z0-9-]+\.slack\.com\/.*$/i;
        return slackRegex.test(value) ? null : 'Please enter a valid Slack workspace URL';
      case 'msTeamsTenantId':
        if (!value.trim()) return null; // Optional field
        const tenantRegex = /^[a-zA-Z0-9-]+$/;
        return tenantRegex.test(value) ? null : 'Please enter a valid tenant ID (alphanumeric)';
      default:
        return null;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate required fields
    ['name', 'email', 'company', 'role'].forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field] = error;
    });

    // Validate optional fields if they have values
    if (formData.slackWorkspaceUrl) {
      const error = validateField('slackWorkspaceUrl', formData.slackWorkspaceUrl);
      if (error) newErrors.slackWorkspaceUrl = error;
    }

    if (formData.msTeamsTenantId) {
      const error = validateField('msTeamsTenantId', formData.msTeamsTenantId);
      if (error) newErrors.msTeamsTenantId = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    const requiredFields = ['name', 'email', 'company', 'role'];
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return value.trim() && !validateField(field, value);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/marketing/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          teamSize: formData.teamSize || null,
          role: formData.role.trim(),
          slackWorkspaceUrl: formData.slackWorkspaceUrl.trim() || null,
          msTeamsTenantId: formData.msTeamsTenantId.trim() || null,
          message: formData.message.trim() || null
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setIsSuccess(true);
        toast({
          title: "Demo Request Submitted!",
          description: "We'll contact you within 24 hours to schedule your personalized demo.",
        });

        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            company: "",
            teamSize: "",
            role: "",
            slackWorkspaceUrl: "",
            msTeamsTenantId: "",
            message: ""
          });
        }, 2000);
      } else if (response.status === 400 && result.errors) {
        // Handle field-specific errors from server
        setErrors(result.errors);
      } else {
        throw new Error(result.message || 'Something went wrong');
      }

    } catch (error) {
      console.error('Demo request error:', error);
      toast({
        title: "Error",
        description: "Failed to submit demo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your demo request has been received. Our team will contact you within 24 hours to schedule your personalized demo.
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Request #DR-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Request a Demo
          </DialogTitle>
          <p className="text-gray-600 text-center">
            See how Thena can transform your customer support workflow
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Smith"
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Work Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@company.com"
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company *
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your Company Name"
              className={errors.company ? "border-red-500" : ""}
              required
            />
            {errors.company && (
              <p className="text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Size
              </Label>
              <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Support Manager"
                className={errors.role ? "border-red-500" : ""}
                required
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slackWorkspaceUrl">Slack Workspace URL (Optional)</Label>
            <Input
              id="slackWorkspaceUrl"
              value={formData.slackWorkspaceUrl}
              onChange={(e) => handleInputChange('slackWorkspaceUrl', e.target.value)}
              placeholder="https://yourcompany.slack.com"
              className={errors.slackWorkspaceUrl ? "border-red-500" : ""}
            />
            {errors.slackWorkspaceUrl && (
              <p className="text-sm text-red-600">{errors.slackWorkspaceUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="msTeamsTenantId">MS Teams Tenant ID (Optional)</Label>
            <Input
              id="msTeamsTenantId"
              value={formData.msTeamsTenantId}
              onChange={(e) => handleInputChange('msTeamsTenantId', e.target.value)}
              placeholder="alphanumeric-tenant-id"
              className={errors.msTeamsTenantId ? "border-red-500" : ""}
            />
            {errors.msTeamsTenantId && (
              <p className="text-sm text-red-600">{errors.msTeamsTenantId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message / Comments (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your support challenges or specific requirements..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What to expect:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 30-minute personalized demo</li>
              <li>• Custom setup for your workflow</li>
              <li>• Q&A with our product experts</li>
              <li>• No sales pressure, just value</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Request a Demo"
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              We respect your privacy. Read our{" "}
              <button 
                type="button" 
                className="text-blue-600 hover:underline"
                onClick={() => {
                  // In a real app, this would open privacy policy modal or page
                  window.open('/privacy-policy', '_blank');
                }}
              >
                Privacy Policy
              </button>.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
