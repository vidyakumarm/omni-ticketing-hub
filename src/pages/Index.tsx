
import { Hero } from "../components/landing/Hero";
import { FeatureHighlights } from "../components/landing/FeatureHighlights";
import { UseCaseGrid } from "../components/landing/UseCaseGrid";
import { IntegrationsPanel } from "../components/landing/IntegrationsPanel";
import { CustomerTestimonials } from "../components/landing/CustomerTestimonials";
import { Footer } from "../components/landing/Footer";
import { DemoRequestModal } from "../components/landing/DemoRequestModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Hero />
      <FeatureHighlights />
      <UseCaseGrid />
      <IntegrationsPanel />
      <CustomerTestimonials />
      <Footer />
      <DemoRequestModal />
    </div>
  );
};

export default Index;
