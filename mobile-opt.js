const fs = require('fs');
const style = `
    <style id='mobile-simplifier'>
      @media (max-width: 768px) {
        * {
          transition: none !important;
          animation: none !important;
          backdrop-filter: none !important;
        }
        .glass-card, [class*="glass"] {
          background-color: rgb(var(--color-surface-rgb) / 0.95) !important;
        }
        .shadow-neon, [class*="shadow-neon"], .hover\\:shadow-neon:hover {
          box-shadow: none !important;
        }
      }
    </style>
  </head>`;

const files = ['index.html', 'inicio.html', 'calculadora/index.html', 'encomendas/index.html', 'taverna.html', 'acesso-negado.html', 'atualizacoes.html'];

for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('mobile-simplifier')) {
      content = content.replace(/<\/head>/i, style);
      fs.writeFileSync(f, content);
      console.log('Modified ' + f);
    }
  }
}
