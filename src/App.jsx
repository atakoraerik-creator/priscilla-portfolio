import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Creations from './pages/Creations';
import Experience from './pages/Experience';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  // Close mobile menu / reset on route change handled inside Navbar via onNavigate.
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-chocolate-700 focus:px-5 focus:py-2 focus:text-ivory-50"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main" key={location.pathname} className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/creations" element={<Creations />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:productId" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}