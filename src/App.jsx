// src/App.jsx
import { Routes, Route } from "react-router-dom";

import "./index.css";
import "./layout.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import CoursesSection from "./components/CoursesSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

import AdminPage from "./pages/AdminPage";
import AdminCourses from "./pages/AdminCourses";
import CoursePage from "./pages/CoursePage";
import PowerBISalesPage from "./pages/PowerBISalesPage";

export default function App() {
  return (
    <div className="page-shell">
      <Header />

      <main className="page-main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CoursesSection />
                <AboutSection />
                <ContactSection />
              </>
            }
          />

          <Route path="/curso/:slug" element={<CoursePage />} />

          {/* Página de vendas dedicada (se quiser linkar direto) */}
          <Route path="/powerbi" element={<PowerBISalesPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/cursos" element={<AdminCourses />} />

          {/* fallback simples */}
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl p-8 text-center text-white/80">
                <h1 className="text-2xl font-semibold text-white">
                  Página não encontrada
                </h1>
                <p className="mt-2">Verifique o endereço e tente novamente.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
