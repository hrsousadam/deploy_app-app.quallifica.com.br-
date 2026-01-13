// src/components/Footer.jsx
import React from "react";
import quallificaSymbol from "../assets/quallifica-symbol.png";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* -------------------- LINHA SUPERIOR -------------------- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo + Texto */}
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center">
              <img
                src={quallificaSymbol}
                alt="Quallifica Cursos"
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="max-w-md">
              <h3 className="text-xl font-bold text-white">
                Quallifica <span className="text-accent-blue">Cursos</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Excel e Power BI focados em{" "}
                <span className="text-accent-green font-semibold">
                  resultado real
                </span>{" "}
                para transformar sua carreira e os relatórios da sua empresa.
              </p>
            </div>
          </div>

          {/* CTA WhatsApp */}
          <div className="text-center md:text-right max-w-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Próximo passo
            </h4>
            <p className="text-sm text-gray-300 mb-4">
              Quer levar seus relatórios para outro nível? Fale com a
              Quallifica.
            </p>

            <a
              href="https://wa.me/5581999955328?text=Ol%C3%A1%2C+quero+saber+mais+sobre+os+cursos+da+Quallifica!"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-accent-green text-dark-bg text-xs font-semibold hover:bg-emerald-400 transition shadow-md"
            >
              Falar com a Quallifica no WhatsApp
            </a>
          </div>
        </div>

        {/* -------------------- DIVISOR -------------------- */}
        <div className="mt-12 border-t border-slate-800"></div>

        {/* -------------------- LINHA INFERIOR -------------------- */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 text-[12px] text-gray-500 gap-4">
          <span>© {year} Quallifica Cursos. Todos os direitos reservados.</span>

          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent-green"></span>
            Turmas ao vivo • Projetos de mercado • Suporte do instrutor
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
