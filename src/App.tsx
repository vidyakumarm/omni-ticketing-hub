
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Kanban from "./pages/Kanban";
import TicketDetail from "./pages/TicketDetail";
import CustomFields from "./pages/CustomFields";
import SLAs from "./pages/SLAs";
import Tags from "./pages/Tags";
import Workflows from "./pages/Workflows";
import CustomStatuses from "./pages/CustomStatuses";
import AccountsContacts from "./pages/AccountsContacts";
import Broadcasts from "./pages/Broadcasts";
import HelpCenter from "./pages/HelpCenter";
import UserProfile from "./pages/UserProfile";
import AISettings from "./pages/AISettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/ticket/:ticketId" element={<TicketDetail />} />
          <Route path="/settings/custom-fields" element={<CustomFields />} />
          <Route path="/settings/slas" element={<SLAs />} />
          <Route path="/settings/tags" element={<Tags />} />
          <Route path="/settings/workflows" element={<Workflows />} />
          <Route path="/settings/custom-statuses" element={<CustomStatuses />} />
          <Route path="/settings/ai" element={<AISettings />} />
          <Route path="/accounts-contacts" element={<AccountsContacts />} />
          <Route path="/broadcasts" element={<Broadcasts />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
