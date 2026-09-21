import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageFallback from './components/feedback/PageFallback';

// Layouts (loaded synchronously to preserve instant shell rendering)
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import LmsLayout from './components/layout/LmsLayout';
import ExamLayout from './components/layout/ExamLayout';

// Public pages — M2 (Marketing & Discovery) — Code Split via React.lazy
const Home = lazy(() => import('./pages/public/Home'));
const CourseCatalog = lazy(() => import('./pages/public/CourseCatalog'));
const CourseDetails = lazy(() => import('./pages/public/CourseDetails'));
const About = lazy(() => import('./pages/public/About'));
const Pricing = lazy(() => import('./pages/public/Pricing'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Contact = lazy(() => import('./pages/public/Contact'));
const VerifyCertificate = lazy(() => import('./pages/public/VerifyCertificate'));

// Auth pages — M1 (Auth, Profile & Dashboard) — Code Split
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));

// Dashboard pages — M1 / M4 — Code Split
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const MyCourses = lazy(() => import('./pages/dashboard/MyCourses'));

// Learning pages — M4 — Code Split
const CourseOverview = lazy(() => import('./pages/learning/CourseOverview'));
const LecturePlayer = lazy(() => import('./pages/learning/LecturePlayer'));

// Assessment pages — M4 — Code Split
const AssessmentBriefing = lazy(() => import('./pages/assessments/AssessmentBriefing'));
const AssessmentQuestions = lazy(() => import('./pages/assessments/AssessmentQuestions'));
const AssessmentResult = lazy(() => import('./pages/assessments/AssessmentResult'));

// Checkout pages — M3 — Code Split
const Cart = lazy(() => import('./pages/checkout/Cart'));
const Checkout = lazy(() => import('./pages/checkout/Checkout'));
const OrderSuccess = lazy(() => import('./pages/checkout/OrderSuccess'));
const OrderPending = lazy(() => import('./pages/checkout/OrderPending'));
const OrderFailed = lazy(() => import('./pages/checkout/OrderFailed'));
const OrderHistory = lazy(() => import('./pages/checkout/OrderHistory'));

// Certificate pages — M3 — Code Split
const CertificateView = lazy(() => import('./pages/certificates/CertificateView'));

const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
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
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          {/* Authenticated LMS shell (M1 dashboard/profile, M4 learning, assessment briefing & scorecard) */}
          <Route element={<LmsLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/certificate" element={<CertificateView />} />
            <Route path="/certificate/:certId" element={<CertificateView />} />
            <Route path="/learn/:courseId" element={<CourseOverview />} />
            <Route path="/learn/:courseId/lesson/:id" element={<LecturePlayer />} />
            <Route path="/learn/:courseId/assessment" element={<AssessmentBriefing />} />
            <Route path="/learn/:courseId/assessment/result" element={<AssessmentResult />} />
          </Route>

          {/* Distraction-free active exam shell (M4 timed engine) */}
          <Route element={<ExamLayout />}>
            <Route path="/learn/:courseId/assessment/questions" element={<AssessmentQuestions />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
