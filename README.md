# Lisa Calculadora e Sistema de Encomendas

Um utilitário web inteligente para planejamento, orçamentação e precificação flexível, desenhado focando em jogos ou sistemas de profissões de "crafting" e serviços.

## 🚀 Principais Funcionalidades

### 1. Sistema Embutido de Profissões e Hub Central
Toda a aplicação reside em uma central única com menu lateral (Nav), onde cada ferramenta funciona inteiramente sob uma paleta de cores unificadas ("configuração de temas") e interface responsiva (PWA Style). A transição ocorre suavemente via navegação Iframe. O aplicativo suporta separação por **profissões nativas** na exibição:
- Caçador
- Alquimista
- Minerador
- Artesão
- Ferreiro
- Alfaiate
- Treinador

### 2. Calculadora Dinâmica
- Permite calcular instantaneamente os custos prováveis de uma grande lista de itens por profissão.
- Sistema de customização de valores, caso o jogador queira aplicar uma taxa própria a cada unidade específica antes do cálculo final.
- Sistema especial de "hover de ingredientes" moderno e discreto, que exibe quais são as dependências precisas ('ingredientes / matérias primas') ao qual um item é feito quando o mouse paira sobre ele.

### 3. Encomendas Inteligentes (`/encomendas`)
- Possui um modal especial estilo "Carrinho de Compras" permitindo inserir "Nova Encomenda".
- O criador de Pedidos tem visualização da receita do item sem recarregar a página (revelando os ingredientes necessários no design de blocos suspensos).
- Cálculo interativo do total de custos da encomenda somando automaticamente cada recurso selecionado.
- Botão interativo para envio prático ou sumário dos pedidos registrados.

### 4. Changelog Global 
Um sistema engenhoso e interativo de notas de atualizações acoplado ao Hub central:
- Ao haverem edições recém-publicadas (`changelog_data.js`), um novo visitante imediatamente vê um ícone de sininho ou sino pulsando junto da bolinha indicadora de Notificação no menu lateral.
- Modal dedicado que lista categoricamente tudo que foi alterado e inserido ("O que há de novo"). O app lembra na memória cache (LocalStorage) quando a novidade foi lida, cessando e apagando o ícone vermelho.

### 5. Estilização Elegante de Interface de Usuário
Tudo estruturado via **Tailwind CSS**. Painéis translúcidos em *Glassmorphism* em uma proposta "Neon/Neon Dark", e forte controle e injeção responsiva via CSS variando segundo o painel do sistema do "Client".

---

> Construído e adaptado sob princípios escalonáveis com forte desacoplagem dos dados nativos dos `front-components`, mantendo a fluidez de uma interface unificada, amigável e expansível.

---

## 🏷️ Padrão de Versionamento (Semântica)

Este projeto segue o padrão X.Y.Z de versionamento para o seu Changelog:

- **1.**X.Z (`Master`): A primeira casa muda apenas quando houverem alterações e refatorações *muito grandes* que mudem o contexto ou a forma de usar a aplicação.
- X.**1**.Z (`Updates`): A segunda divisão é utilizada para modificações que adicionam novas features, menus, ou alteram o formato/texto de componentes existentes.
- X.Y.**1** (`Hotfix`): A terceira categoria se direciona a atualizações de correção rápidas (hotfixes) e alterações ou balanços pequenos (ajuste de CSS, troca simples de nomenclaturas).
