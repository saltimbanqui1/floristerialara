import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieProvider } from "@/contexts/CookieContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import TermsAndConditions from "./pages/TermsAndConditions";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TestPago from "./pages/TestPago";
import Unsubscribe from "./pages/Unsubscribe";
import CookieBanner from "@/components/cookies/CookieBanner";
import CartSheet from "@/components/cart/CartSheet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CookieProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <CookieBanner />
          <CartSheet />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />
              <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/dashboard-lara" element={<AdminDashboard />} />
              <Route path="/test-pago" element={<TestPago />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </CookieProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
