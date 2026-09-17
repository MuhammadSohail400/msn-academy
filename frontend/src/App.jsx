import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import LmsLayout from './components/layout/LmsLayout';
import ExamLayout from './components/layout/ExamLayout';

// Public pages — M2 (Marketing & Discovery)
import Home from './pages/public/Home';
import CourseCatalog from './pages/public/CourseCatalog';
import CourseDetails from './pages/public/CourseDetails';
import About from './pages/public/About';
import Pricing from './pages/public/Pricing';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import VerifyCertificate from './pages/public/VerifyCertificate';

// Auth pages — M1 (Auth, Profile & Dashboard)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard pages — M1 / M4
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import MyCourses from './pages/dashboard/MyCourses';

// Learning pages — M4
import CourseOverview from './pages/learning/CourseOverview';
import LecturePlayer from './pages/learning/LecturePlayer';

// Assessment pages — M4
import AssessmentBriefing from './pages/assessments/AssessmentBriefing';
import AssessmentQuestions from './pages/assessments/AssessmentQuestions';
import AssessmentResult from './pages/assessments/AssessmentResult';

// Checkout pages — M3
import Cart from './pages/checkout/Cart';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/checkout/OrderSuccess';
import OrderPending from './pages/checkout/OrderPending';
import OrderFailed from './pages/checkout/OrderFailed';
import OrderHistory from './pages/checkout/OrderHistory';

// Certificate pages — M3
import CertificateView from './pages/certificates/CertificateView';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing + commerce pages (M2, M3) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/verify/:certId" element={<VerifyCertificate />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/order/pending" element={<OrderPending />} />
          <Route path="/order/failed" element={<OrderFailed />} />
        </Route>

        {/* Auth pages (M1) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Authenticated LMS shell (M1 dashboard/profile, M4 learning) */}
        <Route element={<LmsLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/certificate" element={<CertificateView />} />
          <Route path="/certificate/:certId" element={<CertificateView />} />
          <Route path="/learn/:courseId" element={<CourseOverview />} />
          <Route path="/learn/:courseId/lesson/:id" element={<LecturePlayer />} />
        </Route>

        {/* Distraction-free assessment flow (M4) */}
        <Route element={<ExamLayout />}>
          <Route path="/learn/:courseId/assessment" element={<AssessmentBriefing />} />
          <Route path="/learn/:courseId/assessment/questions" element={<AssessmentQuestions />} />
          <Route path="/learn/:courseId/assessment/result" element={<AssessmentResult />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
