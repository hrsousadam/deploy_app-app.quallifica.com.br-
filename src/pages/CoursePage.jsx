// src/pages/CoursePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCoursesData } from "../hooks/useCoursesData";

function hashStringToUint32(str) {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle(arr, seedStr = "seed") {
  const a = Array.isArray(arr) ? [...arr] : [];
  // Deterministic PRNG (LCG) based on seed string
  let seed = hashStringToUint32(String(seedStr || "seed"));
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296; // [0,1)
  };

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CoursePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { courses, loading } = useCoursesData();

  const course = useMemo(() => {
    return Array.isArray(courses) ? courses.find((c) => c.slug === slug) : null;
  }, [courses, slug]);

  const scrollToEnroll = () => {
    const el = document.getElementById("matricula");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ Depoimentos: memo por [course] (evita warning do React Compiler)
  const testimonialsAll = useMemo(() => {
    const list = Array.isArray(course?.testimonials) ? course.testimonials : [];
    return seededShuffle(list, course?.slug || "course");
  }, [course]);

  const [tIndex, setTIndex] = useState(0);

  // ✅ Carrossel: alterna 2 em 2 a cada 6.5s
  useEffect(() => {
    if (!testimonialsAll || testimonialsAll.length <= 2) return;

    const id = setInterval(() => {
      setTIndex((prev) => (prev + 2) % testimonialsAll.length);
    }, 6500);

    return () => clearInterval(id);
  }, [testimonialsAll]);

  const testimonialsToShow = useMemo(() => {
    if (!testimonialsAll || testimonialsAll.length === 0) return [];
    if (testimonialsAll.length <= 2) return testimonialsAll;

    const safeIndex =
      ((tIndex % testimonialsAll.length) + testimonialsAll.length) %
      testimonialsAll.length;

    const a = testimonialsAll[safeIndex];
    const b = testimonialsAll[(safeIndex + 1) % testimonialsAll.length];
    return [a, b].filter(Boolean);
  }, [testimonialsAll, tIndex]);

  // ✅ Checkout: aceita tanto o formato novo (checkoutUrl) quanto os antigos (hotmart/eduzz/kiwify)
  const checkoutUrl =
    course?.checkoutUrl ||
    course?.hotmartUrl ||
    course?.eduzzUrl ||
    course?.kiwifyUrl ||
    "";

  const checkoutLabel = course?.checkoutUrl
    ? "Quero me inscrever agora"
    : course?.hotmartUrl
    ? "Matricular pelo Hotmart"
    : course?.eduzzUrl
    ? "Matricular pelo Eduzz"
    : course?.kiwifyUrl
    ? "Matricular pelo Kiwify"
    : "Quero me inscrever agora";

  // ✅ Normaliza FAQ (suporta {q,a} e {question,answer})
  const faqItems = useMemo(() => {
    const raw = Array.isArray(course?.faq) ? course.faq : [];
    return raw
      .map((it) => ({
        q: (it?.q ?? it?.question ?? "").toString(),
        a: (it?.a ?? it?.answer ?? "").toString(),
      }))
      .filter((x) => x.q.trim() && x.a.trim());
  }, [course]);

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* LOADING */}
      {loading && (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-accent-blue animate-pulse" />
              Carregando curso...
            </div>
          </div>
        </section>
      )}

      {/* NOT FOUND */}
      {!loading && !course && (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold mb-2">
              Curso não encontrado
            </h1>
            <p className="text-slate-300 mb-6">
              Verifique o link ou volte para a página inicial.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg border border-accent-blue/70 text-accent-blue hover:bg-accent-blue/10 text-sm transition"
            >
              Voltar para a página inicial
            </button>
          </div>
        </section>
      )}

      {/* COURSE PAGE */}
      {!loading && course && (
        <>
          {/* HERO / CABEÇALHO DO CURSO */}
          <section className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
              <button
                onClick={() => navigate(-1)}
                className="text-slate-300 hover:text-white transition mb-4 text-sm"
              >
                ← Voltar
              </button>

              {course.flagship && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-accent-green/15 text-accent-green border border-accent-green/60 mb-4 ml-1">
                  Curso principal • indicado para resultados rápidos em empresas
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-semibold mb-3">
                {course.title}
              </h1>

              <p className="text-sm md:text-base text-slate-300 max-w-3xl mb-4">
                {course.shortDescription ||
                  "Descreva em 1–2 frases o objetivo do curso e o resultado esperado."}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] border border-slate-700 bg-slate-900/60 text-slate-200">
                  <span className="text-slate-400">Nível:</span>{" "}
                  {course.level || "—"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] border border-slate-700 bg-slate-900/60 text-slate-200">
                  <span className="text-slate-400">Carga horária:</span>{" "}
                  {course.duration || "—"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] border border-amber-500/40 bg-amber-500/10 text-amber-200">
                  <span className="text-amber-200/80">Próxima turma:</span>{" "}
                  {course.nextClass || "—"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={scrollToEnroll}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent-blue text-dark-bg hover:bg-accent-blue/90 transition shadow-[0_0_30px_rgba(2,132,199,0.35)]"
                >
                  Quero me inscrever agora
                </button>

                <p className="text-[12px] text-slate-400">
                  Acesso completo às aulas + materiais extras. Pagamento seguro
                  via Hotmart / Kiwify / Eduzz.
                </p>
              </div>
            </div>
          </section>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="max-w-6xl mx-auto px-4 mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] items-start">
            {/* Esquerda */}
            <div>
              {/* AUDIÊNCIA */}
              {Array.isArray(course.audience) && course.audience.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-2">
                    Para quem é este curso?
                  </h2>

                  <ul className="space-y-2 text-sm text-slate-200">
                    {course.audience.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent-blue mt-[2px]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* MÓDULOS */}
              {Array.isArray(course.modules) && course.modules.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-2">
                    Módulos do curso
                  </h2>
                  <p className="text-sm text-slate-300 mb-4">
                    Conteúdo organizado para você avançar com clareza e prática.
                  </p>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                    <ol className="space-y-2 text-sm">
                      {course.modules.map((m, idx) => (
                        <li key={idx} className="flex gap-4">
                          <span className="text-slate-500 w-6 text-right">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-slate-200">{m}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* BÔNUS */}
              {Array.isArray(course.bonus) && course.bonus.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-2">
                    Bônus exclusivos para esta turma
                  </h2>
                  <p className="text-sm text-slate-300 mb-4">
                    Além do conteúdo principal, você recebe bônus pensados para
                    acelerar seus resultados.
                  </p>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                    <ul className="space-y-2 text-sm text-slate-200">
                      {course.bonus.map((b, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-accent-green mt-[2px]">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* GARANTIA */}
              {course.guarantee?.title && course.guarantee?.text && (
                <div className="mb-10">
                  <div className="rounded-2xl border border-accent-green/30 bg-accent-green/10 p-6">
                    <h2 className="text-lg font-semibold text-accent-green mb-2">
                      {course.guarantee.title}
                    </h2>
                    <p className="text-sm text-slate-200">
                      {course.guarantee.text}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Direita (matrícula / preço) */}
            <aside className="lg:sticky lg:top-24">
              <div
                id="matricula"
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <p className="text-xs tracking-widest text-accent-blue mb-3">
                  MATRÍCULA
                </p>

                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-300">Investimento</p>
                    <p className="text-3xl font-semibold">
                      {course.price || "—"}
                    </p>
                  </div>
                </div>

                <p className="text-[12px] text-slate-400 mb-5">
                  Pagamento seguro realizado nas plataformas parceiras
                  (Hotmart/Eduzz/Kiwify).
                </p>

                <a
                  href={checkoutUrl || "#"}
                  target={checkoutUrl ? "_blank" : undefined}
                  rel={checkoutUrl ? "noreferrer" : undefined}
                  onClick={(e) => {
                    if (!checkoutUrl) {
                      e.preventDefault();
                      scrollToEnroll();
                    }
                  }}
                  className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm transition
                    ${
                      checkoutUrl
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110"
                        : "bg-accent-blue text-dark-bg hover:bg-accent-blue/90"
                    }
                  `}
                >
                  {checkoutLabel}
                </a>

                <p className="text-[11px] text-slate-500 mt-4">
                  Após a confirmação do pagamento, o acesso ao curso é enviado
                  automaticamente para o e-mail cadastrado na plataforma.
                </p>
              </div>
            </aside>
          </section>

          {/* DEPOIMENTOS (2 por vez, alternando automaticamente) */}
          {testimonialsToShow.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 mt-12">
              <h2 className="text-xl font-semibold mb-2">Depoimentos</h2>
              <p className="text-sm text-slate-300 mb-4">
                Resultados reais de quem aplicou o método.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {testimonialsToShow.map((t, index) => (
                  <div
                    key={`${t?.name || "t"}-${index}-${tIndex}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm shadow-[0_0_30px_rgba(2,132,199,0.12)]"
                  >
                    <p className="text-slate-200 mb-3">
                      &ldquo;{t?.text || ""}&rdquo;
                    </p>
                    <p className="text-[12px] text-slate-200 font-semibold">
                      {t?.name || "Aluno(a)"}
                      <span className="text-slate-500 font-normal">
                        {" "}
                        • {t?.role || "—"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 mt-12">
              <h2 className="text-xl font-semibold mb-4">
                Perguntas frequentes (FAQ)
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {faqItems.map((item, index) => (
                  <details
                    key={`${index}-${item.q.slice(0, 18)}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-slate-100">
                      {item.q}
                    </summary>
                    <p className="text-sm text-slate-300 mt-3">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA FINAL */}
          <section className="max-w-6xl mx-auto px-4 mt-12">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Pronto para dar o próximo passo?
                </h3>
                <p className="text-sm text-slate-300">
                  Entre para a turma e comece a aplicar o método com exercícios,
                  materiais e suporte.
                </p>
              </div>

              <button
                onClick={scrollToEnroll}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent-blue text-dark-bg hover:bg-accent-blue/90 transition"
              >
                Garantir minha vaga
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default CoursePage;
