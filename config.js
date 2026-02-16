const Config = {
  Debug: false, // Ative para ver logs no console
  Store: {
    Url: "https://discord.com/invite/QBE6kKCBTF",
    ButtonText: "Acessar Loja",
    Title: "Lisa Store Mods e Implementações para jogos",
    Description: "Facilite sua vida e otimize seu tempo!",
  },
  Security: {
    DisableRightClick: true,
    DisableTextSelection: true,
    DisableShortcuts: true, // Ctrl+C, Ctrl+U, F12, etc.
    BlackScreenOnPrint: true,
    BlackScreenDuration: 500, // Duração da tela preta em ms
  },
  Messages: {
    PrintWarning: "Captura de tela não permitida!",
    DRMFailure:
      "Licença inválida ou domínio não autorizado. Entre em contato com o administrador.",
  },
  DRM: {
    Enabled: true,
    AllowedDomains: ["localhost", "127.0.0.1", "lisavcode.github.io"], // Domínios permitidos. Para uso local (file://), o domínio é vazio.
    OwnerName: "Lisa", // Nome do proprietário para exibição no console
    EnableDebuggerLoop: true, // Trava o inspetor de elementos com loops de debugger
  },
};
