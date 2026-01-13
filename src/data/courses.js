// src/data/courses.js

export const courses = [
  {
    slug: "excel-essencial-dia-a-dia",
    title: "Excel Essencial para o Dia a Dia",
    shortDescription:
      "Aprenda fórmulas, formatações, filtros, gráficos básicos e as principais funções para trabalhar com planilhas com segurança.",
    level: "Iniciante",
    duration: "8h",
    nextClass: "Janeiro/2026",
    highlight: false, // não mostra "Mais procurado"
    flagship: false, // não é página de vendas longa

    price: "R$ 197,00",
    modules: [
      "Introdução ao Excel, interface e atalhos principais",
      "Formatações básicas, estilos e boas práticas",
      "Fórmulas essenciais: SOMA, MÉDIA, MÍN, MÁX, CONT.SES",
      "Listas, filtros e ordenação de dados",
      "Gráficos básicos para apresentação de informações",
      "Projeto prático: planilha de controle financeiro simples",
    ],
    audience: [
      "Profissionais que usam o Excel de forma básica e querem parar de “apanhar” da ferramenta.",
      "Pessoas que desejam se preparar para vagas administrativas e analíticas.",
      "Estudantes e iniciantes que precisam de uma base sólida e prática.",
    ],
    bonus: [],
    testimonials: [],
    faq: [],
    guarantee: null,

    hotmartUrl: "https://seu-link-hotmart.com/excel-essencial",
    eduzzUrl: "",
    kiwifyUrl: "",
  },

  // ⭐ Curso principal de Excel Avançado para empresas
  {
    slug: "excel-avancado-empresas",
    title: "Excel Avançado para Empresas",
    shortDescription:
      "Domine recursos avançados do Excel e crie dashboards profissionais para tomada de decisão nas empresas.",
    level: "Intermediário / Avançado",
    duration: "16h",
    nextClass: "Fevereiro/2026",
    highlight: true,
    flagship: true, // página de vendas longa

    price: "R$ 297,00",
    modules: [
      "Revisão estratégica dos fundamentos para avançar com segurança.",
      "Funções avançadas: PROCV/XLOOKUP, ÍNDICE, CORRESP, SE, SOMASES e mais.",
      "Tabelas dinâmicas avançadas, segmentações e painéis dinâmicos.",
      "Estruturação de dashboards executivos dentro do Excel.",
      "Validação de dados, formulários, proteções e automações simples.",
      "Projeto final: dashboard completo com indicadores da empresa.",
    ],
    audience: [
      "Analistas, coordenadores e gestores que precisam apresentar resultados com clareza.",
      "Profissionais de finanças, controladoria e planejamento que trabalham diariamente com Excel.",
      "Quem já usa Excel no nível intermediário e quer dar o salto para um uso realmente profissional.",
    ],
    bonus: [
      "Modelo de dashboard executivo em Excel pronto para adaptação.",
      "Planilha de controle de indicadores (KPI) para empresas.",
      "Acesso a uma aula bônus de produtividade com atalhos avançados.",
    ],
    testimonials: [
      {
        name: "Ana Paula Souza",
        role: "Analista Financeira",
        text: "Depois do curso, consegui montar um dashboard financeiro que o meu diretor começou a usar em todas as reuniões. Foi um divisor de águas na empresa.",
      },
      {
        name: "João Henrique",
        role: "Coordenador de Operações",
        text: "Eu já usava Excel há anos, mas nunca tinha entendido tão bem PROCV, SOMASES e tabelas dinâmicas. Hoje consigo responder perguntas da diretoria em minutos.",
      },
    ],
    faq: [
      {
        question: "Preciso já saber Excel para acompanhar o curso?",
        answer:
          "É recomendado que você tenha uma base intermediária de Excel (saber fórmulas simples, filtros e formatações). Não precisa ser avançado — isso você vai construir aqui.",
      },
      {
        question: "O curso é ao vivo ou gravado?",
        answer:
          "O conteúdo principal é gravado em módulos organizados, para você assistir no seu ritmo. Algumas turmas contam com encontros ao vivo de tira-dúvidas, dependendo da edição.",
      },
      {
        question: "Por quanto tempo terei acesso ao curso?",
        answer:
          "Você terá acesso ao conteúdo gravado por pelo menos 12 meses após a matrícula, podendo ser estendido em novas turmas e atualizações.",
      },
      {
        question: "Recebo certificado de conclusão?",
        answer:
          "Sim. Ao concluir todas as aulas e o projeto final, você poderá emitir seu certificado de participação com carga horária indicada.",
      },
    ],
    guarantee: {
      title: "Garantia incondicional de 7 dias",
      text: "Você pode se inscrever, assistir às primeiras aulas e, se entender que o curso não é para você, basta solicitar o reembolso em até 7 dias. Simples assim, sem letras miúdas.",
    },

    hotmartUrl: "https://seu-link-hotmart.com/excel-avancado-empresas",
    eduzzUrl: "",
    kiwifyUrl: "",
  },

  // ⭐ Curso principal de Power BI
  {
    slug: "power-bi-completo",
    title: "Power BI Completo para Negócios",
    shortDescription:
      "Do zero ao dashboard profissional: conexão de dados, tratamento, modelagem, DAX e publicação de relatórios para empresas.",
    level: "Intermediário",
    duration: "20h",
    nextClass: "Turma em formação",
    highlight: true,
    flagship: true, // página de vendas longa

    price: "R$ 347,00",
    modules: [
      "Fundamentos de BI e visão estratégica do Power BI nas empresas.",
      "Conexão com diferentes fontes de dados (Excel, CSV, sistemas, bancos).",
      "Transformação de dados com Power Query, limpeza e padronização.",
      "Modelagem de dados, relacionamentos e boas práticas de desempenho.",
      "Criação de medidas DAX essenciais para análise de indicadores.",
      "Construção de dashboards interativos, publicação e compartilhamento.",
    ],
    audience: [
      "Analistas que querem dar o próximo passo e migrar do Excel para o Power BI.",
      "Profissionais que precisam criar relatórios gerenciais e dashboards para diretoria.",
      "Empreendedores e consultores que querem oferecer dashboards como serviço.",
    ],
    bonus: [
      "Pacote de temas visuais para Power BI para deixar seus relatórios mais profissionais.",
      "Modelo de dashboard executivo pronto para adaptar aos dados da sua empresa.",
      "Aula bônus: como apresentar dashboards em reuniões e gerar impacto na diretoria.",
    ],
    testimonials: [
      {
        name: "Mariana Lima",
        role: "Business Analyst",
        text: "Eu não tinha experiência com Power BI e hoje consigo montar relatórios completos para a diretoria. Já até recebi feedback direto do CEO sobre os dashboards.",
      },
      {
        name: "Carlos Eduardo",
        role: "Controller",
        text: "O curso me ajudou a transformar relatórios estáticos em painéis atualizados automaticamente. Economizei horas toda semana.",
      },
      {
        name: "Patrícia Gomes",
        role: "Consultora",
        text: "Passei a oferecer dashboards em Power BI como serviço para meus clientes e recuperei o investimento no curso na primeira consultoria.",
      },
    ],
    faq: [
      {
        question: "Preciso saber DAX antes de entrar no curso?",
        answer:
          "Não. O curso parte do zero em DAX, apresentando as principais funções de forma aplicada, sempre com exemplos voltados para negócios.",
      },
      {
        question: "O curso é adequado para quem usa apenas Excel hoje?",
        answer:
          "Sim. Se você já usa Excel para relatórios, o curso vai te mostrar como levar isso para um outro nível com automação, visualização e atualização automática no Power BI.",
      },
      {
        question: "Vou aprender a publicar e compartilhar dashboards?",
        answer:
          "Sim. Você verá como publicar relatórios no serviço do Power BI e as principais formas de compartilhar insights com sua equipe e liderança.",
      },
      {
        question: "Tenho suporte se tiver dúvidas?",
        answer:
          "Sim. Você poderá enviar dúvidas pela própria plataforma do curso e, dependendo da turma, participar de encontros ao vivo de tira-dúvidas.",
      },
    ],
    guarantee: {
      title: "Garantia de 7 dias, sem risco",
      text: "Teste o curso por 7 dias. Se perceber que não é o momento ou que o conteúdo não faz sentido para você, basta pedir reembolso dentro do prazo e receber seu dinheiro de volta.",
    },

    hotmartUrl: "https://seu-link-hotmart.com/power-bi-completo",
    eduzzUrl: "",
    kiwifyUrl: "",
  },

  {
    slug: "excel-financas-gestao",
    title: "Excel para Finanças e Gestão",
    shortDescription:
      "Fluxo de caixa, projeções, controles financeiros, indicadores e relatórios para tomada de decisão.",
    level: "Intermediário",
    duration: "12h",
    nextClass: "Sob demanda",
    highlight: false,
    flagship: false,

    price: "R$ 267,00",
    modules: [
      "Estruturação de planilhas financeiras profissionais.",
      "Controle de fluxo de caixa e entradas/saídas.",
      "Projeções financeiras e análise de cenários.",
      "Indicadores de desempenho (KPIs) no Excel.",
      "Relatórios gerenciais para tomada de decisão.",
      "Projeto prático: modelo financeiro completo em Excel.",
    ],
    audience: [
      "Profissionais de finanças, controle e gestão que usam Excel no dia a dia.",
      "Empreendedores que precisam organizar o financeiro do negócio.",
      "Consultores que montam modelos e projeções para clientes.",
    ],
    bonus: [],
    testimonials: [],
    faq: [],
    guarantee: null,

    hotmartUrl: "https://seu-link-hotmart.com/excel-financas-gestao",
    eduzzUrl: "",
    kiwifyUrl: "",
  },
];
