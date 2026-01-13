// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import quallificaLogo from "../assets/quallifica-logo-full.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("quallifica-theme") || "dark";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    localStorage.setItem("quallifica-theme", theme);
    document.documentElement.classList.toggle("light-mode", theme === "light");
  }, [theme]);

  const scrollToHash = (hash) => {
    const doScroll = () => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 120);
    } else doScroll();

    // ao clicar em um item no mobile, fecha o menu
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: "Início", hash: "#home" },
    { label: "Cursos", hash: "#cursos" },
    { label: "Sobre", hash: "#sobre" },
    { label: "Contato", hash: "#contato" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-6">
        {/* LOGO + TEXTO – centralizados, com hover futurista */}
        <button
          type="button"
          onClick={() => scrollToHash("#home")}
          className="flex items-center gap-3 md:gap-4 group"
        >
          <img
            src={quallificaLogo}
            alt="Quallifica Cursos"
            className="
              h-10 md:h-14 
              w-auto 
              object-contain
              transition-all duration-300 
              drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]
              group-hover:drop-shadow-[0_0_22px_rgba(56,189,248,0.7)]
              group-hover:scale-[1.02]
            "
          />

          <div className="text-left leading-tight">
            <span
              className="
                block 
                text-sm md:text-lg 
                font-semibold 
                text-white 
                group-hover:text-transparent 
                group-hover:bg-clip-text 
                group-hover:bg-gradient-to-r 
                group-hover:from-accent-blue 
                group-hover:via-sky-400 
                group-hover:to-emerald-400 
                transition-colors duration-300
              "
            >
              Quallifica{" "}
              <span className="text-accent-blue group-hover:text-inherit">
                Cursos
              </span>
            </span>
            <span className="hidden sm:block text-[11px] text-gray-400">
              Excel &amp; Power BI focados em resultado
            </span>
          </div>
        </button>

        {/* NAVEGAÇÃO / AÇÕES (desktop) */}
        <nav className="hidden md:flex items-center gap-4 md:gap-6">
          <ul className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.hash}>
                <button
                  type="button"
                  onClick={() => scrollToHash(item.hash)}
                  className="
                    relative 
                    text-gray-400 
                    hover:text-white 
                    transition-colors 
                    after:content-[''] 
                    after:absolute 
                    after:left-0 
                    after:-bottom-1 
                    after:h-[2px] 
                    after:w-0 
                    after:bg-accent-blue
                    after:rounded-full 
                    after:transition-all 
                    after:duration-300 
                    hover:after:w-full
                  "
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Botão Admin – normal, limpo */}
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="
              inline-flex items-center 
              px-4 py-1.5 
              rounded-lg 
              text-[11px] md:text-xs 
              font-semibold 
              border border-sky-500/60
              text-accent-blue
              hover:bg-accent-blue/20
              transition
            "
          >
            Admin
          </button>

          {/* Toggle de tema */}
          <button
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
            className="
              inline-flex h-9 w-9 
              items-center justify-center 
              rounded-full 
              border border-slate-700 
              bg-slate-900/90 
              hover:border-amber-400 
              hover:text-amber-300 
              transition-all duration-200 
              text-sm
            "
            aria-label="Alterar tema"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </nav>

        {/* Ações / menu no MOBILE */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Toggle tema - sempre visível */}
          <button
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
            className="
              inline-flex h-8 w-8 
              items-center justify-center 
              rounded-full 
              border border-slate-700 
              bg-slate-900/90 
              hover:border-amber-400 
              hover:text-amber-300 
              transition-all duration-200 
              text-xs
            "
            aria-label="Alterar tema"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* Botão hambúrguer */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex flex-col justify-center items-center h-9 w-9 rounded-lg border border-slate-700 bg-slate-900/80 hover:border-sky-500 transition-all"
            aria-label="Abrir menu"
          >
            <span
              className={`h-[2px] w-4 bg-slate-100 rounded-full transition-transform duration-200 ${
                isMenuOpen
                  ? "translate-y-[3px] rotate-45"
                  : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`h-[2px] w-4 bg-slate-100 rounded-full transition-opacity duration-150 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-[2px] w-4 bg-slate-100 rounded-full transition-transform duration-200 ${
                isMenuOpen
                  ? "-translate-y-[3px] -rotate-45"
                  : "translate-y-[3px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* SUB-HEADER – campanhas / mensagem */}

      {/* MENU MOBILE EXPANDIDO */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.hash}>
                  <button
                    type="button"
                    onClick={() => scrollToHash(item.hash)}
                    className="w-full text-left text-gray-300 py-1 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/admin");
              }}
              className="
                mt-2 inline-flex items-center justify-center 
                w-full px-4 py-2 rounded-lg 
                text-xs font-semibold 
                border border-sky-500/60 
                text-accent-blue 
                hover:bg-accent-blue/20 
                transition
              "
            >
              Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
