// src/pages/PowerBISalesPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCoursesData } from "../hooks/useCoursesData";

function safeStr(v) {
  return (v ?? "").toString();
}

function getCheckoutUrl(course) {
  if (!course) return "";
  return (
    course.checkoutUrl ||
    course.hotmartUrl ||
    course.kiwifyUrl ||
    course.eduzzUrl ||
    ""
  );
}

function getCheckoutLabel(course) {
  const url = getCheckoutUrl(course);
  if (!url) return "";
  if (/hotmart/i.test(url) || course?.hotmartUrl)
    return "Matricular pelo Hotmart";
  if (/eduzz/i.test(url) || course?.eduzzUrl) return "Matricular pela Eduzz";
  if (/kiwify/i.test(url) || course?.kiwifyUrl) return "Matricular pela Kiwify";
  return "Matricular agora";
}

function normalizeLines(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((x) => safeStr(x)).filter(Boolean);
  // aceita textarea com \n
  return safeStr(raw)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Depoimentos podem vir como:
// - array de objetos: { name, role, text }
// - array de strings no formato "Nome | Cargo | Texto"
function normalizeTestimonials(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((t) => {
        if (!t) return null;
        if (typeof t === "object") {
          const name = safeStr(t.name || t.nome);
          const role = safeStr(t.role || t.cargo);
          const text = safeStr(t.text || t.depoimento);
          if (!name && !text) return null;
          return { name, role, text };
        }
        const s = safeStr(t);
        const parts = s.split("|").map((p) => p.trim());
        if (parts.length >= 3) {
          return {
            name: parts[0],
            role: parts[1],
            text: parts.slice(2).join(" | "),
          };
        }
        return { name: "", role: "", text: s };
      })
      .filter(Boolean);
  }
  return [];
}

// FAQ pode vir como:
// - array de objetos: { q, a } ou { pergunta, resposta }
// - array de strings: "Pergunta | Resposta"
function normalizeFaq(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((f) => {
        if (!f) return null;
        if (typeof f === "object") {
          const q = safeStr(f.q || f.pergunta || f.question);
          const a = safeStr(f.a || f.resposta || f.answer);
          if (!q && !a) return null;
          return { q, a };
        }
        const s = safeStr(f);
        const parts = s.split("|").map((p) => p.trim());
        if (parts.length >= 2)
          return { q: parts[0], a: parts.slice(1).join(" | ") };
        return { q: s, a: "" };
      })
      .filter(Boolean);
  }
  return [];
}

function formatPriceBR(value) {
  const v = safeStr(value).replace(",", ".");
  const num = Number(v);
  if (!Number.isFinite(num)) return safeStr(value);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Pill({ children, tone = "blue" }) {
  const toneClass =
    tone === "gold"
      ? "border-yellow-400/50 text-yellow-200 bg-yellow-500/10"
      : "border-cyan-400/40 text-cyan-100 bg-cyan-500/10";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
        "backdrop-blur-md",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/7">
        <div className="font-semibold text-white/90">{q}</div>
        <div className="text-white/60">{open ? "–" : "+"}</div>
      </div>
      {open && (
        <div className="px-5 pb-4 pt-3 text-sm leading-relaxed text-white/70">
          {a}
        </div>
      )}
    </button>
  );
}

export default function PowerBISalesPage() {
  const navigate = useNavigate();
  const { courses, loading } = useCoursesData();

  // slug fixo dessa página
  const slug = "power-bi-completo";

  const course = useMemo(() => {
    if (!Array.isArray(courses)) return null;
    return courses.find((c) => safeStr(c.slug) === slug) || null;
  }, [courses]);

  const checkoutUrl = getCheckoutUrl(course);
  const checkoutLabel = getCheckoutLabel(course);

  const modules = useMemo(() => normalizeLines(course?.modules), [course]);
  const bonuses = useMemo(() => normalizeLines(course?.bonuses), [course]);
  const whoFor = useMemo(() => normalizeLines(course?.whoFor), [course]);
  const testimonials = useMemo(
    () => normalizeTestimonials(course?.testimonials),
    [course]
  );
  const faq = useMemo(() => normalizeFaq(course?.faq), [course]);

  // mostrar 2 depoimentos (se houver)
  const testimonialsToShow = useMemo(
    () => testimonials.slice(0, 2),
    [testimonials]
  );

  const title = safeStr(course?.title || "Power BI Completo para Negócios");
  const desc =
    safeStr(course?.description) ||
    "Domine Power BI do zero ao dashboard profissional: modelagem, DAX, visuais e publicação com foco em resultado.";

  const level = safeStr(course?.level || "Todos os níveis");
  const duration = safeStr(course?.duration || "—");
  const nextClass = safeStr(course?.nextClass || "—");
  const price = course?.price ? formatPriceBR(course?.price) : "";

  const scrollToEnroll = () => {
    const el = document.getElementById("matricula");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 text-white/70">
        Carregando…
      </div>
    );
  }

  // se ainda não existe no Firestore, mostra fallback sem quebrar
  if (!course) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 text-white/80">
        <h1 className="text-3xl font-bold text-white">
          Página de Vendas — Power BI Completo
        </h1>
        <p className="mt-3 text-white/70">
          Não encontrei o curso com slug{" "}
          <b className="text-white">power-bi-completo</b> no Firestore.
        </p>
        <button
          className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
          onClick={() => navigate("/admin/cursos")}
        >
          Ir para Admin e criar/ajustar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-white/60 hover:text-white/80"
        >
          ← Voltar
        </button>

        {/* HERO */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">{desc}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {level && <Pill>{`Nível: ${level}`}</Pill>}
              {duration && <Pill>{`Carga horária: ${duration}`}</Pill>}
              {nextClass && (
                <Pill tone="gold">{`Próxima turma: ${nextClass}`}</Pill>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToEnroll}
                className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-black shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                Quero me inscrever agora
              </button>
              <div className="text-sm text-white/55">
                Acesso completo às aulas + materiais extras. Pagamento seguro
                via Hotmart / Kiwify / Eduzz.
              </div>
            </div>
          </div>

          {/* CARD MATRÍCULA */}
          <Card className="p-6">
            <div
              id="matricula"
              className="text-xs tracking-widest text-cyan-200/80"
            >
              MATRÍCULA
            </div>
            <div className="mt-3 text-sm text-white/60">Investimento</div>
            <div className="mt-1 text-4xl font-extrabold text-white">
              {price || "—"}
            </div>

            <div className="mt-2 text-xs text-white/55">
              Pagamento seguro realizado nas plataformas parceiras
              (Hotmart/Eduzz/Kiwify).
            </div>

            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 block w-full rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 px-4 py-3 text-center font-bold text-black transition hover:brightness-110"
              >
                {checkoutLabel || "Matricular agora"}
              </a>
            ) : (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                Configure o link de checkout no Admin para liberar o botão de
                matrícula.
              </div>
            )}
          </Card>
        </div>

        {/* PARA QUEM É */}
        {whoFor.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white">
              Para quem é este curso?
            </h2>
            <p className="mt-2 text-white/60">
              Se você se identifica com algum item abaixo, esse curso é para
              você.
            </p>
            <Card className="mt-4 p-6">
              <ul className="space-y-2 text-white/75">
                {whoFor.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400/80" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* MÓDULOS + BÔNUS */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white">Módulos do curso</h2>
            <p className="mt-2 text-white/60">
              Conteúdo organizado para você avançar com clareza e prática.
            </p>
            <Card className="mt-4 p-6">
              {modules.length > 0 ? (
                <ol className="space-y-2 text-white/75">
                  {modules.map((m, i) => (
                    <li key={i} className="grid grid-cols-[28px_1fr] gap-3">
                      <span className="text-white/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-white/85">{m}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-white/60">
                  Preencha os módulos no Admin.
                </div>
              )}
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Bônus exclusivos para esta turma
            </h2>
            <p className="mt-2 text-white/60">
              Além do conteúdo principal, você recebe bônus pensados para
              acelerar seus resultados.
            </p>
            <Card className="mt-4 p-6">
              {bonuses.length > 0 ? (
                <ul className="space-y-2 text-white/75">
                  {bonuses.map((b, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400/80" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-white/60">Preencha os bônus no Admin.</div>
              )}
            </Card>
          </div>
        </div>

        {/* DEPOIMENTOS (2) */}
        {testimonialsToShow.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white">Depoimentos</h2>
            <p className="mt-2 text-white/60">
              Resultados reais de quem aplicou o método.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {testimonialsToShow.map((t, i) => (
                <Card key={i} className="p-6">
                  <div className="text-white/80">“{safeStr(t.text)}”</div>
                  <div className="mt-4 text-sm font-semibold text-white">
                    {safeStr(t.name || "Aluno(a)")}
                    {t.role ? (
                      <span className="ml-2 text-xs font-normal text-white/50">
                        • {safeStr(t.role)}
                      </span>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ — UM ABAIXO DO OUTRO */}
        {faq.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white">
              Perguntas frequentes (FAQ)
            </h2>
            <div className="mt-5 space-y-3">
              {faq.map((f, i) => (
                <AccordionItem key={i} q={safeStr(f.q)} a={safeStr(f.a)} />
              ))}
            </div>
          </div>
        )}

        {/* CTA FINAL */}
        <Card className="mt-12 p-6">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-xl font-bold text-white">
                Pronto para dar o próximo passo?
              </div>
              <div className="mt-1 text-white/65">
                Em poucas semanas você pode estar aplicando o método com
                confiança e gerando impacto real.
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToEnroll}
              className="rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
            >
              Quero garantir minha vaga
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
