const AccessControl = (function () {
  const MASTER_TOKEN = "k9mX2pRvL4nQ7wZjF1cYeG3sAhBtDu0";

  const TOKEN_MAP = {
    [MASTER_TOKEN]: {
      professions: ["alfaiate", "alquimista", "artesao", "cacador", "desocupado", "ferreiro", "minerador", "treinador"],
      encomendas: true,
      tavernas: ["drakenthal", "eldenrock", "skallheim"],
    },
    "7tNpQ2mXk9wRzLv4G3cYeJ8sAhBfDu1": {
      professions: ["alfaiate"],
      encomendas: true,
      tavernas: [],
    },
    "R4vZ8mXk2nQpL9wG7cYeJ3sAhBtDu5f": {
      professions: ["alquimista"],
      encomendas: true,
      tavernas: [],
    },
    "m3nZ9wXk4vQpR2LG8cYeJ7sAhBtDu6E": {
      professions: ["artesao"],
      encomendas: true,
      tavernas: [],
    },
    "Qp7kZ2vXm9nRL4wG3cYeJ8sAhBtDuC0": {
      professions: ["cacador"],
      encomendas: true,
      tavernas: [],
    },
    "v2mX8kZp9QnRL7wG4cYeJ3sAhBtDuD5": {
      professions: ["desocupado"],
      encomendas: true,
      tavernas: [],
    },
    "X9kZ4mQp2nRL8wGv7cYeJ3sAhBtDuF1": {
      professions: ["ferreiro"],
      encomendas: true,
      tavernas: [],
    },
    "nZ3mX9kQp4vRL2wG8cYeJ7sAhBtDuM6": {
      professions: ["minerador"],
      encomendas: true,
      tavernas: [],
    },
    "kZ8mX2nQp9vRL4wG3cYeJ7sAhBtDuT0": {
      professions: ["treinador"],
      encomendas: true,
      tavernas: [],
    },
    "pQ2mZ8kXn9vRL4wG3cYeJ7sAhBtDuE3": {
      professions: [],
      encomendas: true,
      tavernas: [],
    },
    "LZ4mX9kQp2nRv8wG3cYeJ7sAhBtDu1D": {
      professions: [],
      encomendas: false,
      tavernas: ["drakenthal"],
    },
    "wG8mX2kZp9nRL4vQ3cYeJ7sAhBtDu2E": {
      professions: [],
      encomendas: false,
      tavernas: ["eldenrock"],
    },
    "cY3mX8kZp2nRL9vQG4eJ7sAhBtDu3S0": {
      professions: [],
      encomendas: false,
      tavernas: ["skallheim"],
    },
  };

  const SESSION_KEY = "lisa_calc_token";
  const PROFESSION_KEY = "lisa_active_profession";

  function getToken() {
    const urlToken = window.location.search
      ? decodeURIComponent(window.location.search.slice(1))
      : null;
    if (urlToken) {
      sessionStorage.setItem(SESSION_KEY, urlToken);
      return urlToken;
    }
    return sessionStorage.getItem(SESSION_KEY) || null;
  }

  function getPermissions(token) {
    if (!token) return null;
    return TOKEN_MAP[token] || null;
  }

  function redirectDenied() {
    const base = _getBasePath();
    window.location.href = base + "acesso-negado.html";
  }

  function _getBasePath() {
    const path = window.location.pathname;
    if (path.includes("/calculadora/") || path.includes("/encomendas/") || path.includes("/taverna/")) {
      return "../";
    }
    return "./";
  }

  function requireAccess(check) {
    const token = getToken();
    const perms = getPermissions(token);
    if (!perms) {
      redirectDenied();
      return null;
    }
    if (check && !check(perms)) {
      redirectDenied();
      return null;
    }
    return perms;
  }

  function saveProfessionToStorage(perms) {
    if (!perms) return;
    const allProfs = ["alfaiate", "alquimista", "artesao", "cacador", "desocupado", "ferreiro", "minerador", "treinador"];
    const allowed = (perms.professions || []).filter((p) => allProfs.includes(p));
    if (allowed.length > 0) {
      localStorage.setItem(PROFESSION_KEY, allowed[0]);
    } else {
      localStorage.removeItem(PROFESSION_KEY);
    }
  }

  function initHub() {
    const token = getToken();
    if (!token) {
      redirectDenied();
      return null;
    }
    const perms = getPermissions(token);
    if (!perms) {
      redirectDenied();
      return null;
    }
    saveProfessionToStorage(perms);
    return perms;
  }

  return {
    getToken,
    getPermissions,
    requireAccess,
    initHub,
    saveProfessionToStorage,
    SESSION_KEY,
    PROFESSION_KEY,
  };
})();
