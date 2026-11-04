import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { TemplateMarketplacePage } from './pages/TemplateMarketplacePage';
import { AtsCheckerPage } from './pages/AtsCheckerPage';
import { AiOptimizerPage } from './pages/AiOptimizerPage';
import { JobAnalyzerPage } from './pages/JobAnalyzerPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<ResumeUploadPage />} />
            <Route path="/builder" element={<ResumeBuilderPage />} />
            <Route path="/templates" element={<TemplateMarketplacePage />} />
            <Route path="/ats-checker" element={<AtsCheckerPage />} />
            <Route path="/ai-optimizer" element={<AiOptimizerPage />} />
            <Route path="/job-analyzer" element={<JobAnalyzerPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/pricing" element={<SubscriptionPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
