import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import ForgeLogin from "./pages/forge/Login.tsx";
import ForgeDashboard from "./pages/forge/Dashboard.tsx";
import ForgeQueries from "./pages/forge/Queries.tsx";
import ForgeEditProfile from "./pages/forge/EditProfile.tsx";
import ForgeUpgrade from "./pages/forge/Upgrade.tsx";
import AdminLogin from "./pages/admin/Login.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import AdminTransactions from "./pages/admin/Transactions.tsx";
import AdminRevenue from "./pages/admin/Revenue.tsx";
import AdminPaymentConfig from "./pages/admin/PaymentConfig.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* SaaS landing page */}
          <Route path="/" element={<Landing />} />

          {/* Forge (user portfolio editor) */}
          <Route path="/forge" element={<ForgeLogin />} />
          <Route path="/forge/dashboard" element={<ForgeDashboard />} />
          <Route path="/forge/dashboard/:username" element={<ForgeDashboard />} />
          <Route path="/forge/queries" element={<ForgeQueries />} />
          <Route path="/forge/edit-profile" element={<ForgeEditProfile />} />
          <Route path="/forge/upgrade" element={<ForgeUpgrade />} />

          {/* Admin panel — must be before /:username */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/payment-config" element={<AdminPaymentConfig />} />

          {/* Dynamic portfolio by username */}
          <Route path="/:username" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
