// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../firebase";

const PAGE_SIZE = 5;

const formatDateTime = (timestamp) => {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString("pt-BR");
};

const AdminPage = () => {
  // --------- AUTH ---------
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // --------- DADOS ---------
  const [contatos, setContatos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pendente | respondido
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContato, setSelectedContato] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // observar auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // observar contatos
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "contatos"), orderBy("criadoEm", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setContatos(list);
    });

    return () => unsub();
  }, [user]);

  // --------- LOGIN / LOGOUT ---------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      console.error(err);
      setLoginError("Não foi possível entrar. Verifique e-mail e senha.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // --------- STATUS (RESPONDIDO / PENDENTE) ---------
  const handleMarcarRespondido = async (contato) => {
    try {
      setBusyId(contato.id);

      const novoStatus = !contato.respondido;

      // Atualiza no Firestore
      await updateDoc(doc(db, "contatos", contato.id), {
        respondido: novoStatus,
      });

      // Atualiza lista local
      setContatos((prev) =>
        prev.map((c) =>
          c.id === contato.id ? { ...c, respondido: novoStatus } : c
        )
      );

      // Atualiza modal, se estiver aberto
      if (selectedContato && selectedContato.id === contato.id) {
        setSelectedContato((prev) => ({
          ...prev,
          respondido: novoStatus,
        }));
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
    } finally {
      setBusyId(null);
    }
  };

  // --------- EXCLUIR ---------
  const handleExcluir = async (contato) => {
    if (!window.confirm(`Excluir mensagem de ${contato.nome}?`)) return;

    try {
      setBusyId(contato.id);
      await deleteDoc(doc(db, "contatos", contato.id));
      if (selectedContato && selectedContato.id === contato.id) {
        setSelectedContato(null);
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir mensagem.");
    } finally {
      setBusyId(null);
    }
  };

  // --------- FILTRO + PAGINAÇÃO ---------
  const filtered = contatos.filter((c) => {
    const q = search.toLowerCase();

    const matchesSearch =
      c.nome?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.assunto?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "pendente"
        ? !c.respondido
        : c.respondido;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  useEffect(() => {
    if (safePage !== currentPage) setCurrentPage(safePage);
  }, [safePage, currentPage]);

  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  // --------- UI DE CARREGAMENTO / LOGIN ---------
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-300">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Painel Admin – Quallifica
          </h1>
          <p className="text-xs text-gray-400 mb-6 text-center">
            Acesso restrito. Utilize seu e-mail e senha cadastrados no Firebase
            Authentication.
          </p>

          {loginError && (
            <div className="mb-4 text-sm text-red-300 bg-red-900/40 border border-red-500/60 rounded-lg px-3 py-2">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 mb-1 block">E-mail</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="admin@quallifica.com"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 mb-1 block">Senha</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-lg bg-accent-green text-dark-bg font-semibold text-sm hover:bg-emerald-400 transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-[11px] text-gray-500 mt-4 text-center">
            * Usuários são cadastrados diretamente no Firebase Authentication.
          </p>
        </div>
      </div>
    );
  }

  // --------- HELPERS UI ---------
  const renderFlag = (pais) => {
    switch (pais) {
      case "BR":
        return "🇧🇷";
      case "PT":
        return "🇵🇹";
      case "US":
        return "🇺🇸";
      case "ES":
        return "🇪🇸";
      case "IT":
        return "🇮🇹";
      default:
        return "🌐";
    }
  };

  const statusPill = (respondido) =>
    respondido ? (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-900/40 border border-emerald-500/70 text-emerald-200">
        Respondido
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/40 border border-amber-500/70 text-amber-200">
        Pendente
      </span>
    );

  // --------- UI PRINCIPAL ---------
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Linha 1: título + info de login */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-accent-blue uppercase tracking-[0.25em]">
                Painel do Admin
              </p>
              <h1 className="mt-1 text-2xl md:text-3xl font-bold text-white">
                Quallifica Cursos
              </h1>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                Gerencie contatos e cursos enviados pelo site em um só lugar.
              </p>
            </div>

            {/* Lado direito: Admin + login */}
            <div className="flex flex-col items-end gap-2">
              {/* Badge Admin */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/50 text-[11px] font-semibold text-emerald-200">
                Admin
              </div>

              {/* Info login + sair */}
              <div className="text-right space-y-1 text-[11px] text-gray-400">
                <p>Logado como</p>
                <p className="text-sm font-medium text-gray-200 break-all">
                  {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-1 inline-flex items-center px-3 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-red-400 hover:text-red-200 transition"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>

          {/* Linha 2: seleção de área (Contatos / Cursos) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Área atual:</span>
            <div className="inline-flex items-center rounded-full bg-slate-900/90 border border-slate-700 px-1.5 py-1 gap-1 shadow-[0_0_20px_rgba(15,23,42,0.9)]">
              <span className="px-3 py-1 rounded-full bg-accent-blue text-slate-950 text-[11px] font-semibold shadow">
                Contatos
              </span>
              <Link
                to="/admin/cursos"
                className="px-3 py-1 rounded-full text-[11px] font-medium text-gray-300 hover:text-white hover:bg-slate-800 transition"
              >
                Cursos
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros + Busca */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <span>{filtered.length} mensagem(ns) encontrada(s)</span>
            <span className="hidden md:inline-block">•</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-full border text-[11px] ${
                  statusFilter === "all"
                    ? "bg-slate-800 border-slate-500 text-gray-100"
                    : "bg-slate-900 border-slate-700 text-gray-400 hover:bg-slate-800"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => {
                  setStatusFilter("pendente");
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-full border text-[11px] ${
                  statusFilter === "pendente"
                    ? "bg-amber-900/60 border-amber-500/70 text-amber-100"
                    : "bg-slate-900 border-slate-700 text-gray-400 hover:bg-slate-800"
                }`}
              >
                Pendentes
              </button>
              <button
                onClick={() => {
                  setStatusFilter("respondido");
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-full border text-[11px] ${
                  statusFilter === "respondido"
                    ? "bg-emerald-900/60 border-emerald-500/70 text-emerald-100"
                    : "bg-slate-900 border-slate-700 text-gray-400 hover:bg-slate-800"
                }`}
              >
                Respondidos
              </button>
            </div>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nome, e-mail ou assunto..."
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 border-b border-slate-700 text-xs font-semibold text-gray-400 uppercase tracking-wide flex">
            <div className="w-[30%]">Contato</div>
            <div className="w-[30%]">Assunto</div>
            <div className="w-[20%]">Recebido em</div>
            <div className="w-[20%] text-right">Ações</div>
          </div>

          {pageItems.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-400">
              Nenhuma mensagem encontrada.
            </div>
          ) : (
            pageItems.map((c) => {
              const telefoneLabel = c.telefoneFormatado
                ? c.telefoneFormatado
                : c.telefone
                ? c.telefone
                : "—";

              const ddi = c.ddi || "";
              const flag = renderFlag(c.pais);

              const whatsappLink = c.telefoneCompleto
                ? `https://wa.me/${c.telefoneCompleto}`
                : null;

              return (
                <div
                  key={c.id}
                  className="px-4 py-3 border-t border-slate-800/70 text-sm hover:bg-slate-900/80 transition flex"
                >
                  {/* Contato */}
                  <div className="w-[30%] pr-3">
                    <div className="font-semibold text-white flex items-center gap-1">
                      <span>{flag}</span>
                      <span>{c.nome || "Sem nome"}</span>
                    </div>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-accent-blue hover:underline break-all"
                    >
                      {c.email}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {ddi && <span className="mr-1">{ddi}</span>}
                      {telefoneLabel}
                    </p>
                  </div>

                  {/* Assunto + preview */}
                  <div className="w-[30%] pr-3">
                    <p className="font-medium text-gray-100 truncate">
                      {c.assunto || "Sem assunto"}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {c.mensagem || ""}
                    </p>
                  </div>

                  {/* Data + status */}
                  <div className="w-[20%] pr-3 text-xs text-gray-400">
                    <p>{formatDateTime(c.criadoEm)}</p>
                    <p className="mt-1 flex items-center gap-1">
                      {statusPill(c.respondido)}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="w-[20%] flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedContato(c)}
                      className="px-3 py-1 rounded-md text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => handleMarcarRespondido(c)}
                      disabled={busyId === c.id}
                      className={`px-3 py-1 rounded-md text-xs border flex items-center gap-1 ${
                        c.respondido
                          ? "bg-emerald-900/40 text-emerald-200 border-emerald-500/60"
                          : "bg-amber-900/40 text-amber-200 border-amber-500/60 animate-pulse"
                      }`}
                    >
                      {c.respondido ? "Respondido" : "Pendente"}
                    </button>

                    <button
                      onClick={() => handleExcluir(c)}
                      disabled={busyId === c.id}
                      className="px-3 py-1 rounded-md text-xs bg-red-700/90 text-white hover:bg-red-600"
                    >
                      Excluir
                    </button>

                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-md text-xs bg-emerald-700/90 text-white hover:bg-emerald-600"
                        title="Chamar no WhatsApp"
                      >
                        WA
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
            <div>
              Página {safePage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1 rounded-md bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                className="px-3 py-1 rounded-md bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal de detalhes */}
      {selectedContato && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    {renderFlag(selectedContato.pais)}{" "}
                    {selectedContato.nome || "Sem nome"}
                  </h2>
                  {statusPill(selectedContato.respondido)}
                </div>

                <a
                  href={`mailto:${selectedContato.email}`}
                  className="text-xs text-accent-blue hover:underline break-all"
                >
                  {selectedContato.email}
                </a>
              </div>

              <button
                onClick={() => setSelectedContato(null)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Fechar ✕
              </button>
            </div>

            <div className="text-xs text-gray-300 space-y-2 mb-4">
              <p>
                <span className="font-semibold">País:</span>{" "}
                {selectedContato.pais || "-"}{" "}
                {selectedContato.ddi && `(${selectedContato.ddi})`}
              </p>
              <p>
                <span className="font-semibold">Telefone:</span>{" "}
                {selectedContato.telefoneFormatado ||
                  selectedContato.telefone ||
                  "-"}
              </p>
              <p>
                <span className="font-semibold">Recebido em:</span>{" "}
                {formatDateTime(selectedContato.criadoEm)}
              </p>
              <p>
                <span className="font-semibold">Assunto:</span>{" "}
                {selectedContato.assunto || "-"}
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-sm text-gray-100 mb-4 max-h-56 overflow-auto">
              {selectedContato.mensagem || "Sem mensagem."}
            </div>

            <div className="flex flex-wrap justify-between gap-3 text-xs">
              {selectedContato.telefoneCompleto && (
                <a
                  href={`https://wa.me/${selectedContato.telefoneCompleto}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-md bg-emerald-600 text-dark-bg font-semibold hover:bg-emerald-500"
                >
                  Chamar no WhatsApp
                </a>
              )}

              <button
                onClick={() => handleMarcarRespondido(selectedContato)}
                className={`px-4 py-2 rounded-md font-semibold flex items-center gap-1 ${
                  selectedContato.respondido
                    ? "bg-emerald-900/60 text-emerald-200 border border-emerald-500/70"
                    : "bg-amber-900/60 text-amber-200 border border-amber-500/70"
                }`}
              >
                Marcar como{" "}
                {selectedContato.respondido ? "pendente" : "respondido"}
              </button>

              <button
                onClick={() => {
                  handleExcluir(selectedContato);
                }}
                className="px-4 py-2 rounded-md bg-red-700 text-white font-semibold hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
