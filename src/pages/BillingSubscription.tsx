
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  Users, 
  MessageSquare, 
  Bot, 
  HardDrive,
  Check
} from 'lucide-react';

const BillingSubscription: React.FC = () => {
  const [showChangeCardModal, setShowChangeCardModal] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  // Mock data - in real app, this would come from API calls
  const subscription = {
    planId: 'pro',
    planName: 'Pro',
    monthlyCost: '$49',
    nextBillingDate: 'June 15, 2025',
    billingEmail: 'admin@company.com',
    autoRenew: true,
  };

  const usage = {
    agentSeatsUsed: 5,
    agentSeatsTotal: 10,
    ticketVolumeUsed: 1234,
    ticketVolumeTotal: 10000,
    aiCreditsUsed: 2500,
    aiCreditsTotal: 5000,
    storageUsedGB: 12,
    storageTotalGB: 50,
  };

  const paymentMethod = {
    cardType: 'Visa',
    lastFour: '1234',
    expiryMonth: '08',
    expiryYear: '2025',
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyCost: '$0',
      features: ['2 Agent Seats', '1,000 Tickets/month', 'Basic Support', 'Email Integration'],
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyCost: '$49',
      features: ['10 Agent Seats', '10,000 Tickets/month', 'AI Features', 'Custom Fields', 'Analytics', 'Priority Support'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyCost: '$99',
      features: ['Unlimited Seats', 'Unlimited Tickets', 'Advanced AI', 'White-label', 'SSO', 'Dedicated Support'],
    },
  ];

  const invoices = [
    {
      id: 'INV-12345',
      date: '2025-05-15',
      amount: '$49.00',
      status: 'Paid',
      pdfUrl: '#',
    },
    {
      id: 'INV-12344',
      date: '2025-04-15',
      amount: '$49.00',
      status: 'Paid',
      pdfUrl: '#',
    },
    {
      id: 'INV-12343',
      date: '2025-03-15',
      amount: '$49.00',
      status: 'Paid',
      pdfUrl: '#',
    },
  ];

  const formatUsagePercentage = (used: number, total: number) => {
    if (total === 0) return 100;
    return Math.round((used / total) * 100);
  };

  const renderChangeCardModal = () => (
    <Dialog open={showChangeCardModal} onOpenChange={setShowChangeCardModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber" 
              placeholder="1234 5678 9012 3456"
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input 
                id="expiry" 
                placeholder="MM/YY"
                className="font-mono"
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input 
                id="cvc" 
                placeholder="123"
                className="font-mono"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input 
              id="cardName" 
              placeholder="John Doe"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowChangeCardModal(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Save Card</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderChangePlanModal = () => (
    <Dialog open={showChangePlanModal} onOpenChange={setShowChangePlanModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Change Plan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                plan.id === subscription.planId 
                  ? 'border-blue-500 bg-blue-50' 
                  : selectedPlanId === plan.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.id === subscription.planId && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{plan.monthlyCost}<span className="text-sm font-normal text-gray-600">/month</span></p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowChangePlanModal(false)} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            className="flex-1"
            disabled={!selectedPlanId || selectedPlanId === subscription.planId}
          >
            Change Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription, payment method, and view usage</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{subscription.planName}</h3>
                <p className="text-2xl font-bold text-blue-600">{subscription.monthlyCost}<span className="text-sm text-gray-600">/month</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-medium">{subscription.nextBillingDate}</p>
              </div>
              <Button onClick={() => setShowChangePlanModal(true)} className="w-full">
                Upgrade / Change Plan
              </Button>
            </CardContent>
          </Card>

          {/* Usage Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Usage Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Agent Seats</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usage.agentSeatsUsed} / {usage.agentSeatsTotal} used
                  </span>
                </div>
                <Progress 
                  value={formatUsagePercentage(usage.agentSeatsUsed, usage.agentSeatsTotal)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Monthly Ticket Volume</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usage.ticketVolumeUsed.toLocaleString()} / {usage.ticketVolumeTotal.toLocaleString()} tickets
                  </span>
                </div>
                <Progress 
                  value={formatUsagePercentage(usage.ticketVolumeUsed, usage.ticketVolumeTotal)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">AI Credits</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usage.aiCreditsUsed.toLocaleString()} / {usage.aiCreditsTotal.toLocaleString()} tokens
                  </span>
                </div>
                <Progress 
                  value={formatUsagePercentage(usage.aiCreditsUsed, usage.aiCreditsTotal)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Storage Usage</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {usage.storageUsedGB} GB / {usage.storageTotalGB} GB used
                  </span>
                </div>
                <Progress 
                  value={formatUsagePercentage(usage.storageUsedGB, usage.storageTotalGB)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Current Card</p>
                <p className="font-medium">
                  {paymentMethod.cardType} ending in {paymentMethod.lastFour}, 
                  Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                </p>
              </div>
              <Button onClick={() => setShowChangeCardModal(true)} variant="outline" className="w-full">
                Change Card
              </Button>
              <div>
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input 
                  id="billingEmail" 
                  value={subscription.billingEmail}
                  className="mt-1"
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {renderChangeCardModal()}
      {renderChangePlanModal()}
    </Layout>
  );
};

export default BillingSubscription;
