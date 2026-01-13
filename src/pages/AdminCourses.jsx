import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase";

// ------------------------- helpers -------------------------
const provider = new GoogleAuthProvider();

function parseLines(text) {
  return String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function linesToText(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

function parseTestimonials(text) {
  // formato: Nome | Cargo | Texto
  return parseLines(text)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const [name, role, ...rest] = parts;
      return {
        name: name || "Aluno(a)",
        role: role || "",
        text: rest.join(" | ").trim() || "",
      };
    })
    .filter((t) => t.text);
}

function testimonialsToText(arr) {
  if (!Array.isArray(arr)) return "";
  return arr
    .map((t) =>
      `${t?.name || "Aluno(a)"} | ${t?.role || ""} | ${t?.text || ""}`.trim()
    )
    .join("\n");
}

function parseFaq(text) {
  // formato: Pergunta | Resposta
  return parseLines(text)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const question = parts[0] || "";
      const answer = parts.slice(1).join(" | ").trim();
      return { question, answer };
    })
    .filter((f) => f.question && f.answer);
}

function faqToText(arr) {
  if (!Array.isArray(arr)) return "";
  return arr
    .map((f) => `${f?.question || ""} | ${f?.answer || ""}`.trim())
    .join("\n");
}

function safeStr(v) {
  return (v ?? "").toString();
}

function slugHints(slug = "") {
  const s = slug.toLowerCase();
  return {
    isPowerBI: s.includes("power") || s.includes("bi"),
    isFinance: s.includes("financ") || s.includes("gest"),
    isAdvanced:
      s.includes("avanc") || s.includes("empresa") || s.includes("pro"),
    isEssencial:
      s.includes("essenc") || s.includes("basico") || s.includes("dia-a-dia"),
    isHome: s.includes("donas") || s.includes("casa") || s.includes("lar"),
  };
}

/**
 * Gera um "pack" de conteúdo baseado no slug + nível.
 * Observação: não usamos Math.random aqui (evita warnings/regras de pureza).
 */
function generateCoursePack({ slug, level }) {
  const hints = slugHints(slug);
  const lvl = (level || "").toLowerCase();

  // prefixo "_" evita no-unused-vars caso você queira usar depois
  const _persona = hints.isPowerBI
    ? "Power BI"
    : hints.isFinance
    ? "Excel (Finanças)"
    : "Excel";

  const shortDescription = hints.isPowerBI
    ? "Do zero ao dashboard profissional: conexão de dados, modelagem, DAX e publicação de relatórios."
    : hints.isFinance
    ? "Controle financeiro com Excel: fluxo de caixa, projeções, indicadores e modelos prontos para o dia a dia."
    : hints.isHome
    ? "Curso voltado para donas de casa poderem organizar finanças e tarefas com planilhas simples e práticas."
    : hints.isAdvanced || lvl.includes("avanç")
    ? "Domine recursos avançados e crie planilhas profissionais para tomada de decisão e produtividade."
    : "Aprenda fórmulas, formatações, filtros e gráficos básicos para trabalhar com planilhas com segurança.";

  const audience = hints.isPowerBI
    ? [
        "Profissionais que querem criar dashboards e relatórios profissionais.",
        "Quem precisa automatizar análises e entregar resultados com clareza.",
        "Pessoas que querem entrar no mercado de BI e dados.",
      ]
    : hints.isHome
    ? [
        "Donas de casa que querem organizar gastos e planejamento do mês.",
        "Quem busca uma rotina financeira mais simples e previsível.",
        "Iniciantes que querem aprender Excel com exemplos do dia a dia.",
      ]
    : hints.isFinance
    ? [
        "Profissionais e empreendedores que precisam controlar finanças com Excel.",
        "Quem quer montar indicadores (KPI) e projeções com segurança.",
        "Pessoas que querem sair do “achismo” e ter números claros.",
      ]
    : [
        "Profissionais que usam Excel e querem parar de “apanhar” da ferramenta.",
        "Pessoas que desejam se preparar para vagas administrativas e analíticas.",
        "Estudantes e iniciantes que precisam de uma base sólida e prática.",
      ];

  const modules = hints.isPowerBI
    ? [
        "Introdução ao Power BI e visão geral do curso",
        "Conexão e tratamento de dados (Power Query)",
        "Modelagem de dados e relacionamento entre tabelas",
        "Medidas e DAX na prática (KPI, indicadores, tempo)",
        "Design de dashboards (layout, visualização, storytelling)",
        "Publicação e compartilhamento (serviço, permissões, atualização)",
      ]
    : hints.isAdvanced
    ? [
        "Revisão estratégica dos fundamentos para avançar com segurança",
        "Funções avançadas: PROCX/XLOOKUP, ÍNDICE, CORRESP, SE, SOMASES e mais",
        "Tabelas dinâmicas avançadas, segmentações e painéis dinâmicos",
        "Estruturação de dashboards executivos dentro do Excel",
        "Validação de dados, formulários, proteções e automações simples",
        "Projeto final: dashboard completo com indicadores",
      ]
    : hints.isHome
    ? [
        "Introdução e visão geral do curso",
        "Fundamentos essenciais (formatação, atalhos, organização)",
        "Planilha de gastos do mês (do zero)",
        "Controle de compras e lista inteligente",
        "Planejamento do mês e metas",
      ]
    : [
        "Introdução ao Excel, interface e atalhos principais",
        "Formatações básicas, estilos e boas práticas",
        "Fórmulas essenciais: SOMA, MÉDIA, MÍN, MÁX, CONT.SES",
        "Listas, filtros e ordenação de dados",
        "Gráficos básicos para apresentação de informações",
        "Projeto prático: planilha aplicada ao dia a dia",
      ];

  const bonus = hints.isPowerBI
    ? [
        "Pacote de temas visuais para Power BI para deixar seus relatórios mais profissionais.",
        "Modelo de dashboard executivo pronto para adaptação.",
        "Aula bônus: como apresentar dashboards em reuniões e gerar impacto na diretoria.",
      ]
    : [
        "Modelo de dashboard executivo em Excel pronto para adaptação.",
        "Planilha de controle de indicadores (KPI) para empresas.",
        "Acesso a uma aula bônus de produtividade com atalhos avançados.",
      ];

  const testimonials = hints.isHome
    ? [
        {
          name: "Mariana Lima",
          role: "Organização doméstica",
          text: "Eu achava Excel impossível. Agora consigo organizar as contas do mês e planejar compras sem estresse.",
        },
        {
          name: "Carlos Eduardo",
          role: "Pai de família",
          text: "O controle de gastos que montei no curso virou rotina aqui em casa. Ficou tudo claro e fácil de acompanhar.",
        },
        {
          name: "Patrícia Gomes",
          role: "Autônoma",
          text: "Aprendi o básico com prática. Em poucos dias já estava usando planilha para organizar rotina e finanças.",
        },
      ]
    : [
        {
          name: "Ana Paula Souza",
          role: "Analista Financeira",
          text: "Depois do curso, consegui montar um dashboard financeiro que o meu diretor começou a usar em todas as reuniões.",
        },
        {
          name: "João Henrique",
          role: "Coordenador de Operações",
          text: "Eu já usava Excel há anos, mas hoje consigo responder perguntas da diretoria em minutos.",
        },
        {
          name: "Patrícia Gomes",
          role: "Consultora",
          text: "Passei a oferecer relatórios e dashboards como serviço e recuperei o investimento rapidamente.",
        },
      ];

  const faq = hints.isHome
    ? [
        {
          question: "Preciso saber Excel para acompanhar?",
          answer:
            "Não. O curso começa do básico e avança com exemplos do dia a dia.",
        },
        {
          question: "Vou conseguir montar minha planilha de gastos?",
          answer:
            "Sim. Você vai criar uma planilha completa e adaptável à sua casa.",
        },
        {
          question: "Por quanto tempo terei acesso?",
          answer:
            "Você terá acesso ao conteúdo por um período definido na plataforma de checkout.",
        },
        {
          question: "Recebo certificado?",
          answer:
            "Sim, após concluir o curso você recebe certificado de conclusão.",
        },
      ]
    : [
        {
          question: "Preciso já saber Excel para acompanhar o curso?",
          answer:
            "É recomendado ter uma base intermediária. Se você já usa fórmulas simples e filtros, está pronto.",
        },
        {
          question: "O curso é ao vivo ou gravado?",
          answer:
            "O conteúdo principal é gravado e organizado em módulos. Turmas ao vivo podem existir como bônus.",
        },
        {
          question: "Por quanto tempo terei acesso ao curso?",
          answer:
            "Você terá acesso conforme as regras da plataforma de pagamento utilizada (Hotmart/Eduzz/Kiwify).",
        },
        {
          question: "Recebo certificado de conclusão?",
          answer:
            "Sim. Ao finalizar o curso, você recebe um certificado de conclusão.",
        },
      ];

  const guarantee = {
    title: "Garantia incondicional de 7 dias",
    text: "Teste o curso por 7 dias. Se não fizer sentido para você, basta solicitar o reembolso dentro do prazo e receber seu dinheiro de volta.",
  };

  return {
    shortDescription,
    audience,
    modules,
    bonus,
    testimonials,
    faq,
    guarantee,
    checkoutUrl: "", // Ricardo preenche (Hotmart/Eduzz/Kiwify)
  };
}

// ------------------------- component -------------------------
export default function AdminCourses() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [newCourseSlug, setNewCourseSlug] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");

  const fetchCourses = async () => {
    const snap = await getDocs(collection(db, "courses"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => safeStr(a.title).localeCompare(safeStr(b.title)));
    setCourses(list);
  };

  // ✅ Correção: não chamamos fetchCourses "direto" no body do effect;
  // chamamos dentro do callback do onAuthStateChanged.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      const nextUser = u || null;
      setUser(nextUser);

      if (nextUser) {
        await fetchCourses();
      } else {
        setCourses([]);
      }
    });

    return () => unsub();
  }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => {
      const t = safeStr(c.title).toLowerCase();
      const s = safeStr(c.slug).toLowerCase();
      return t.includes(q) || s.includes(q);
    });
  }, [courses, search]);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const createCourse = async () => {
    const slug = safeStr(newCourseSlug).trim();
    const title = safeStr(newCourseTitle).trim();
    if (!slug || !title) return;

    const base = {
      slug,
      title,
      level: "Iniciante",
      duration: "8h",
      nextClass: "Turma em formação",
      price: "0,00",
      shortDescription: "",
      audience: [],
      modules: [],
      bonus: [],
      testimonials: [],
      faq: [],
      guarantee: { title: "", text: "" },
      checkoutUrl: "",
    };

    await setDoc(doc(db, "courses", slug), base, { merge: true });

    setNewCourseSlug("");
    setNewCourseTitle("");
    await fetchCourses();
  };

  const deleteCourse = async (slug) => {
    if (!slug) return;
    await deleteDoc(doc(db, "courses", slug));
    await fetchCourses();
  };

  const saveCourse = async (slug, data) => {
    if (!slug) return;
    await setDoc(doc(db, "courses", slug), data, { merge: true });
    await fetchCourses();
  };

  const generateFull = async (c) => {
    const pack = generateCoursePack({
      slug: c.slug,
      level: c.level,
    });

    // só preenche o que estiver vazio (não sobrescreve o que Ricardo já editou)
    const merged = {
      ...c,
      shortDescription: c.shortDescription || pack.shortDescription,
      audience:
        Array.isArray(c.audience) && c.audience.length
          ? c.audience
          : pack.audience,
      modules:
        Array.isArray(c.modules) && c.modules.length ? c.modules : pack.modules,
      bonus: Array.isArray(c.bonus) && c.bonus.length ? c.bonus : pack.bonus,
      testimonials:
        Array.isArray(c.testimonials) && c.testimonials.length
          ? c.testimonials
          : pack.testimonials,
      faq: Array.isArray(c.faq) && c.faq.length ? c.faq : pack.faq,
      guarantee:
        c.guarantee?.title || c.guarantee?.text ? c.guarantee : pack.guarantee,
      checkoutUrl: c.checkoutUrl || pack.checkoutUrl,
    };

    await saveCourse(c.slug, merged);
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h2 className="text-2xl font-extrabold text-white">Admin</h2>
          <p className="mt-2 text-white/70">
            Faça login para gerenciar os cursos.
          </p>
          <button
            onClick={handleLogin}
            className="mt-5 w-full rounded-xl bg-sky-500/90 px-4 py-3 font-semibold text-white hover:bg-sky-500"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin • Cursos</h1>
          <p className="text-white/60 text-sm">
            Gerencie cursos e conteúdo completo (Fase 2).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título ou slug..."
            className="w-full md:w-[320px] rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none placeholder:text-white/30"
          />
          <button
            onClick={handleLogout}
            className="rounded-xl bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Create course */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-white">Criar novo curso</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={newCourseSlug}
            onChange={(e) => setNewCourseSlug(e.target.value)}
            placeholder="slug (ex: excel-donas-de-casa)"
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white outline-none placeholder:text-white/30"
          />
          <input
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            placeholder="Título do curso"
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-white outline-none placeholder:text-white/30"
          />
          <button
            onClick={createCourse}
            className="rounded-xl bg-sky-500/90 px-4 py-2 font-semibold text-white hover:bg-sky-500"
          >
            Criar curso
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((c) => (
          <CourseEditor
            key={c.slug}
            course={c}
            onSave={(data) => saveCourse(c.slug, data)}
            onDelete={() => deleteCourse(c.slug)}
            onGenerate={() => generateFull(c)}
          />
        ))}
      </div>
    </div>
  );
}

// ------------------------- editor card -------------------------
function CourseEditor({ course, onSave, onDelete, onGenerate }) {
  const [local, setLocal] = useState(course);

  useEffect(() => {
    setLocal(course);
  }, [course]);

  const setField = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const guaranteeTitle = local?.guarantee?.title || "";
  const guaranteeText = local?.guarantee?.text || "";

  const audienceText = linesToText(local.audience);
  const modulesText = linesToText(local.modules);
  const bonusText = linesToText(local.bonus);

  const testimonialsText = testimonialsToText(local.testimonials);
  const faqText = faqToText(local.faq);

  const save = () => {
    const payload = {
      ...local,
      slug: safeStr(local.slug).trim(),
      title: safeStr(local.title).trim(),
      level: safeStr(local.level).trim(),
      duration: safeStr(local.duration).trim(),
      nextClass: safeStr(local.nextClass).trim(),
      price: safeStr(local.price).trim(),
      shortDescription: safeStr(local.shortDescription).trim(),
      checkoutUrl: safeStr(local.checkoutUrl).trim(),
      audience: parseLines(audienceText),
      modules: parseLines(modulesText),
      bonus: parseLines(bonusText),
      testimonials: parseTestimonials(testimonialsText),
      faq: parseFaq(faqText),
      guarantee: {
        title: safeStr(guaranteeTitle).trim(),
        text: safeStr(guaranteeText).trim(),
      },
    };

    onSave(payload);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-white">{local.title}</h3>
          <p className="text-xs text-white/50">slug: {local.slug}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onGenerate}
            className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-50 hover:bg-emerald-500/30"
            title="Preenche automaticamente campos vazios com uma estrutura completa"
          >
            Gerar estrutura completa
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-50 hover:bg-red-500/30"
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Basic */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60">Título</label>
          <input
            value={local.title || ""}
            onChange={(e) => setField("title", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Nível</label>
          <input
            value={local.level || ""}
            onChange={(e) => setField("level", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Carga horária</label>
          <input
            value={local.duration || ""}
            onChange={(e) => setField("duration", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Próxima turma</label>
          <input
            value={local.nextClass || ""}
            onChange={(e) => setField("nextClass", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Preço (ex: 297,00)</label>
          <input
            value={local.price || ""}
            onChange={(e) => setField("price", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">
            Checkout URL (Hotmart/Eduzz/Kiwify)
          </label>
          <input
            value={local.checkoutUrl || ""}
            onChange={(e) => setField("checkoutUrl", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            placeholder="https://pay.hotmart.com/..."
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="text-xs text-white/60">
          Descrição curta (1–2 frases)
        </label>
        <textarea
          value={local.shortDescription || ""}
          onChange={(e) => setField("shortDescription", e.target.value)}
          className="mt-1 w-full min-h-[70px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
        />
      </div>

      {/* Audience + Modules + Bonus */}
      <div className="mt-4 grid grid-cols-1 gap-4">
        <div>
          <label className="text-xs text-white/60">
            Para quem é (1 por linha)
          </label>
          <textarea
            value={audienceText}
            onChange={(e) => setField("audience", parseLines(e.target.value))}
            className="mt-1 w-full min-h-[90px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Módulos (1 por linha)</label>
          <textarea
            value={modulesText}
            onChange={(e) => setField("modules", parseLines(e.target.value))}
            className="mt-1 w-full min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Bônus (1 por linha)</label>
          <textarea
            value={bonusText}
            onChange={(e) => setField("bonus", parseLines(e.target.value))}
            className="mt-1 w-full min-h-[90px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-4">
        <label className="text-xs text-white/60">
          Depoimentos (1 por linha) — formato:{" "}
          <span className="text-white/80">Nome | Cargo | Texto</span>
        </label>
        <textarea
          value={testimonialsText}
          onChange={(e) =>
            setField("testimonials", parseTestimonials(e.target.value))
          }
          className="mt-1 w-full min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
        />
        <p className="mt-1 text-xs text-white/40">
          (No site aparecem 2 por vez em carrossel automaticamente.)
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-4">
        <label className="text-xs text-white/60">
          FAQ (1 por linha) — formato:{" "}
          <span className="text-white/80">Pergunta | Resposta</span>
        </label>
        <textarea
          value={faqText}
          onChange={(e) => setField("faq", parseFaq(e.target.value))}
          className="mt-1 w-full min-h-[120px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
        />
      </div>

      {/* Guarantee */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/60">Garantia — título</label>
          <input
            value={guaranteeTitle}
            onChange={(e) =>
              setField("guarantee", {
                ...(local.guarantee || {}),
                title: e.target.value,
              })
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Garantia — texto</label>
          <input
            value={guaranteeText}
            onChange={(e) =>
              setField("guarantee", {
                ...(local.guarantee || {}),
                text: e.target.value,
              })
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>
      </div>

      <button
        onClick={save}
        className="mt-5 w-full rounded-xl bg-sky-500/90 px-4 py-3 font-semibold text-white hover:bg-sky-500"
      >
        Salvar alterações
      </button>
    </div>
  );
}
