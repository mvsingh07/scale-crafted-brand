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
          {/* Forge admin — must be defined before /:username to avoid conflict */}
          <Route path="/forge" element={<ForgeLogin />} />
          <Route path="/forge/dashboard" element={<ForgeDashboard />} />
          <Route path="/forge/queries" element={<ForgeQueries />} />
          <Route path="/forge/edit-profile" element={<ForgeEditProfile />} />
          {/* Dynamic portfolio by username */}
          <Route path="/:username" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
