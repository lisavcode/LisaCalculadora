/**
 * Encomendas Manager
 * Handles logic for the Order System
 */

const NotesManager = {
  orders: [],

  init() {
    this.loadOrders();
    Settings.init(); // Initialize shared settings (colors)
    this.renderOrders();

    // Setup Search
    document.getElementById("search-orders").addEventListener("input", (e) => {
      this.renderOrders(e.target.value);
    });
  },

  loadOrders() {
    const stored = localStorage.getItem("icarus_orders");
    if (stored) {
      this.orders = JSON.parse(stored);
    }
  },

  saveToStorage() {
    localStorage.setItem("icarus_orders", JSON.stringify(this.orders));
    this.renderOrders();
  },

  // --- Modal Logic ---

  openModal() {
    // Notifica Hub para ocultar o menu global
    if (window.parent && window.parent !== window) {
      window.parent.dispatchEvent(new CustomEvent("hide-hub-ui"));
    }

    const modal = document.getElementById("order-modal");
    modal.classList.remove("hidden");
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.add("modal-open");

    // Reset form
    document.getElementById("order-form").reset();
    document.getElementById("product-list").innerHTML = "";
    // Started empty, waiting for Picker add
    document.getElementById("total-price").innerText = "0";
  },

  closeModal() {
    // Notifica Hub para restaurar o menu global
    if (window.parent && window.parent !== window) {
      window.parent.dispatchEvent(new CustomEvent("show-hub-ui"));
    }

    const modal = document.getElementById("order-modal");
    const card = modal.querySelector(".glass-card");

    if (card) {
      card.classList.add("imploding");
    }

    modal.classList.remove("modal-open");
    setTimeout(() => {
      modal.classList.add("hidden");
      if (card) card.classList.remove("imploding");
    }, 400);
  },

  // --- Product Logic ---

  getAllProducts() {
    // Flatten all professions into one list
    let products = [];
    for (const prof in dataByProfession) {
      if (dataByProfession[prof].items) {
        products = products.concat(
          dataByProfession[prof].items.map((p) => ({
            ...p,
            profession: prof,
          })),
        );
      }
    }
    return products.sort((a, b) => a.name.localeCompare(b.name));
  },

  // --- Product Logic (Cards) ---

  // Helper from Calculator
  formatMoneyConverted(amount) {
    let totalBz = Math.floor(amount);
    let oz = Math.floor(totalBz / 10000);
    let remainderAfterOz = totalBz % 10000;
    let sz = Math.floor(remainderAfterOz / 100);
    let bz = remainderAfterOz % 100;

    let parts = [];
    if (oz > 0)
      parts.push(
        `<span class="text-coin-oz font-bold drop-shadow-sm">${oz} Oz</span>`,
      );
    if (sz > 0)
      parts.push(
        `<span class="text-coin-sz font-bold drop-shadow-sm">${sz} Sz</span>`,
      );
    if (bz > 0 || parts.length === 0) {
      parts.push(
        `<span class="text-coin-bz font-bold drop-shadow-sm">${bz} Bz</span>`,
      );
    } else if (amount % 1 !== 0) {
      let decimals = (amount % 1).toFixed(2).substring(2);
      parts.push(
        `<span class="text-coin-bz font-bold drop-shadow-sm">0,${decimals} Bz</span>`,
      );
    }
    return parts.join(", ");
  },

  addItemCard(item) {
    const container = document.getElementById("product-list");
    const cardId =
      "card-" + Date.now() + Math.random().toString(36).substr(2, 5);

    // Era Badge Logic matches Calculator
    const era = item.era !== undefined ? item.era : 0;
    const eraText = era === 0 ? "Sem Era" : `Era ${era}`;
    const badgeClass = `badge-era-${era}`;

    const card = document.createElement("div");
    // Wrapper div for structure
    card.className = "group relative product-card";
    card.dataset.id = cardId;
    card.dataset.name = item.name;

    // Matches Calculator createItemCard HTML structure but adapted for Orders (Qty input)
    // We retain the "glass-card" and general layout from Calculator index.html
    card.innerHTML = `
        <div class="glass-card p-3 rounded-lg flex flex-col gap-2 hover:border-primary/50 transition-all duration-300 relative group-hover:shadow-neon-hover">
            
            <!-- Remove Button (Top Right) -->
            <button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:scale-110" onclick="this.closest('.product-card').remove(); NotesManager.calculateTotal();" title="Remover">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>

            <!-- Header -->
            <div class="flex justify-between items-start pb-2" style="border-bottom: 1px solid var(--color-border)">
                <h3 class="text-base font-bold text-primary transition-colors leading-tight truncate pr-4" title="${item.name}">${item.name}</h3>
                <span class="${badgeClass} text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">${eraText}</span>
            </div>

            <!-- Info Section -->
            <div class="flex flex-col gap-1.5 text-xs">
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-semibold uppercase" style="color: var(--color-text-muted)">Unitário</span>
                    <div class="text-right text-[11px]">
                        ${this.formatMoneyConverted(item.min)} <span class="text-[10px]" style="color: var(--color-text-muted)">-</span> ${this.formatMoneyConverted(item.max)}
                    </div>
                </div>
            </div>

            <!-- Controls Section -->
            <div class="mt-1 pt-2" style="border-top: 1px solid var(--color-border)">
                
                <!-- Quantity Row (New for Orders) -->
                 <div class="flex justify-between items-center mb-2">
                    <span class="text-primary text-[10px] uppercase font-bold tracking-wider">Quantidade</span>
                    <input type="number" min="1" value="1" class="qty-input w-20 text-[11px] font-bold rounded px-1.5 py-1 text-center focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
                           style="background: var(--color-input-bg); border: 1px solid var(--color-input-border); color: var(--color-text)">
                </div>

                <!-- Custom Price Row -->
                <div class="flex justify-between items-center mb-1">
                    <span class="text-primary text-[10px] uppercase font-bold tracking-wider">Preço Unit.</span>
                    <input type="number" min="${item.min}" max="${item.max}" step="0.01" value="${item.min}" class="price-input w-24 text-[10px] rounded px-1.5 py-0.5 text-right focus:border-transparent focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
                           style="background: var(--color-input-bg); border: 1px solid var(--color-input-border); color: var(--color-text)">
                </div>

                <!-- Slider -->
                <input type="range" min="${item.min}" max="${item.max}" step="0.01" value="${item.min}" class="range-slider price-slider w-full mb-3 h-1"
                       style="background: linear-gradient(to right, var(--color-primary) 0%, var(--color-bar-bg) 0%)">

                <!-- Total Display -->
                <div class="text-right bg-primary/10 border border-primary/20 p-1.5 rounded-lg total-display-container">
                    <div class="flex justify-between items-end">
                        <span class="text-[9px] text-primary font-bold">Total</span>
                        <div class="flex flex-col items-end">
                            <div class="text-sm font-bold leading-none total-text-converted"></div>
                            <div class="text-[9px] leading-none mt-0.5 total-text-raw" style="color: var(--color-text-muted)"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.appendChild(card);

    // Bind Events
    const qtyInput = card.querySelector(".qty-input");
    const priceInput = card.querySelector(".price-input");
    const slider = card.querySelector(".price-slider");
    const totalConverted = card.querySelector(".total-text-converted");
    const totalRaw = card.querySelector(".total-text-raw");

    const updateCalc = () => {
      const qty = parseInt(qtyInput.value) || 0;
      let price = parseFloat(priceInput.value) || 0;
      const min = parseFloat(priceInput.min);
      const max = parseFloat(priceInput.max);

      // Clamp price visual for slider background
      if (price < min) price = min;
      if (price > max) price = max;

      const total = qty * price;

      // Update Slider Background
      let percent = 0;
      if (max > min) {
        percent = ((price - min) / (max - min)) * 100;
      }
      slider.style.background = `linear-gradient(to right, var(--color-primary) ${percent}%, var(--color-bar-bg) ${percent}%)`;

      // Update Total Display
      totalConverted.innerHTML = this.formatMoneyConverted(total);
      totalRaw.innerText = `${Math.floor(total).toLocaleString("pt-BR")} Bz`;

      // Update main total of the modal
      this.calculateTotal();
    };

    // Events
    slider.addEventListener("input", (e) => {
      priceInput.value = e.target.value;
      updateCalc();
    });
    priceInput.addEventListener("input", (e) => {
      slider.value = e.target.value;
      updateCalc();
    });
    qtyInput.addEventListener("input", updateCalc);

    // Initial Calc
    updateCalc();
  },

  calculateTotal() {
    let total = 0;
    const cards = document.getElementsByClassName("product-card");
    for (const card of cards) {
      const qty = parseInt(card.querySelector(".qty-input").value) || 0;
      const price = parseFloat(card.querySelector(".price-input").value) || 0;
      total += qty * price;
    }
    const totalEl = document.getElementById("total-price");
    if (totalEl) {
      const formatted = ItemPicker.formatMoney(total);
      // console.log("Updating total:", formatted); // Debug
      totalEl.innerHTML = formatted;
    }
  },

  // --- Order Logic ---

  saveOrder(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const products = [];
    const cards = document.getElementsByClassName("product-card");
    let totalOrder = 0;

    for (const card of cards) {
      const name = card.dataset.name;
      const qty = parseInt(card.querySelector(".qty-input").value) || 0;
      const unitPrice =
        parseFloat(card.querySelector(".price-input").value) || 0;
      const lineTotal = qty * unitPrice;

      products.push({
        name: name,
        quantity: qty,
        unitPrice: unitPrice,
        total: lineTotal,
      });
      totalOrder += lineTotal;
    }

    if (products.length === 0) {
      alert("Adicione pelo menos um produto!");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      buyer: formData.get("buyer"),
      description: formData.get("description"),
      products: products,
      totalPrice: totalOrder,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder); // Add to top
    this.saveToStorage();
    this.closeModal();
  },

  toggleStatus(id) {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = order.status === "pending" ? "delivered" : "pending";
      this.saveToStorage();
    }
  },

  deleteOrder(id) {
    if (confirm("Apagar esta encomenda permanentemente?")) {
      this.orders = this.orders.filter((o) => o.id !== id);
      this.saveToStorage();
    }
  },

  // --- Render ---

  renderOrders(filter = "") {
    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    const filtered = this.orders.filter(
      (o) =>
        o.buyer.toLowerCase().includes(filter.toLowerCase()) ||
        (o.description &&
          o.description.toLowerCase().includes(filter.toLowerCase())),
    );

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center text-muted py-20 px-4">
            <div class="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Nenhuma Encomenda</b>
            <p class="text-sm text-center max-w-sm mb-6">Você ainda não tem encomendas registradas ou a busca não encontrou resultados.</p>
        </div>
      `;
      return;
    }

    const pending = filtered.filter((o) => o.status !== "delivered");
    const delivered = filtered.filter((o) => o.status === "delivered");

    // Helper to render a list of orders
    const renderList = (list) => {
      list.forEach((order) => {
        const isDelivered = order.status === "delivered";
        const statusLabel = isDelivered ? "ENTREGUE" : "PARA ENTREGA";
        const statusClass = isDelivered ? "delivered" : ""; // CSS class in style.css handles opacity/grayscale

        const card = document.createElement("div");
        // Using glass-card but maybe we want a specific border color for pending?
        // Actually style.css handles .order-card.delivered vs normal
        card.className = `glass-card p-5 rounded-2xl relative order-card group ${statusClass}`;

        // Delete Btn (Visible on hover)
        const delBtn = `<button onclick="event.stopPropagation(); NotesManager.deleteOrder('${order.id}')" class="absolute top-4 right-4 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              </button>`;

        const productsHtml = order.products
          .map(
            (p) =>
              `<div class="flex justify-between text-sm text-gray-400">
                      <span>${p.quantity}x ${p.name}</span>
                      <span>${p.total.toLocaleString()}</span>
                  </div>`,
          )
          .join("");

        // Price Display: Using ItemPicker.formatMoney for Oz/Sz/Bz
        const formattedPrice = ItemPicker.formatMoney(order.totalPrice);
        const rawBz = Math.floor(order.totalPrice).toLocaleString("pt-BR");

        card.innerHTML = `
                  ${delBtn}
                  <div onclick="NotesManager.toggleStatus('${order.id}')" class="cursor-pointer">
                      <div class="flex justify-between items-start mb-2">
                          <h3 class="text-xl font-bold text-white">${order.buyer}</h3>
                          <span class="text-xs font-bold px-2 py-1 rounded ${isDelivered ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"} border border-white/5">
                              ${statusLabel}
                          </span>
                      </div>
                      
                      <div class="space-y-1 mb-4 border-b border-white/5 pb-4">
                          ${productsHtml}
                      </div>
                      
                      <div class="flex justify-between items-end">
                          <div class="text-xs text-muted max-w-[50%]">
                              ${order.description ? `<p class="line-clamp-2" title="${order.description}">${order.description}</p>` : ""}
                              <div class="mt-2 opacity-50">${new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          
                          <div class="flex flex-col items-end">
                              <div class="text-sm font-bold text-primary leading-none text-right">${formattedPrice}</div>
                              <div class="text-[10px] text-muted mt-1 leading-none font-mono opacity-70">${rawBz} Bz</div>
                          </div>
                      </div>
                  </div>
              `;
        container.appendChild(card);
      });
    };

    // Render Pending Section
    if (pending.length > 0) {
      const header = document.createElement("div");
      header.className =
        "col-span-full border-b border-primary/30 pb-2 mb-4 mt-2";
      header.innerHTML = `<h2 class="text-2xl font-bold text-primary uppercase tracking-widest pl-2 border-l-4 border-primary">PARA ENTREGA</h2>`;
      container.appendChild(header);
      renderList(pending);
    }

    // Render Delivered Section
    if (delivered.length > 0) {
      const header = document.createElement("div");
      header.className =
        "col-span-full border-b border-green-500/30 pb-2 mb-4 mt-8";
      header.innerHTML = `<h2 class="text-2xl font-bold text-green-500 uppercase tracking-widest pl-2 border-l-4 border-green-500">ENTREGUE</h2>`;
      container.appendChild(header);
      renderList(delivered);
    }
  },

  // --- Import/Export ---

  downloadJSON() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.orders));
    const anchor = document.createElement("a");
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", "encomendas_backup.json");
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  },

  uploadJSON(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          if (
            confirm(
              `Substituir todas as encomendas atuais por ${json.length} do arquivo?`,
            )
          ) {
            this.orders = json;
            this.saveToStorage();
            alert("Restaurado com sucesso!");
          }
        } else {
          alert("Arquivo inválido.");
        }
      } catch (err) {
        alert("Erro ao ler arquivo JSON.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  },
};

// Initialize on Load
// --- Item Picker Logic (Ported from Calculator) ---
const ItemPicker = {
  isOpen: false,
  currentTab: "cacador",
  items: [],
  renderLimit: 50, // Permance Optimization

  init() {
    if (typeof dataByProfession === "undefined") window.dataByProfession = {};

    // Setup Event Listeners for Picker Modal
    const searchInput = document.getElementById("picker-search");
    if (searchInput)
      searchInput.addEventListener("input", () => {
        this.renderLimit = 50; // Reset limit on search
        this.render();
      });

    const eraFilter = document.getElementById("picker-era-filter");
    if (eraFilter)
      eraFilter.addEventListener("change", () => {
        this.renderLimit = 50; // Reset limit on filter
        this.render();
      });

    const sortSelect = document.getElementById("picker-sort");
    if (sortSelect) sortSelect.addEventListener("change", () => this.render());

    // Tab Switching
    document.querySelectorAll(".picker-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setTab(e.target.dataset.tab);
      });
    });

    // Infinite Scroll (Simple)
    const container = document.getElementById(
      "item-picker-results",
    )?.parentElement;
    if (container) {
      container.addEventListener("scroll", () => {
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 300
        ) {
          // Infinite Scroll Trigger
          if (this.currentBatchIndex < this.renderQueue.length) {
            this.renderBatch();
          }
        }
      });
    }

    // Event Delegation for Item Selection (Performance Fix)
    const pickerResults = document.getElementById("item-picker-results");
    if (pickerResults) {
      pickerResults.addEventListener("click", (e) => {
        const card = e.target.closest(".glass-card");
        if (card && card.dataset.itemName) {
          const itemName = card.dataset.itemName;
          // Find item in current list
          const item = this.items.find((i) => i.name === itemName);
          if (item) {
            this.addItem(item);
          }
        }
      });
    }
  },

  open() {
    // Notifica Hub para ocultar o menu global
    if (window.parent && window.parent !== window) {
      window.parent.dispatchEvent(new CustomEvent("hide-hub-ui"));
    }

    const modal = document.getElementById("item-picker-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    setTimeout(() => modal.classList.add("modal-open"), 10);
    this.isOpen = true;
    this.renderLimit = 50;
    this.setTab(this.currentTab);
  },

  close() {
    // Se o modal de encomenda principal estiver aberto, não mostra o menu do Hub ainda
    const mainModal = document.getElementById("order-modal");
    const isMainModalOpen =
      mainModal && !mainModal.classList.contains("hidden");

    if (!isMainModalOpen && window.parent && window.parent !== window) {
      window.parent.dispatchEvent(new CustomEvent("show-hub-ui"));
    }

    const modal = document.getElementById("item-picker-modal");
    if (!modal) return;

    const card = modal.querySelector(".glass-card");
    if (card) {
      card.classList.add("imploding");
    }

    modal.classList.remove("modal-open");
    setTimeout(() => {
      modal.classList.add("hidden");
      if (card) card.classList.remove("imploding");
    }, 400);
    this.isOpen = false;
  },

  setTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll(".picker-tab-btn").forEach((btn) => {
      if (btn.dataset.tab === tab) {
        btn.classList.add("bg-primary", "border-primary", "shadow-neon");
        btn.classList.remove("border-slate-600", "text-slate-400");
        btn.style.color = "var(--color-text-on-primary)";
      } else {
        btn.classList.remove("bg-primary", "border-primary", "shadow-neon");
        btn.classList.add("border-slate-600", "text-slate-400");
        btn.style.color = "";
      }
    });

    this.items =
      window.dataByProfession && window.dataByProfession[tab]
        ? window.dataByProfession[tab]
        : [];

    // Fallbacks
    if (this.items.length === 0) {
      if (tab === "cacador" && typeof cacadorItems !== "undefined")
        this.items = cacadorItems;
      else if (tab === "alquimista" && typeof alquimistaItems !== "undefined")
        this.items = alquimistaItems;
      else if (tab === "minerador" && typeof mineradorItems !== "undefined")
        this.items = mineradorItems;
      else if (tab === "artesao" && typeof artesaoItems !== "undefined")
        this.items = artesaoItems;
      else if (tab === "alfaiate" && typeof alfaiateItems !== "undefined")
        this.items = alfaiateItems;
    }

    this.renderLimit = 50;
    this.render();
  },

  formatMoney(amount) {
    let totalBz = Math.floor(amount);
    let oz = Math.floor(totalBz / 10000);
    let remainder = totalBz % 10000;
    let sz = Math.floor(remainder / 100);
    let bz = remainder % 100;

    let parts = [];
    if (oz > 0)
      parts.push(
        `<span class="text-coin-oz font-bold drop-shadow-sm">${oz} Oz</span>`,
      );
    if (sz > 0)
      parts.push(
        `<span class="text-coin-sz font-bold drop-shadow-sm">${sz} Sz</span>`,
      );
    if (bz > 0 || (oz === 0 && sz === 0))
      parts.push(
        `<span class="text-coin-bz font-bold drop-shadow-sm">${bz} Bz</span>`,
      );

    return parts.join(" ");
  },

  formatMoneyShort(amount) {
    // Helper for Card View simplified
    let totalBz = Math.floor(amount);
    let oz = Math.floor(totalBz / 10000);
    let remainder = totalBz % 10000;
    let sz = Math.floor(remainder / 100);
    let bz = remainder % 100;

    let parts = [];
    if (oz > 0) parts.push(`${oz}oz`);
    if (sz > 0) parts.push(`${sz}sz`);
    if (bz > 0 || parts.length === 0) parts.push(`${bz}bz`);
    return parts.join(" ");
  },

  addItem(item) {
    NotesManager.addItemCard(item);
    this.close();
  },

  // --- Pagination & Performance ---
  renderQueue: [],
  BATCH_SIZE: 50,
  currentBatchIndex: 0,

  render() {
    const container = document.getElementById("item-picker-results");
    if (!container) return;

    this.currentBatchIndex = 0;
    this.renderQueue = [];

    const searchInput = document.getElementById("picker-search");
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const eraFilter =
      document.getElementById("picker-era-filter")?.value || "all";
    const sort = document.getElementById("picker-sort")?.value || "name-asc";

    let filtered = this.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search) ||
        (item.cat && item.cat.toLowerCase().includes(search));
      const matchesEra =
        eraFilter === "all" ||
        (item.era !== undefined ? item.era.toString() : "0") === eraFilter;
      return matchesSearch && matchesEra;
    });

    const isDefaultSort = sort === "name-asc";

    // Build Render Queue
    if (filtered.length === 0) {
      container.innerHTML =
        '<div class="col-span-1 md:col-span-2 lg:col-span-4 text-center text-slate-500 py-10 italic">Nenhum item encontrado.</div>';
      return;
    }

    if (isDefaultSort) {
      // GROUPED BY CATEGORY
      const grouped = filtered.reduce((acc, item) => {
        const cat = item.cat || "Outros";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {});

      const categories = Object.keys(grouped);

      categories.forEach((cat) => {
        // Add Header to Queue
        this.renderQueue.push({ type: "header", content: cat });
        // Add Items to Queue
        grouped[cat].forEach((item) => {
          this.renderQueue.push({ type: "item", data: item });
        });
      });
    } else {
      // LINEAR SORT
      filtered.sort((a, b) => {
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "price-asc") return a.min - b.min;
        if (sort === "price-desc") return b.min - a.min;
        if (sort === "era-asc") return (a.era || 0) - (b.era || 0);
        return 0;
      });

      filtered.forEach((item) => {
        this.renderQueue.push({ type: "item", data: item });
      });
    }

    // Clear Container & Start
    container.innerHTML = "";
    this.renderBatch();
  },

  renderBatch() {
    const container = document.getElementById("item-picker-results");
    if (!container) return;

    // Remove old "Load More" button if exists
    const oldBtn = document.getElementById("load-more-btn-container");
    if (oldBtn) oldBtn.remove();

    const start = this.currentBatchIndex;
    const end = Math.min(start + this.BATCH_SIZE, this.renderQueue.length);

    let batchHTML = "";

    // Helper to generate Card HTML String
    const getCardHTML = (item) => {
      const era = item.era || 0;
      const badgeClass = `badge-era-${era}`;
      const eraText = era === 0 ? "" : `Era ${era}`;
      // Escape quotes for data attribute
      const safeName = item.name.replace(/"/g, "&quot;");

      return `
            <div 
                class="glass-card p-3 rounded-lg hover:border-primary cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between h-full animate-fade-in-down"
                data-item-name="${safeName}"
            >
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-sm text-primary group-hover:text-white transition-colors line-clamp-2 leading-tight">${
                          item.name
                        }</span>
                        ${
                          eraText
                            ? `<span class="${badgeClass} text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ml-2 whitespace-nowrap shadow-sm">${eraText}</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="mt-auto pt-2 border-t border-white/5">
                    <div class="text-right">
                        <div class="text-xs font-bold text-slate-200">${this.formatMoney(
                          item.min,
                        )}</div>
                    </div>
                </div>
                <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
        `;
    };

    for (let i = start; i < end; i++) {
      const node = this.renderQueue[i];
      if (node.type === "header") {
        // We need to close the grid flow for a full-width header?
        // CSS Grid handles full-width if we use col-span-full
        batchHTML += `
                <div class="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 mt-4 mb-2 border-b border-primary/30 pb-1 animate-fade-in">
                    <h2 class="text-xl font-bold text-primary uppercase tracking-widest pl-2 border-l-4 border-primary">${node.content}</h2>
                </div>
            `;
      } else {
        batchHTML += getCardHTML(node.data);
      }
    }

    container.insertAdjacentHTML("beforeend", batchHTML);
    this.currentBatchIndex = end;

    container.insertAdjacentHTML("beforeend", batchHTML);
    this.currentBatchIndex = end;
  },
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Managers
  setTimeout(() => {
    NotesManager.init();
    ItemPicker.init();
  }, 100);

  // Bind "Add Product" button in the Order Modal to open Picker
  // We will inject this button in index.html, but let's ensure the listener is set
  const openPickerBtn = document.getElementById("open-picker-btn");
  if (openPickerBtn) {
    openPickerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      ItemPicker.open();
    });
  } else {
    // Observers or retry if button isn't immediately available (dynamic?)
    // Actually, we'll put it in static HTML or the modal render
  }

  // Close Picker Button
  const closePickerBtn = document.getElementById("close-picker-btn");
  if (closePickerBtn)
    closePickerBtn.addEventListener("click", () => ItemPicker.close());

  // Close on backdrop click
  const pickerModal = document.getElementById("item-picker-modal");
  if (pickerModal) {
    pickerModal.addEventListener("click", (e) => {
      if (e.target === pickerModal) ItemPicker.close();
    });
  }
});
