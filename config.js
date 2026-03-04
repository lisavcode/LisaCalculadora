const Config = {
  Debug: false,
  Store: {
    Url: "https://discord.com/invite/QBE6kKCBTF",
    ButtonText: "Entrar Em contato",
    Title: "Feito por Lisa",
    Description: "Projeto sem fins lucrativos.",
  },
  Security: {
    DisableRightClick: true,
    DisableTextSelection: true,
    DisableShortcuts: true,
    BlackScreenOnPrint: true,
    BlackScreenDuration: 500,
  },
  Messages: {
    PrintWarning: "Captura de tela não permitida!",
    DRMFailure:
      "Licença inválida ou domínio não autorizado. Entre em contato com o administrador.",
  },
  DRM: {
    Enabled: true,
    AllowedDomains: ["localhost", "127.0.0.1", "lisavcode.github.io"],
    OwnerName: "Lisa",
    EnableDebuggerLoop: true,
  },
  TrainerUI: {
    UnitaryText: "Custo Unitário",
    EstimateText: "Custo Estimado",
    IngredientsText: "Requisitos",
    CustomText: "Valor Fixo",
    TotalText: "Total de Moedas",
    EmptyIngredientsText: "Nenhum requisito",
    InfoNoPrice: "Informação",
  },
  Orders: {
    NewTitle: "Nova Encomenda",
    EditTitle: "Editar Encomenda",
    AlertEmptyProducts: "Adicione pelo menos um produto!",
    ConfirmDelete: "Apagar esta encomenda permanentemente?",
    ConfirmRestore:
      "Substituir todas as encomendas atuais por {count} do arquivo?",
    FileInvalid: "Arquivo inválido.",
    FileError: "Erro ao ler arquivo JSON.",
    RestoreSuccess: "Restaurado com sucesso!",
  },
};
