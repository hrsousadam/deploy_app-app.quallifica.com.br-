// src/components/CourseCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionArticle = motion.article;

const CourseCard = ({
  title,
  description,
  level,
  duration,
  highlight,
  nextClass,
  slug, // <-- RECEBE O SLUG DO CURSO
  onMouseEnter,
  onMouseLeave,
}) => {
  const navigate = useNavigate();

  return (
    <MotionArticle
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`gradient-card min-w-[260px] md:min-w-0 snap-center rounded-2xl border bg-gradient-to-br shadow-xl
      ${
        highlight
          ? "from-accent-blue/15 via-slate-950 to-accent-green/10 border-accent-green/60"
          : "from-slate-950 via-slate-900 to-slate-950 border-slate-800"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-5 flex flex-col h-full">
        {highlight && (
          <span className="inline-flex self-start items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-green/15 text-accent-green border border-accent-green/50 mb-2">
            Mais procurado
          </span>
        )}

        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-3 flex-1">{description}</p>

        <div className="flex flex-wrap gap-2 text-[11px] mb-4">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-gray-200 border border-slate-700">
            Nível: {level}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-gray-200 border border-slate-700">
            Carga horária: {duration}
          </span>
          {nextClass && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
              Próxima turma: {nextClass}
            </span>
          )}
        </div>

        {/* 👉 AGORA O BOTÃO VAI PARA A PÁGINA DO CURSO */}
        <button
          type="button"
          onClick={() => navigate(`/curso/${slug}`)}
          className="mt-auto w-full text-center text-xs font-semibold px-4 py-2 rounded-lg bg-accent-blue text-dark-bg hover:bg-accent-green transition"
        >
          Quero mais informações
        </button>
      </div>
    </MotionArticle>
  );
};

export default CourseCard;
