(function () {
  // Aguarda o carregamento do DOM para garantir que o body exista
  window.addEventListener("DOMContentLoaded", () => {
    initSecurity();
  });

  function initSecurity() {
    if (typeof Config === "undefined") {
      console.error("[Security] Config.js não encontrada ou não carregada.");
      return;
    }

    const debug = Config.Debug;

    function log(message) {
      if (debug) console.log(`[Security] ${message}`);
    }

    // --- 1. Desabilitar Menu de Contexto ---
    if (Config.Security.DisableRightClick) {
      document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        log("Menu de contexto bloqueado.");
      });
    }

    // --- 2. Desabilitar Seleção e Arrastar ---
    if (Config.Security.DisableTextSelection) {
      document.addEventListener("selectstart", function (e) {
        e.preventDefault();
        log("Seleção de texto bloqueada.");
      });

      document.addEventListener("dragstart", function (e) {
        e.preventDefault();
        log("Arrastar bloqueado.");
      });

      const style = document.createElement("style");
      style.innerHTML = `
                body {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `;
      document.head.appendChild(style);
    }

    // --- 3. Desabilitar Atalhos ---
    if (Config.Security.DisableShortcuts) {
      document.addEventListener("keydown", function (e) {
        // F12, Ctrl+Shift+I/J, Ctrl+U
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j"].includes(e.key)) ||
          (e.ctrlKey && ["U", "u"].includes(e.key))
        ) {
          e.preventDefault();
          log("DevTools bloqueado.");
          return false;
        }

        // Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+S, Ctrl+P
        if (
          e.ctrlKey &&
          ["c", "a", "x", "s", "p"].includes(e.key.toLowerCase())
        ) {
          e.preventDefault();
          log(`Atalho Ctrl+${e.key.toUpperCase()} bloqueado.`);
          return false;
        }
      });
    }

    // --- 4. Anti-PrintScreen ---
    if (Config.Security.BlackScreenOnPrint) {
      const overlay = document.createElement("div");
      overlay.id = "security-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        zIndex: "999999",
        display: "none",
        pointerEvents: "none",
      });
      document.body.appendChild(overlay);

      function blackout() {
        log("PrintScreen detectado.");
        overlay.style.display = "block";
        if (navigator.clipboard) navigator.clipboard.writeText("");
        setTimeout(() => {
          overlay.style.display = "none";
        }, Config.Security.BlackScreenDuration || 1000);
      }

      document.addEventListener("keyup", (e) => {
        if (e.key === "PrintScreen") blackout();
      });
    }

    // --- 5. Sistema DRM ---
    if (Config.DRM && Config.DRM.Enabled) {
      checkDRM(log);
    }

    log("Sistema de segurança ativo.");
  }

  function checkDRM(log) {
    log("Verificando integridade de domínio...");

    let currentDomain = window.location.hostname.trim();
    const allowedDomains = Config.DRM.AllowedDomains;

    // Permite execução local se a string de domínio for vazia (file://)
    // ou se 'localhost'/'127.0.0.1' estiverem na lista.
    if (currentDomain === "") currentDomain = "localhost";

    log(`Domínio detectado: ${currentDomain}`);

    const isAllowed = allowedDomains.some(
      (domain) =>
        currentDomain === domain || currentDomain.endsWith("." + domain),
    );

    if (!isAllowed) {
      log(`FALHA DRM: ${currentDomain} não autorizado.`);
      nukeContent(currentDomain);
      throw new Error("DRM Block");
    } else {
      log("DRM: Validado com sucesso.");
    }

    if (Config.DRM.EnableDebuggerLoop) {
      setInterval(() => {
        debugger;
      }, 1000);
    }

    if (Config.DRM.OwnerName) {
      console.log(
        `%c Desenvolvido por: ${Config.DRM.OwnerName}`,
        "color: #00eeff; font-weight: bold;",
      );
    }
  }

  function nukeContent(domain) {
    document.body.innerHTML = "";
    Object.assign(document.body.style, {
      backgroundColor: "black",
      color: "red",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "24px",
      textAlign: "center",
      margin: "0",
    });
    document.body.innerText = `${Config.Messages.DRMFailure}\n(Domain: ${domain})`;
  }
})();
