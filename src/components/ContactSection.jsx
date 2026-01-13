// src/components/ContactSection.jsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ReCAPTCHA from "react-google-recaptcha";

// Países com DDI e bandeira
const COUNTRY_OPTIONS = [
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "US", name: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "ES", name: "Espanha", dial: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Itália", dial: "+39", flag: "🇮🇹" },
];

// Formatação de telefone por país
const formatPhoneByCountry = (countryCode, raw) => {
  const numbers = raw.replace(/\D/g, "");

  switch (countryCode) {
    case "BR":
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 6)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 10)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
          6
        )}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;

    case "US":
      if (numbers.length <= 3) return `(${numbers}`;
      if (numbers.length <= 6)
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
        6
      )}`;

    case "PT":
    case "ES":
    case "IT":
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
        6
      )}`;

    default:
      return numbers;
  }
};

// reCAPTCHA v2 — sua chave pública
const SITE_KEY = "6Lf6vyIsAAAAACNu1dnkHIVlzpgPhwY5aguKU1ke";

const ContactSection = () => {
  // ========= STATES DO FORM =========
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [pais, setPais] = useState("BR");
  const [telefone, setTelefone] = useState("");
  const [telefoneErro, setTelefoneErro] = useState("");

  const [captchaToken, setCaptchaToken] = useState(null);
  const [sending, setSending] = useState(false);
  const [alerta, setAlerta] = useState(null);

  const paisSelecionado =
    COUNTRY_OPTIONS.find((c) => c.code === pais) || COUNTRY_OPTIONS[0];

  // ========= VALIDAÇÕES =========
  const validarTelefone = () => {
    const digits = telefone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setTelefoneErro("Número inválido. Use entre 8 e 15 dígitos.");
      return false;
    }
    setTelefoneErro("");
    return true;
  };

  const limparCampos = () => {
    setNome("");
    setEmail("");
    setAssunto("");
    setMensagem("");
    setPais("BR");
    setTelefone("");
    setTelefoneErro("");
    setCaptchaToken(null);
    // reset reCAPTCHA se existir
    window.grecaptcha?.reset();
  };

  // ========= SUBMIT =========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta(null);

    if (!validarTelefone()) return;

    if (!captchaToken) {
      setAlerta({
        tipo: "erro",
        msg: "Por favor, confirme que você não é um robô.",
      });
      return;
    }

    setSending(true);

    const numeroNumerico = telefone.replace(/\D/g, "");
    const numeroFormatado = formatPhoneByCountry(pais, telefone);
    const numeroCompleto = `${paisSelecionado.dial}${numeroNumerico}`;

    try {
      await addDoc(collection(db, "contatos"), {
        nome,
        email,
        assunto,
        mensagem,
        pais,
        ddi: paisSelecionado.dial,
        telefone: numeroNumerico,
        telefoneFormatado: numeroFormatado,
        telefoneCompleto: numeroCompleto,
        criadoEm: serverTimestamp(),
        respondido: false,
      });

      setAlerta({
        tipo: "sucesso",
        msg: "Mensagem enviada com sucesso! Em breve entraremos em contato.",
      });

      limparCampos();
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      setAlerta({
        tipo: "erro",
        msg: "Não foi possível enviar sua mensagem. Tente novamente.",
      });
    }

    setSending(false);
  };

  // ========= LINKS DE WHATSAPP =========
  const numeroNumerico = telefone.replace(/\D/g, "");
  const numeroCliente =
    numeroNumerico.length > 0
      ? `${paisSelecionado.dial}${numeroNumerico}`
      : null;
  const numeroFormatado = formatPhoneByCountry(pais, telefone);

  const whatsappAdminText = encodeURIComponent(
    `Olá Ricardo, acabei de enviar uma mensagem pelo site da Quallifica.\n\n` +
      `Nome: ${nome || "não informado"}\n` +
      `E-mail: ${email || "não informado"}\n` +
      `Telefone: ${
        numeroCliente ? `${paisSelecionado.dial} ${numeroFormatado}` : "N/A"
      }\n` +
      `Assunto: ${assunto || "não informado"}\n`
  );

  const whatsappAdmin = `https://wa.me/5581999955328?text=${whatsappAdminText}`;
  const whatsappCliente = numeroCliente
    ? `https://wa.me/${numeroCliente}`
    : null;

  // ========= LAYOUT =========
  return (
    <section id="contato" className="dark-section">
      <div className="section-inner max-w-4xl">
        {/* Título */}
        <div className="mb-8 text-center">
          <h2 className="section-title">Entre em contato</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Quer tirar dúvidas sobre os cursos, turmas ou condições especiais
            para empresas? Envie uma mensagem e retornaremos o mais rápido
            possível.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-slate-950/80 border border-slate-700 rounded-2xl shadow-2xl p-5 md:p-8">
          {/* Alerta */}
          {alerta && (
            <div
              className={`mb-5 px-4 py-3 rounded-lg text-sm ${
                alerta.tipo === "sucesso"
                  ? "bg-emerald-900/40 border border-emerald-500 text-emerald-200"
                  : "bg-red-900/40 border border-red-500 text-red-200"
              }`}
            >
              {alerta.msg}

              {/* Ações rápidas após sucesso */}
              {alerta.tipo === "sucesso" && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={whatsappAdmin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-md bg-accent-green text-dark-bg text-xs font-semibold hover:bg-emerald-400 transition"
                  >
                    Continuar atendimento pelo WhatsApp
                  </a>

                  {whatsappCliente && (
                    <a
                      href={whatsappCliente}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-semibold hover:bg-blue-500 transition"
                    >
                      Chamar o cliente
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome + Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  placeholder="voce@exemplo.com"
                />
              </div>
            </div>

            {/* País + Telefone */}
            <div className="grid md:grid-cols-[1.1fr,1.9fr] gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  País
                </label>
                <div className="relative">
                  <select
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    className="w-full appearance-none rounded-lg bg-slate-900 border border-slate-700 pl-3 pr-8 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-2.5 text-xs text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Telefone (com DDD)
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-gray-300">
                    {paisSelecionado.dial}
                  </span>
                  <input
                    type="text"
                    required
                    value={formatPhoneByCountry(pais, telefone)}
                    onChange={(e) => {
                      setTelefone(e.target.value.replace(/\D/g, ""));
                      if (telefoneErro) validarTelefone();
                    }}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    placeholder={
                      pais === "BR"
                        ? "(81) 99999-8888"
                        : pais === "US"
                        ? "(407) 555-1234"
                        : "912 345 678"
                    }
                  />
                </div>
                {telefoneErro && (
                  <p className="text-xs text-red-400 mt-1">{telefoneErro}</p>
                )}
              </div>
            </div>

            {/* Assunto */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Assunto
              </label>
              <input
                type="text"
                required
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Ex: Dúvidas sobre o curso de Power BI"
              />
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Mensagem
              </label>
              <textarea
                required
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                placeholder="Conte um pouco sobre sua necessidade ou dúvida."
              />
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center pt-1 pb-2">
              <ReCAPTCHA
                sitekey={SITE_KEY}
                theme="dark"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-lg bg-accent-green text-dark-bg font-semibold text-sm hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Enviando..." : "Enviar mensagem"}
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-2">
              Seus dados são usados apenas para retorno do contato. Nada de
              spam.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
