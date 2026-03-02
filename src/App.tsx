import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TestExtraction from "./pages/TestExtraction";
import DefectExtraction from "./pages/DefectExtraction";
import TestTypeUpdate from "./pages/TestTypeUpdate";
import EvidenceGenerator from "./pages/EvidenceGenerator";
import AttachmentDownloader from "./pages/AttachmentDownloader";
import AccessProvider from "./pages/AccessProvider";
import MaintenanceNotification from "./pages/MaintenanceNotification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test-extraction" element={<TestExtraction />} />
        <Route path="/defect-extraction" element={<DefectExtraction />} />
        <Route path="/test-type-update" element={<TestTypeUpdate />} />
        <Route path="/evidence-generator" element={<EvidenceGenerator />} />
        <Route path="/attachment-downloader" element={<AttachmentDownloader />} />
        <Route path="/access-provider" element={<AccessProvider />} />
        <Route path="/maintenance" element={<MaintenanceNotification />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
