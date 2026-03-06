const CURRENT_VERSION = changelogData[0].version;

function initChangelog() {
  const lastReadVersion = localStorage.getItem("changelogRead");

  // O botão aparece sempre independentemente se tem leitura ou não
  showChangelogNotification();

  // Caso já tenha lido a versão atual, tira a bolinha imediatamente
  if (lastReadVersion === CURRENT_VERSION) {
    const badge = document.getElementById("changelog-badge");
    if (badge) badge.remove();
  }
}

function markChangelogAsRead() {
  localStorage.setItem("changelogRead", CURRENT_VERSION);
  // Remove a bolinha vermelha se existir
  const badge = document.getElementById("changelog-badge");
  if (badge) {
    badge.remove();
  }
}

function showChangelogNotification() {
  // Disabled: We now have a dedicated nav-item in index.html for Atualizações.
  return;
}

function openChangelogModal() {
  markChangelogAsRead();
  let modal = document.getElementById("changelog-modal");

  if (!modal) {
    let contentHTML = changelogData
      .map(
        (log) => `
      <div class="mb-6 relative">
        <div class="absolute -left-[23px] top-1.5 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgb(var(--color-primary-rgb)/0.8)]"></div>
        <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-3">
          <h3 class="text-xl font-bold text-primary">v${log.version}</h3>
          <span class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-text-muted)">${log.date}</span>
        </div>
        <ul class="list-disc list-inside text-sm space-y-2 text-slate-200 ml-2">
          ${log.changes.map((change) => `<li>${change}</li>`).join("")}
        </ul>
      </div>
    `,
      )
      .join("");

    const html = `
      <div id="changelog-modal" class="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 pl-0 md:pl-28 opacity-0 transition-opacity duration-300 pointer-events-none" style="color: white; font-family: 'Outfit', sans-serif;">
        <div class="glass-card max-w-2xl w-full max-h-[85vh] rounded-2xl flex flex-col shadow-2xl border border-primary/30 transform scale-95 transition-transform duration-300" id="changelog-modal-content">
          <div class="p-5 md:px-8 border-b border-primary/20 flex justify-between items-center bg-primary/5 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <h2 class="text-xl font-bold text-white uppercase tracking-wider">Notas de Atualização</h2>
            </div>
            <button onclick="closeChangelogModal()" class="text-gray-400 hover:text-primary transition-colors p-1">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="p-6 md:p-8 overflow-y-auto no-scrollbar flex-1 relative text-left">
             <div class="absolute left-[20px] md:left-[28px] top-[40px] bottom-[32px] w-[2px] bg-primary/20"></div>
             <div class="relative pl-6">
                ${contentHTML}
             </div>
          </div>
          <div class="p-5 border-t border-primary/20 flex justify-end bg-black/40 rounded-b-2xl">
            <button onclick="closeChangelogModal()" class="px-8 py-2.5 bg-primary/10 text-primary border border-primary/40 hover:bg-primary hover:text-black font-bold rounded-xl transition-all uppercase text-sm tracking-widest shadow-[0_0_15px_rgb(var(--color-primary-rgb)/0.1)] hover:shadow-[0_0_20px_rgb(var(--color-primary-rgb)/0.4)]">
              Entendi
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.getElementById("changelog-modal");
  }

  // Exibir a modal
  modal.classList.remove("opacity-0", "pointer-events-none");
  const modalContent = document.getElementById("changelog-modal-content");
  modalContent.classList.remove("scale-95");
  modalContent.classList.add("scale-100");
}

function closeChangelogModal() {
  const modal = document.getElementById("changelog-modal");
  if (modal) {
    const modalContent = document.getElementById("changelog-modal-content");
    modalContent.classList.remove("scale-100");
    modalContent.classList.add("scale-95");
    modal.classList.add("opacity-0", "pointer-events-none");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChangelog);
} else {
  initChangelog();
}
