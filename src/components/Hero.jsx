// src/components/Hero.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../hero.css";

const UPCOMING_BATCHES = [
  {
    id: "excel",
    title: "Próxima turma Excel Essencial!",
    subtitle: "Início em Janeiro/2026 – foco total no dia a dia.",
  },
  {
    id: "powerbi",
    title: "Próxima turma Power BI Completo!",
    subtitle: "Transforme relatórios em dashboards profissionais.",
  },
  {
    id: "dashboards",
    title: "Turma de Dashboards no Excel!",
    subtitle: "Construa painéis incríveis sem sair do Excel.",
  },
];

// ==========================
// Hook de máquina de escrever
// ==========================
const useTypewriter = (text, speed = 40) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
};

// ==========================================
// Hook para animar número (0 ↔ target) SEM setState síncrono
// - Quando isActive = true: anima 0 → target
// - Quando isActive = false: anima target → 0
// ==========================================
const useAnimatedNumber = (target, isActive, duration = 1000) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;

    const from = isActive ? 0 : target;
    const to = isActive ? target : 0;
    const startTime = performance.now();

    const loop = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.round(from + (to - from) * progress);
      setValue(current);

      if (progress < 1) {
        frame = requestAnimationFrame(loop);
      }
    };

    frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [target, isActive, duration]);

  return value;
};

const FloatingBatchBanner = ({ batch }) => {
  if (!batch) return null;

  return (
    <div className="hero-banner hero-banner-floating w-full flex justify-center">
      <div
        key={batch.id}
        className="
          hero-banner-content
          w-full max-w-[580px]
          rounded-xl bg-emerald-900/90 border border-emerald-500/70
          px-4 py-3 text-[11px] text-emerald-50 text-center
          shadow-[0_18px_50px_rgba(0,0,0,0.7)]
        "
      >
        <p className="font-semibold">{batch.title}</p>
        <p className="mt-0.5 text-emerald-100/90">{batch.subtitle}</p>
      </div>
    </div>
  );
};

const MotionPanel = motion.div;

// ==========================
// PAINEL DO ALUNO – PREMIUM
// ==========================
const PanelCard = () => {
  const panelRef = useRef(null);
  const isInView = useInView(panelRef, {
    amount: 0.4,
    margin: "-10% 0px",
  });

  // Números animados (0 ↔ alvo) com base no isInView
  const excelPct = useAnimatedNumber(80, isInView, 900);
  const dashPct = useAnimatedNumber(65, isInView, 1000);
  const biPct = useAnimatedNumber(90, isInView, 1100);

  return (
    <MotionPanel
      ref={panelRef}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 32px 110px rgba(15,23,42,1)",
      }}
      className="
        relative
        rounded-3xl
        border border-slate-600/70
        bg-slate-950/70
        px-8 py-10
        shadow-[0_30px_90px_rgba(15,23,42,0.95)]
        backdrop-blur-xl
        overflow-hidden
      "
    >
      {/* Glow / gradiente interno */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/18 via-sky-500/8 to-transparent opacity-80" />

      {/* Conteúdo real do painel */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div>
            <p className="text-[12px] uppercase tracking-wide text-gray-400">
              Painel do aluno
            </p>
            <h3 className="text-lg font-semibold text-white">
              Indicadores de desempenho
            </h3>
          </div>

          <span className="px-4 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/70 text-[11px] font-semibold text-emerald-200">
            100% prático
          </span>
        </div>

        {/* Barras de progresso animadas */}
        <div className="space-y-6">
          {/* Excel Essencial */}
          <div>
            <div className="flex justify-between text-[12px] text-gray-300 mb-1">
              <span>Excel Essencial</span>
              <span>{excelPct}%</span>
            </div>

            <div className="hero-bar-wrapper h-3 rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? "80%" : "0%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="hero-bar-fill hero-bar-fill-green"
              />
            </div>
          </div>

          {/* Dashboards no Excel */}
          <div>
            <div className="flex justify-between text-[12px] text-gray-300 mb-1">
              <span>Dashboards no Excel</span>
              <span>{dashPct}%</span>
            </div>

            <div className="hero-bar-wrapper h-3 rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? "65%" : "0%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="hero-bar-fill hero-bar-fill-blue"
              />
            </div>
          </div>

          {/* Power BI Completo */}
          <div>
            <div className="flex justify-between text-[12px] text-gray-300 mb-1">
              <span>Power BI Completo</span>
              <span>{biPct}%</span>
            </div>

            <div className="hero-bar-wrapper h-3 rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isInView ? "90%" : "0%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="hero-bar-fill hero-bar-fill-emerald"
              />
            </div>
          </div>
        </div>

        {/* Cards inferiores */}
        <div className="mt-8 grid grid-cols-3 gap-5 text-center text-[12px] text-gray-200">
          <div className="rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-4">
            <p className="text-sm font-bold text-emerald-400">+10.000</p>
            <p className="mt-1 text-[11px] text-gray-400">Alunos impactados</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-4">
            <p className="text-sm font-bold text-accent-blue">Ao vivo</p>
            <p className="mt-1 text-[11px] text-gray-400">Aulas online</p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-4">
            <p className="text-sm font-bold text-white">Certificado</p>
            <p className="mt-1 text-[11px] text-gray-400">Reconhecido</p>
          </div>
        </div>
      </div>
    </MotionPanel>
  );
};

// ==========================
// COLUNA ESQUERDA (texto)
// ==========================
const HeroLeft = () => {
  const fullText =
    "Domine Excel e Power BI e leve seus relatórios\npara outro nível.";

  const typedHeading = useTypewriter(fullText, 28);
  const len = typedHeading.length;

  const excelWord = "Excel";
  const powerWord = "Power BI";

  const excelStart = fullText.indexOf(excelWord);
  const excelEnd = excelStart + excelWord.length;
  const powerStart = fullText.indexOf(powerWord);
  const powerEnd = powerStart + powerWord.length;

  const pieces = [];
  const push = (start, end, cls = "") => {
    if (len <= start) return;
    const realEnd = Math.min(end, len);
    if (realEnd <= start) return;
    pieces.push(
      <span key={`${start}-${end}`} className={cls}>
        {fullText.slice(start, realEnd)}
      </span>
    );
  };

  push(0, excelStart);
  push(excelStart, excelEnd, "text-accent-green");
  push(excelEnd, powerStart);
  push(powerStart, powerEnd, "text-accent-green");
  push(powerEnd, fullText.length);

  return (
    <div>
      {/* TAG de destaque (sem typewriter) */}
      <div className="mb-4">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 border border-accent-blue/40 text-[11px] font-semibold tracking-wide text-accent-blue">
          Excel &amp; Power BI focados em resultado
        </span>
      </div>

      {/* TÍTULO com animação de digitação */}
      <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight hero-heading-typewriter">
        {pieces}
      </h1>

      <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-xl">
        A Quallifica Cursos prepara você para o mercado com aulas práticas, ao
        vivo, projetos reais e suporte direto com o professor Ricardo Lins.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="#cursos"
          className="px-5 py-2.5 rounded-lg bg-accent-green text-dark-bg text-sm font-semibold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/25"
        >
          Ver cursos e turmas
        </a>

        <a
          href="#contato"
          className="px-5 py-2.5 rounded-lg border border-accent-blue/60 text-sm font-semibold text-accent-blue hover:bg-accent-blue/10 transition"
        >
          Falar com a Quallifica
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-gray-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-green" />
          <span>Turmas ao vivo e atendimento online</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-blue" />
          <span>Material de apoio e exercícios práticos</span>
        </div>
      </div>
    </div>
  );
};

// ==========================
// HERO PRINCIPAL
// ==========================
const Hero = ({ activeCourseId }) => {
  const [autoIndex, setAutoIndex] = useState(0);

  useEffect(() => {
    if (activeCourseId) return;

    const interval = setInterval(() => {
      setAutoIndex((n) => (n + 1) % UPCOMING_BATCHES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeCourseId]);

  const batch = useMemo(() => {
    if (activeCourseId) {
      return UPCOMING_BATCHES.find((b) => b.id === activeCourseId);
    }
    return UPCOMING_BATCHES[autoIndex];
  }, [activeCourseId, autoIndex]);

  return (
    <section id="home" className="hero-section dark-section pt-16 pb-36">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <HeroLeft />

        <div className="relative flex justify-center md:justify-end">
          <div className="hero-panel-wrapper max-w-[600px] w-full">
            <PanelCard />
            <FloatingBatchBanner batch={batch} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
