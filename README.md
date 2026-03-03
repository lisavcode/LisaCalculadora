# 🌟 LisaCalculadora

Uma incrível e linda calculadora de itens e valores feita com design moderno em TailwindCSS! Construída especialmente para facilitar cálculos precisos de valores de diferentes itens e categorias, incluindo um visual premium com efeitos glassmorphism e cores neon suaves.

## ✨ Funcionalidades Principais

### 💼 Filtros por Profissões 
A calculadora vem categorizada de forma super otimizada pelas profissões:
- 🏹 **Caçador**
- 🧪 **Alquimista**
- ⚒️ **Minerador**
- 🪚 **Artesão**
- 🪡 **Alfaiate**

### 💰 Sistema Monetário Inteligente e Imersivo
Você não precisa se preocupar em converter valores difíceis! A calculadora automaticamente pega os valores em "Bz" (Bronze) e os converte para:
- 💛 **Ouro (Gz):** Moedas de altíssimo valor.
- 🩶 **Prata (Sz):** Moedas de valor mediano.
- 🧡 **Bronze (Bz):** Moeda base de troca padrão.
*(Matemática interna: 1 Gz = 10.000 Bz / 1 Sz = 100 Bz).*

### 🎨 Personalização de Temas In-App (Settings.js)
Através de um incrível painel Modal, você pode mudar o visual completamente!
- Alternar entre presets criados: **Escuro, Claro, Monocromático e Custom!**
- Deslizantes dinâmicos de **Matiz (Hue)** e **Saturação**! Você pode mudar a paleta de cores inteira girando o slider de matiz de -180° a +180°.
- Alteração independente de cores (fundo principal, barra de inputs, botões).
- Trava de Cores! (Tranque uma cor com o 🔒 para que ela não seja afetada pela barra de distorção de Matiz).
*Tudo que você altera fica salvo permanentemente no seu navegador (`localStorage`).*

### ⚙️ Precificação Personalizada e Estimativas
- Todo item tem um "Unitário" contendo seu valor mínimo e máximo.
- Você quer vender abaixo da tabela? Acima? Clicando na **Barra Variável** ou inserindo um número no input do cartão, você modifica o valor do item! E sim, esse valor perssonalizado é salvo para que na sua próxima visita você não tenha que colocar tudo de novo.
- A **Estimativa** te dá uma prévia instantânea de preços totais baseados na "quantidade (Qtd)" multiplicada pela variação real de preço.

### 🔍 Buscas, Filtros e Categorização
Achando os itens rapidamente:
- **Barra de Busca Dinâmica:** Pesquise imediatamente o nome ou a categoria (Ex: Digite o nome do item para filtrá-lo rapidamente).
- **Filtros de Era:** Você pode filtrar as eras evolutivas de (Eras de 1 a 6) para ver apenas itens daquela Era. (Cada era tem uma **Badge super fofa** colorida associada a ela!).
- **Ordenações Inteligentes:** Organize os cards de A-Z, por quem tem o maior ou menor preço, etc.

### 🛡️ Proteção e Configuração Variada (Config.js)
Tem um arquivo chamado `config.js` onde você controla toda a gestão e configurações restritivas:
- **Proteções Globais:** Botão de bloqueio de botão direito do mouse, proibir a seleção de texto e atalhos F12 (Security Mode).
- **Proteção de Print:** Tela preta temporária se detectado captura de tela.
- **Sistema Básico de DRM:** Define quais links (domínios permitidos como localhost e Github Pages) estão autorizados a executar essa calculadora magnifica, negando acessos fora da lista.

## 📝 Acesso Técnico & Modificações Rápidas
A calculadora lê os dados de profissões na pasta `/professions/` (Ex: `cacador.js`). Lembre-se, todos os atalhos visuais, links para a página (Discord na config, links de créditos, etc) estão no `config.js` que foi criado justamete para outros usuários não precisarem adivinhar nas linhas de código do HTML. Use lá! 

Aproveite ao máximo e tenha a melhor agilidade no gerenciamento dos seus estoques e economias! 🌌
