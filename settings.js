const DefaultThemes = {
  dark: {
    "--color-primary": "#00eeff",
    "--color-secondary": "#0a0000",
    "--color-bg": "#000005",
    "--color-surface": "#0c161d",
    "--color-coin-oz": "#ffd700",
    "--color-coin-sz": "#92b5c5",
    "--color-coin-bz": "#cd7f32",
    "--color-border": "#161f22",
    "--color-text": "#f1f5f9",
    "--color-text-muted": "#94a3b8",
    "--color-input-bg": "#1e293b",
    "--color-input-border": "#475569",
    "--color-text-hover": "#00eeff",
    "--color-text-on-primary": "#0f172a",
    "--color-tab-text": "#94a3b8",
    "--color-card-bg": "#0a131a",
    "--color-estimate-bg": "#1e293b",
    "--color-estimate-bg": "#1e293b",
    "--color-bar-bg": "#1e293b",
    hue: 0,
    saturation: 0,
    lockedKeys: [],
  },
  light: {
    "--color-primary": "#3400c2",
    "--color-secondary": "#c7c7c7",
    "--color-bg": "#c3c8cc",
    "--color-surface": "#ffffff",
    "--color-coin-oz": "#d4af37",
    "--color-coin-sz": "#607d8b",
    "--color-coin-bz": "#a0522d",
    "--color-border": "#cbd5e1",
    "--color-text": "#0f172a",
    "--color-text-muted": "#64748b",
    "--color-input-bg": "#f1f5f9",
    "--color-input-border": "#cbd5e1",
    "--color-text-hover": "#00acc1",
    "--color-text-on-primary": "#ffffff",
    "--color-tab-text": "#475569",
    "--color-card-bg": "#ffffff",
    "--color-estimate-bg": "#f1f5f9",
    "--color-estimate-bg": "#f1f5f9",
    "--color-bar-bg": "#f1f5f9",
    hue: 0,
    saturation: 0,
    lockedKeys: [],
  },
  custom: {
    "--color-primary": "#ff0000",
    "--color-secondary": "#190606",
    "--color-bg": "#000000",
    "--color-surface": "#111111",
    "--color-coin-oz": "#ffd700",
    "--color-coin-sz": "#92b5c5",
    "--color-coin-bz": "#cd7f32",
    "--color-border": "#330000",
    "--color-text": "#ffffff",
    "--color-text-muted": "#9ca3af",
    "--color-input-bg": "#1a0505",
    "--color-input-border": "#450a0a",
    "--color-text-hover": "#ff0000",
    "--color-text-on-primary": "#ffffff",
    "--color-tab-text": "#888888",
    "--color-card-bg": "#111111",
    "--color-estimate-bg": "#1a0505",
    "--color-estimate-bg": "#1a0505",
    "--color-bar-bg": "#1a0505",
    hue: 0,
    saturation: 0,
    lockedKeys: [],
  },
  monochrome: {
    "--color-primary": "#ffffff",
    "--color-secondary": "#141414",
    "--color-bg": "#000000",
    "--color-surface": "#121212",
    "--color-coin-oz": "#e0e0e0",
    "--color-coin-sz": "#a0a0a0",
    "--color-coin-bz": "#606060",
    "--color-border": "#333333",
    "--color-text": "#ffffff",
    "--color-text-muted": "#888888",
    "--color-input-bg": "#222222",
    "--color-input-border": "#444444",
    "--color-text-hover": "#aaaaaa",
    "--color-text-on-primary": "#000000",
    "--color-tab-text": "#888888",
    "--color-card-bg": "#121212",
    "--color-estimate-bg": "#222222",
    "--color-estimate-bg": "#222222",
    "--color-bar-bg": "#222222",
    hue: 0,
    saturation: 0,
    lockedKeys: [],
  },
};

const Settings = {
  currentTheme: "dark",
  themes: JSON.parse(JSON.stringify(DefaultThemes)), // Deep copy

  init() {
    this.load();
    this.apply();
    this.injectStyles();
    this.createSettingsUI();

    // Escuta atualizações vindas do Hub (Pai) ou de outros scripts
    window.addEventListener("app_settings_updated", () => {
      this.load();
      this.apply();
      this.updateColorInputs();
    });
  },

  load() {
    // Load active theme name
    const savedThemeName = localStorage.getItem("app_theme");
    if (savedThemeName && this.themes[savedThemeName]) {
      this.currentTheme = savedThemeName;
    }

    // Load all theme configurations
    const savedThemes = localStorage.getItem("app_themes_config");
    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        // Merge saved themes with defaults to ensure new keys exist
        // This preserves user edits but adds any new properties we might have added to DefaultThemes
        this.themes = { ...this.themes, ...parsedThemes };

        // Ensure all default keys exist in case of schema updates
        for (const themeKey in DefaultThemes) {
          if (!this.themes[themeKey]) {
            this.themes[themeKey] = { ...DefaultThemes[themeKey] };
          } else {
            // Ensure all color keys exist
            this.themes[themeKey] = {
              ...DefaultThemes[themeKey],
              ...this.themes[themeKey],
            };
            if (!this.themes[themeKey].lockedKeys) {
              this.themes[themeKey].lockedKeys = [];
            }
          }
        }
      } catch (e) {
        console.error("Error loading saved themes:", e);
        // Fallback is already set by initialization
      }
    }

    // Migration: Convert all RGB/RGBA to Hex
    for (const themeKey in this.themes) {
      if (!this.themes[themeKey]) continue;
      for (const colorKey in this.themes[themeKey]) {
        const val = this.themes[themeKey][colorKey];
        if (val && val.toString().trim().startsWith("rgb")) {
          this.themes[themeKey][colorKey] = this.rgbToHex(val);
        }
      }
    }
  },

  save() {
    const configString = JSON.stringify(this.themes);
    localStorage.setItem("app_theme", this.currentTheme);
    localStorage.setItem("app_themes_config", configString);

    // Dispara evento para sincronização interna (mesma página)
    window.dispatchEvent(
      new CustomEvent("app_settings_updated", {
        detail: { theme: this.currentTheme, themes: this.themes },
      }),
    );

    // Dispara evento para o pai (Hub SPA) se estiver em iframe
    if (window.parent && window.parent !== window) {
      window.parent.dispatchEvent(
        new CustomEvent("app_settings_updated", {
          detail: { theme: this.currentTheme, themes: this.themes },
        }),
      );
    }
  },

  setTheme(themeName) {
    if (!this.themes[themeName]) return;
    this.currentTheme = themeName;
    this.save();
    this.apply();
    this.updateUI();
  },

  setColor(key, value) {
    // Update the CURRENT theme directly
    this.themes[this.currentTheme][key] = value;
    this.save();
    this.apply();

    // Instant hash update in UI
    // Find the input that triggered this (if possible) or update by selector
    // Since we don't have the element reference straightforwardly passed here in a clean way without changing signature too much,
    // we can assume the UI is open and update the specific hex label.
    // But the simplest way given the structure is to update the sibling span if we pass 'this' from the input,
    // OR standard way: update the span text content.

    // Let's rely on finding the matching input's sibling span by the key?
    // Actually, let's update renderColorList to pass the element to setColor or handle UI update there.
    // BETTER APPROACH for this tool call: Update setColor to find the label.

    // However, a cleaner way is just to update the text content of the span associated with this key.
    // We will assign IDs to the spans in renderColorList.
    const span = document.getElementById(`hash-${key}`);
    if (span) span.textContent = value;
  },

  rgbToHex(rgb) {
    if (!rgb) return "#000000";
    if (rgb.startsWith("#")) return rgb;

    // Handle "rgba(r, g, b, a)" or "rgb(r, g, b)"
    // Basic parsing
    const sep = rgb.indexOf(",") > -1 ? "," : " ";
    const parts = rgb.substr(4).split(")")[0].split(sep);

    // Be careful with parsing
    let r = parseInt(parts[0].trim());
    let g = parseInt(parts[1].trim());
    let b = parseInt(parts[2].trim());

    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;

    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  },

  hexToRgb(hex) {
    // Handle shorthand #FFF
    const fullHex =
      hex.length === 4
        ? "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        : hex;
    // Handle 8-digit hex (RGBA) - ignore alpha for RGB conversion
    if (fullHex.length === 9) fullHex = fullHex.substring(0, 7);

    // Basic validation/fallback
    if (!/^#?[0-9A-F]{6}$/i.test(fullHex)) return "0 0 0"; // Return black
    // Basic cleanup
    const cleanHex = fullHex.replace("#", "");
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  },

  hexToHSL(H) {
    // Strip alpha if present (length 5 or 9)
    if (H.length == 5) H = H.substring(0, 4);
    if (H.length == 9) H = H.substring(0, 7);

    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin;
    let h = 0,
      s = 0,
      l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  },

  hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
  },

  updateHue(degrees) {
    degrees = parseInt(degrees);
    this.themes[this.currentTheme].hue = degrees;

    // Auto-save debounced? For now direct save as user requested persistence
    this.save();
    this.apply();
    // No need to updateColorInputs or create weird snapshots anymore
  },

  updateSaturation(val) {
    val = parseInt(val);
    this.themes[this.currentTheme].saturation = val;
    this.save();
    this.apply();
  },

  toggleLock(key) {
    const theme = this.themes[this.currentTheme];
    if (!theme.lockedKeys) theme.lockedKeys = [];

    const index = theme.lockedKeys.indexOf(key);
    if (index > -1) {
      theme.lockedKeys.splice(index, 1); // Unlock
    } else {
      theme.lockedKeys.push(key); // Lock
    }
    this.save();
    this.apply();
    this.updateColorInputs(); // Update UI to reflect lock state
  },

  updateColorInputs() {
    const colors = this.themes[this.currentTheme];
    for (const [key, value] of Object.entries(colors)) {
      const textInput = document.getElementById(`text-${key}`);
      const picker = document.getElementById(`picker-${key}`);
      const rgb = this.hexToRgb(value);

      if (textInput && document.activeElement !== textInput)
        textInput.value = value;
      if (picker) picker.value = value;

      // Also update static span if it exists (legacy)
      const span = document.getElementById(`hash-${key}`);
      if (span) span.textContent = value;

      // Update Lock Icon state
      const lockBtn = document.getElementById(`lock-${key}`);
      if (lockBtn) {
        const isLocked = (
          this.themes[this.currentTheme].lockedKeys || []
        ).includes(key);
        lockBtn.innerHTML = isLocked
          ? this.getLockIcon(true)
          : this.getLockIcon(false);
        lockBtn.classList.toggle("text-primary", isLocked);
        lockBtn.classList.toggle("text-muted", !isLocked);
        lockBtn.title = isLocked
          ? "Destravar cor (Muda com Hue)"
          : "Travar cor (Fixo)";
      }
    }
  },

  getLockIcon(locked) {
    if (locked) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" /></svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" /></svg>`;
    }
  },

  apply() {
    const root = document.documentElement;
    const theme = this.themes[this.currentTheme];
    const hueRotation = parseInt(theme.hue || 0);
    const saturation = parseInt(theme.saturation || 0);

    for (const [key, value] of Object.entries(theme)) {
      if (key === "hue" || key === "saturation" || key === "lockedKeys")
        continue;

      let finalValue = value;

      // Apply Hue & Saturation
      if ((hueRotation !== 0 || saturation !== 0) && value.startsWith("#")) {
        // Check Lock
        const isLocked = (theme.lockedKeys || []).includes(key);
        if (!isLocked) {
          const hsl = this.hexToHSL(value);
          // Hue
          hsl.h = (hsl.h + hueRotation) % 360;
          if (hsl.h < 0) hsl.h += 360;
          // Saturation
          hsl.s = Math.max(0, Math.min(100, hsl.s + saturation));

          finalValue = this.hslToHex(hsl.h, hsl.s, hsl.l);
        }
      }

      root.style.setProperty(key, finalValue);
      if (finalValue && finalValue.startsWith("#")) {
        root.style.setProperty(`${key}-rgb`, this.hexToRgb(finalValue));
      }
    }
  },

  injectStyles() {
    if (document.getElementById("settings-styles")) return; // Prevent double injection

    const style = document.createElement("style");
    style.id = "settings-styles";
    style.textContent = `
            :root {
                --color-primary: #00eeff;
                --color-secondary: #7b2cbf;
                --color-bg: #0f172a;
                --color-surface: #1e293b;
                --color-coin-oz: #ffd700;
                --color-coin-sz: #92b5c5;
                --color-coin-bz": #cd7f32;
                --color-border: #333333;
                --color-text: #f1f5f9;
                --color-text-muted: #94a3b8;
                --color-input-bg: #1e293b;
                --color-input-border: #475569;
                --color-text-hover: #00eeff;
                --color-text-on-primary: #0f172a;
                --color-tab-text: #94a3b8;
                --color-card-bg: #1e293b;
                --color-estimate-bg: #1e293b;
                --color-bar-bg: #1e293b;
            }
            
            #settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 1000;
                display: flex;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
            }
            
            #settings-modal.open {
                opacity: 1;
                pointer-events: all;
            }
            
            .settings-content {
                position: absolute;
                top: 5rem;
                right: 2rem;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                padding: 2rem;
                border-radius: 1rem;
                width: 90%;
                max-width: 400px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                color: var(--color-text);
                transform-origin: top right;
                transform: scale(0.95) translateY(-10px);
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                opacity: 0;
            }

            #settings-modal.open .settings-content {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            .settings-group {
                margin-bottom: 1.5rem;
            }

            .settings-group h3 {
                margin-bottom: 0.5rem;
                color: var(--color-primary);
                font-size: 1.1rem;
                font-weight: bold;
            }

            .theme-options {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                flex-wrap: wrap;
            }

            .theme-btn {
                padding: 0.5rem 1rem;
                border: 1px solid var(--color-border);
                border-radius: 0.5rem;
                background: var(--color-input-bg);
                color: var(--color-text);
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.9rem;
            }

            .theme-btn:hover {
                 border-color: var(--color-primary);
                 color: var(--color-text-hover);
            }

            .theme-btn.active {
                border-color: var(--color-primary);
                background: var(--color-primary);
                color: var(--color-text-on-primary);
                font-weight: bold;
            }

            .color-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background: var(--color-input-bg);
                border-radius: 0.5rem;
                border: 1px solid var(--color-border);
            }

            .color-input {
                width: 40px;
                height: 40px;
                border: none;
                background: none;
                cursor: pointer;
            }
            
            .close-btn {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--color-text);
                font-size: 1.5rem;
                cursor: pointer;
            }
            .close-btn:hover {
                color: var(--color-text-hover);
            }

            .settings-trigger {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: transparent;
                border: 1px solid var(--color-primary);
                color: var(--color-primary);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 0 5px rgb(var(--color-primary-rgb) / 0.3);
                z-index: 999;
                font-size: 1.2rem;
                transition: all 0.2s;
                opacity: 0.7;
            }

            .settings-trigger:hover {
                transform: rotate(90deg);
                opacity: 1;
                box-shadow: 0 0 10px rgb(var(--color-primary-rgb) / 0.6);
                background: rgb(var(--color-primary-rgb) / 0.1);
            }
            .lock-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
                opacity: 0.5;
            }
            .lock-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
            }
            .lock-btn.text-primary {
                opacity: 1;
                color: var(--color-primary);
            }
        `;
    document.head.appendChild(style);
  },

  createSettingsUI() {
    if (document.querySelector(".settings-trigger")) return; // Avoid duplicates

    const trigger = document.createElement("button");
    trigger.className = "settings-trigger";
    trigger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.581-.495.644-.869l.214-1.281z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`;
    trigger.onclick = (e) => {
      // Prevent close event from firing immediately
      e.stopPropagation();
      document.getElementById("settings-modal").classList.add("open");
    };
    document.body.appendChild(trigger);

    const modal = document.createElement("div");
    modal.id = "settings-modal";

    // Click outside to close
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
      }
    };

    modal.innerHTML = `
            <div class="settings-content relative">
                <button class="close-btn" onclick="document.getElementById('settings-modal').classList.remove('open')">×</button>
                <h2 class="text-2xl font-bold mb-6" style="color: var(--color-text)">Configurações</h2>
                
                <div class="settings-group">
                    <h3>Tema</h3>
                    <div class="theme-options">
                        <button class="theme-btn" onclick="Settings.setTheme('dark')" id="btn-theme-dark">Escuro</button>
                        <button class="theme-btn" onclick="Settings.setTheme('light')" id="btn-theme-light">Claro</button>
                        <button class="theme-btn" onclick="Settings.setTheme('monochrome')" id="btn-theme-monochrome">Mono</button>
                        <button class="theme-btn" onclick="Settings.setTheme('custom')" id="btn-theme-custom">Custom</button>
                    </div>
                </div>

                <div class="settings-group">
                    <h3>Matiz</h3>
                    <div class="bg-black/20 p-3 rounded-lg border border-white/5">
                        <div class="flex items-center justify-between mb-2">
                             <div class="flex items-center">
                                <span class="mr-2 text-sm">Matiz:</span>
                                <input type="number" id="hue-number" 
                                    class="w-12 bg-black/20 border border-white/10 rounded text-center text-xs"
                                    value="${this.themes[this.currentTheme].hue || 0}"
                                    onchange="document.getElementById('hue-slider').value = this.value; Settings.updateHue(this.value);">
                             </div>
                        </div>
                        <input type="range" id="hue-slider" min="-180" max="180" 
                               value="${this.themes[this.currentTheme].hue || 0}" 
                               class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                               style="background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);"
                               oninput="document.getElementById('hue-number').value = this.value; Settings.updateHue(this.value)">
                         <div class="flex justify-between text-xs text-muted mt-1 mb-4">
                            <span>-180°</span>
                            <span>0°</span>
                            <span>+180°</span>
                         </div>
                         
                         <div class="flex items-center justify-between mb-2">
                             <div class="flex items-center">
                                <span class="mr-2 text-sm">Saturação:</span>
                                <input type="number" id="sat-number" 
                                    class="w-12 bg-black/20 border border-white/10 rounded text-center text-xs"
                                    value="${this.themes[this.currentTheme].saturation || 0}"
                                    onchange="document.getElementById('sat-slider').value = this.value; Settings.updateSaturation(this.value);">
                             </div>
                        </div>
                        <input type="range" id="sat-slider" min="-100" max="100" 
                               value="${this.themes[this.currentTheme].saturation || 0}" 
                               class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                               style="background: linear-gradient(to right, #808080, #ff0000);"
                               oninput="document.getElementById('sat-number').value = this.value; Settings.updateSaturation(this.value)">
                        <div class="flex justify-between text-xs text-muted mt-1">
                           <span>-100%</span>
                           <span>    0%</span>
                           <span>+100%</span>
                        </div>
                    </div>
                </div>

                <div class="settings-group">
                    <h3>Editando Cores: <span id="current-editing-theme" class="capitalize text-primary"></span></h3>
                    <div id="color-list"></div>
                </div>
                
                <div class="mt-6 text-center">
                    <button onclick="Settings.reset()" class="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors">
                        Restaurar Padrões de Fábrica
                    </button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
    this.renderColorList();
    this.updateUI();
  },

  renderColorList() {
    const list = document.getElementById("color-list");
    list.innerHTML = "";

    const labels = {
      "--color-primary": "Cor Primária",
      "--color-bg": "Fundo Principal",
      "--color-secondary": "Fundo Secundária",
      "--color-surface": "Fundo Terciario",
      "--color-text": "Texto Principal",
      "--color-text-muted": "Texto Secundário",
      "--color-border": "Bordas",
      "--color-input-bg": "Fundo Inputs",
      "--color-input-border": "Borda Inputs",
      "--color-text-hover": "Texto ao Passar o Mouse",
      "--color-text-on-primary": "Texto em Fundo Primário",
      "--color-tab-text": "Texto das Abas (Inativas)",
      "--color-card-bg": "Fundo do Cartão",
      "--color-estimate-bg": "Fundo da Estimativa",
      "--color-bar-bg": "Fundo da Barra",
      "--color-coin-oz": "Moeda Ouro",
      "--color-coin-sz": "Moeda Prata",
      "--color-coin-bz": "Moeda Bronze",
    };

    const currentThemeColors = this.themes[this.currentTheme];

    for (const [key, label] of Object.entries(labels)) {
      if (
        key === "hue" ||
        key === "saturation" ||
        key === "lockedKeys" ||
        key === "lockCoins"
      )
        continue;
      const div = document.createElement("div");
      div.className = "color-item";

      const currentValue = currentThemeColors[key];
      const isLocked = (currentThemeColors.lockedKeys || []).includes(key);

      // Basic hex check
      const isHex = /^#[0-9A-F]{6}$/i.test(currentValue);

      // Added ID to span for direct updates
      div.innerHTML = `
                <span class="text-sm font-medium" style="color: var(--color-text)">${label}</span>
                <div class="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                    <button id="lock-${key}" onclick="Settings.toggleLock('${key}')" class="lock-btn ${isLocked ? "text-primary" : "text-muted"}" title="${isLocked ? "Destravar" : "Travar"}">
                        ${this.getLockIcon(isLocked)}
                    </button>
                    <input type="text"  
                           id="text-${key}"
                           class="w-20 bg-transparent border-none text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary rounded" 
                           style="color: var(--color-text-muted)"
                           value="${currentValue}"
                           maxlength="7"
                           onchange="Settings.updateFromText('${key}', this.value)"
                           onkeyup="if(event.key === 'Enter') Settings.updateFromText('${key}', this.value)"
                    >
                    <div class="w-8 h-8 rounded overflow-hidden relative border border-white/10 cursor-pointer hover:border-primary transition-colors">
                        <input type="color" 
                               id="picker-${key}"
                               class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 cursor-pointer border-none"
                               value="${isHex ? currentValue : Settings.rgbToHex(currentValue)}" 
                               oninput="Settings.updateFromPicker('${key}', this.value)">
                    </div>
                </div>
            `;
      list.appendChild(div);
    }
  },

  updateFromText(key, value) {
    // Validate Hex
    let hex = value.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;

    const isValidHex = /^#[0-9A-F]{6}$/i.test(hex);

    if (isValidHex) {
      // Update Picker
      const picker = document.getElementById(`picker-${key}`);
      if (picker) picker.value = hex;

      // Save & Apply
      this.setColor(key, hex);

      // Update self value to normalized format
      const textInput = document.getElementById(`text-${key}`);
      if (textInput) textInput.value = hex;
    } else {
      // Revert to current theme value if invalid
      const currentVal = this.themes[this.currentTheme][key];
      const textInput = document.getElementById(`text-${key}`);
      if (textInput) textInput.value = currentVal;
    }
  },

  updateFromPicker(key, value) {
    // Update Text Input
    const textInput = document.getElementById(`text-${key}`);
    if (textInput) textInput.value = value;

    // Save & Apply
    this.setColor(key, value);
  },

  updateUI() {
    // Update Active Button
    document
      .querySelectorAll(".theme-btn")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-theme-${this.currentTheme}`);
    if (activeBtn) activeBtn.classList.add("active");

    // Update Title Label
    const label = document.getElementById("current-editing-theme");
    if (label)
      label.textContent =
        this.currentTheme === "monochrome"
          ? "Monocromático"
          : this.currentTheme;

    // Re-render color list to show current values
    this.renderColorList();

    // Update Hue/Sat inputs
    const hueSlider = document.getElementById("hue-slider");
    const hueNumber = document.getElementById("hue-number");
    const satSlider = document.getElementById("sat-slider");
    const satNumber = document.getElementById("sat-number");

    const theme = this.themes[this.currentTheme];

    if (hueSlider) hueSlider.value = theme.hue || 0;
    if (hueNumber) hueNumber.value = theme.hue || 0;
    if (satSlider) satSlider.value = theme.saturation || 0;
    if (satNumber) satNumber.value = theme.saturation || 0;
  },

  reset() {
    if (
      confirm(
        "Isso irá resetar TODAS as cores de TODOS os temas para o padrão original. Continuar?",
      )
    ) {
      localStorage.removeItem("app_theme");
      localStorage.removeItem("app_themes_config");
      // Restore defaults
      this.themes = JSON.parse(JSON.stringify(DefaultThemes));
      // this.currentTheme remains whatever it is currently
      this.save();
      this.apply();
      this.updateUI();
    }
  },
};

// Initialize when DOM is ready to prevent null reference errors
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Settings.init());
} else {
  Settings.init();
}
