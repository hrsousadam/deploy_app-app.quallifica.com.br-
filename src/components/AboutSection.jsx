// src/components/AboutSection.jsx
import React from "react";

const AboutSection = () => {
  return (
    <section id="sobre" className="dark-section">
      <div className="section-inner">
        <div className="grid max-w-5xl mx-auto gap-10 md:grid-cols-[1.6fr,1fr] items-start">
          {/* Texto principal */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Sobre a <span className="text-accent-blue">Quallifica</span>
            </h2>

            <p className="text-gray-300 mb-4 leading-relaxed">
              A Quallifica nasceu com o propósito de{" "}
              <span className="text-accent-green font-semibold">
                transformar a forma como profissionais usam dados no dia a dia
              </span>
              . Da planilha ao dashboard, cada curso é pensado para gerar
              resultado prático e imediato.
            </p>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Ao invés de apenas teoria, focamos em{" "}
              <span className="text-accent-blue">
                estudos de caso reais, exercícios guiados e projetos de mercado
              </span>
              , preparando o aluno para se destacar em seleções, promoções e
              novos desafios.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Seja você iniciante no Excel ou analista buscando dominar Power
              BI, a Quallifica é o parceiro certo para a sua evolução
              profissional.
            </p>
          </div>

          {/* Diferenciais */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-accent-blue/30 rounded-xl p-6 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
            <h3 className="text-xl font-semibold mb-3 text-accent-green">
              Nossos diferenciais
            </h3>

            <ul className="space-y-2 text-sm text-gray-200">
              <li>• Aulas focadas em prática, com aplicação imediata.</li>
              <li>• Conteúdo atualizado com o mercado.</li>
              <li>• Suporte direto do instrutor.</li>
              <li>• Material complementar completo.</li>
              <li>• Trilhas para crescimento profissional.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
