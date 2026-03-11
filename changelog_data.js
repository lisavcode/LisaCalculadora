const changelogData = [
  {
    version: "1.6.1",
    date: "11/03/2026",
    changes: ["Fix: Travamento ao abrir no celular."],
  },
  {
    version: "1.6.0",
    date: "10/03/2026",
    changes: [
      "Sistema de Acesso: Profissão ativa salva no navegador ao autenticar, corrigindo a aba inicial no seletor de itens das Encomendas.",
      "Encomendas: Corrigido bug onde o picker de itens sempre abria na aba 'Caçador' independente do token utilizado.",
      "Página de Acesso: Novo card de perfil do Discord com avatar animado, banner e botão de contato.",
      "Página de Acesso: Responsividade corrigida em telas menores (mobile).",
    ],
  },
  {
    version: "1.5.2",
    date: "09/03/2026",
    changes: ["Adicionado botão de config para tavernas."],
  },
  {
    version: "1.5.0",
    date: "09/03/2026",
    changes: [
      "Sistema de Taverna aprimorado: agora os itens exibem 'PREÇO BASE' (unitário) e 'TOTAL' (multiplicado pela quantidade global).",
      "Lógica de Promoção Automática: O sistema agora identifica e aplica a tag 'Promoção' e o preço riscado automaticamente se houver um valor promocional definido.",
      "Adição Inteligente ao Carrinho: O botão de adicionar agora respeita a quantidade definida no seletor do topo da página.",
      "Novo Modal de Edição (Lápis): Interface com abas para editar o Preço Base e o Preço de Promoção de forma independente.",
      "Persistência Avançada: Todas as edições de preço e promoções feitas pelo usuário são salvas localmente no navegador.",
      "Correção de Layout (Carrinho): Implementado espaçamento dinâmico no final da página para que o carrinho aberto não cubra os itens da lista.",
    ],
  },
  {
    version: "1.4.1",
    date: "06/03/2026",
    changes: [
      "Correção no Seletor de Produtos (Encomendas): Agora todas as profissões (incluindo Desocupado, Ferreiro e Treinador) estão disponíveis para seleção.",
      "Sincronização de dados: Garantido que novos itens customizados e profissões recentes carreguem corretamente no sistema de pedidos.",
    ],
  },
  {
    version: "1.4.0",
    date: "06/03/2026",
    changes: [
      "Refatoração completa do seletor de profissões no mobile: Novo formato Dropdown estilo lista, mais intuitivo e ágil.",
      "Integração das Configurações no Menu Lateral Global: Acesso unificado tanto em Desktop quanto em Mobile.",
      "Lançamento do Dock Contextual Inteligente: Atalhos dinâmicos no Desktop que mudam conforme a página (Calculadora/Encomendas).",
      "Busca Inteligente aprimorada: Filtro de texto agora se aplica automaticamente à sua seção de Favoritos.",
      "Nova Central de Suporte: Botão 'Entrar em Contato' no Início com modal profissional (Discord/Email).",
      "Novo Portal de Atualizações: Página exclusiva com visual premium e histórico de melhorias do sistema.",
      "Polimento de Interface: Otimização de Z-index, sincronização de cores sistêmicas e limpeza de código malformado.",
    ],
  },
  {
    version: "1.3.4",
    date: "06/03/2026",
    changes: [
      "Criado arquivo oficial de histórico de mudanças (CHANGELOG.md) na raiz do projeto.",
      "Atualizado README.md com informações da versão mais recente e link para o histórico completo.",
      "Corrigidos diversos erros de formatação nos documentos Markdown do projeto.",
    ],
  },
  {
    version: "1.3.3",
    date: "06/03/2026",
    changes: [
      "Menu de categoria no mobile refatorado para um 'Dropdown' estilo lista, agora exibe claramente a seleção atual sem sobrepor tela toda.",
      "Configurações da Calculadora movidas para o Menu Lateral Global, alinhado com outras opções do sistema.",
      "Dock Contextual Inteligente! Agora a barra de atalhos no Desktop muda dinamicamente dependendo da sua página atual.",
      "Melhoria na filtragem de favoritos na Calculadora: A busca por texto agora também filtra seus favoritos ativamente.",
      "Criado botão 'Entrar em Contato' no Menu Início com informações e redes sociais para facilitar o suporte.",
      "Página de 'Atualizações' (Changelog) ganha vida própria no menu lateral esquerdo com visual dedicado.",
    ],
  },
  {
    version: "1.3.2",
    date: "06/03/2026",
    changes: [
      "Restaurada a integridade visual da página inicial após ajustes no sistema de temas.",
    ],
  },
  {
    version: "1.3.1",
    date: "05/03/2026",
    changes: [
      "Adicionado painel de customização de cores mais organizado com categorias expansíveis (Geral, Interface, Botões, Moedas e Eras).",
      "Novo recurso 'Travar/Destravar Categoria': Agora é possível aplicar o bloqueio de matiz (hue) para toda uma categoria de cores clicando no cadeado da mesma.",
      "Adicionado suporte a personalização de cores para os botões (Criar Customizado, Sincronizar) e ícone de Favoritos.",
      "Adicionado suporte a personalização de cores individuais para cada Era (Badges).",
      "Novo controle global de 'Brilho' na área de configuração visual.",
      "O sistema de cores (Hue, Saturação e Brilho) agora é mais responsivo entre todas as telas.",
    ],
  },
  {
    version: "1.3.0",
    date: "05/03/2026",
    changes: [
      "Adicionada nova profissão 'Desocupado' na Calculadora.",
      "Adicionado recurso para recolher e expandir as categorias de itens e sessão de Favoritos, com salvamento automático da sua preferência.",
      "Ajustado o sistema de Favoritos: agora mostra apenas os favoritos correspondentes à aba de profissão selecionada.",
      "Ajustes visuais na sessão de Favoritos, removendo efeitos visuais excessivos (brilho neon) para uma aparência mais clean.",
    ],
  },
  {
    version: "1.2.0",
    date: "04/03/2026",
    changes: [
      "Adicionado funcionalidade de edição de encomendas, permitindo alterar pedidos existentes sem precisar apagá-los.",
      "Estabilizado o visual do modal de Encomendas para manter o tamanho consistente em diferentes resoluções.",
      "Centralizado mensagens e textos do sistema de encomendas no arquivo de configuração global.",
      "Adicionado sistema de favoritar itens.",
      "Ajustado tabela de treinador, para comportar itens sem preço.",
    ],
  },
  {
    version: "1.1.4",
    date: "03/03/2026",
    changes: [
      "Alterado o termo 'Oz' para 'GZ' nas exibições de moedas da Calculadora e Encomendas.",
    ],
  },
  {
    version: "1.1.3",
    date: "03/03/2026",
    changes: [
      "Arrumado bug quando abre a aba de notas de atualização ele congelava a tela.",
    ],
  },
  {
    version: "1.1.2",
    date: "03/03/2026",
    changes: [
      "Adicionado botão 'Notas de Atualização' na aba lateral da ferramenta.",
      "Adicionado alerta de notificação (sino piscando) para avisar de novas mudanças no app.",
      "Ajustados valores incorretos na Calculadora.",
    ],
  },
  {
    version: "1.1.0",
    date: "03/03/2026",
    changes: [
      "Adicionado informações sobre Ingredientes ao colocar o mouse em cima dos itens nas abas Calculadora e Encomendas.",
      "Adicionado tabelas de criadores (Caçador, Alquimista, Minerador, Artesão, Ferreiro, Alfaiate e Treinador).",
      "Removido espaços de sobra do visual dos componentes (cards).",
    ],
  },
  {
    version: "1.0.0",
    date: "Lançamento",
    changes: [
      "Lançamento oficial da Calculadora Lisa.",
      "Adicionado recursos automáticos de Cálculo de Ingredientes e Encomendas.",
    ],
  },
];
