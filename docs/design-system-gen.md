# DESIGN SYSTEM — TOKENS SEMÂNTICOS

## TAREFA

Crie um Design System completo para meu app em formato .md, utilizando exclusivamente os tokens semânticos definidos abaixo.

## INSTRUÇÕES

* Analise o contexto/screenshots do meu app (se fornecidos)
* Defina a paleta de cores específica mapeada para cada token
* Documente os componentes principais com seus estados
* Mantenha o documento simples, prático e implementável

## ESTRUTURA DO DOCUMENTO

* Visão geral do app
* Paleta de cores (valores reais → tokens)
* Componentes documentados
* Exemplos de uso

---

## Regra de Ouro

NUNCA use valores arbitrários (16px, #3B82F6, etc.) SEMPRE use os tokens semânticos abaixo. Se precisar de um valor que não existe, PERGUNTE antes de inventar.

---

## CORES

### Texto

* **text-primary**: cor principal de títulos e texto importante
* **text-secondary**: cor de texto de apoio, legendas, descrições
* **text-muted**: cor de placeholders, hints, texto desabilitado
* **text-on-dark**: texto sobre fundos escuros
* **text-on-brand**: texto sobre cor primária da marca

### Superfícies (fundos)

* **surface-page**: fundo principal da página
* **surface-section**: fundo de seções alternadas
* **surface-card**: fundo de cards
* **surface-subtle**: fundos sutis, áreas de destaque leve
* **surface-elevated**: elementos elevados (com sombra)

### Ações (botões, links)

* **action-primary**: botões principais, links
* **action-primary-hover**: hover de action-primary
* **action-primary-active**: estado pressed
* **action-secondary**: botões secundários
* **action-strong**: CTAs de alta conversão (geralmente escuro)
* **action-strong-hover**: hover de action-strong

### Bordas

* **border-default**: bordas padrão
* **border-subtle**: bordas muito sutis
* **border-focus**: cor do focus ring

### Status

* **status-success**: sucesso, confirmação
* **status-warning**: alertas, atenção
* **status-error**: erros, problemas

---

## ESPAÇAMENTO

Use apenas estes valores:

* **space-1**: 4px (mínimo, ícones inline)
* **space-2**: 8px (gaps pequenos)
* **space-3**: 12px (gaps médios internos)
* **space-4**: 16px (padding padrão)
* **space-6**: 24px (padding de cards)
* **space-8**: 32px (gaps entre seções)
* **space-12**: 48px (padding de seções)
* **space-16**: 64px (padding vertical de seções grandes)
* **space-20**: 80px (seções hero)

---

## TIPOGRAFIA

### Tamanhos

* **text-xs**: 12px (badges, labels pequenos)
* **text-sm**: 14px (texto secundário, captions)
* **text-base**: 16px (corpo de texto)
* **text-lg**: 18px (texto destacado)
* **text-xl**: 20px (subtítulos)
* **text-2xl**: 24px (títulos de cards)
* **text-3xl**: 30px (títulos de seção)
* **text-4xl**: 36px (títulos principais)
* **text-5xl**: 48px (headlines hero)

### Pesos

* **font-normal**: 400 (corpo)
* **font-medium**: 500 (ênfase leve)
* **font-semibold**: 600 (títulos, botões)
* **font-bold**: 700 (headlines)

---

## BORDAS E SOMBRAS

### Border Radius

* **radius-sm**: 6px (inputs, badges)
* **radius-md**: 8px (botões)
* **radius-lg**: 12px (cards pequenos)
* **radius-xl**: 16px (cards grandes)
* **radius-2xl**: 24px (cards hero)
* **radius-full**: 9999px (avatares, pills)

### Sombras

* **shadow-sm**: sombra sutil (inputs, hover states)
* **shadow-md**: sombra média (cards, dropdowns)
* **shadow-lg**: sombra forte (modais, popovers)
* **shadow-card**: sombra específica para cards
* **shadow-card-hover**: sombra para hover de cards
* **shadow-button-primary**: sombra para botões primários

---

## COMPONENTES (padrões obrigatórios)

### Botões

* **Primary**: bg action-primary, texto text-on-brand, radius-md, shadow-button-primary
* **Secondary**: bg surface-card, texto text-primary, borda border-default
* **Strong (CTA)**: bg action-strong, texto branco, shadow forte

### Cards

* **Background**: surface-card
* **Radius**: radius-xl
* **Shadow**: shadow-card
* **Padding**: space-6
* **Hover**: shadow-card-hover

### Inputs

* **Background**: surface-card
* **Border**: border-default
* **Radius**: radius-sm
* **Focus**: border-focus com ring

---

## ESTADOS OBRIGATÓRIOS

Todo componente interativo DEVE ter:

1. **Default**: estado normal
2. **Hover**: feedback visual ao passar mouse
3. **Active/Pressed**: feedback ao clicar
4. **Focus**: ring visível para acessibilidade
5. **Disabled**: opacidade reduzida, cursor not-allowed

---

## REGRAS FINAIS

1. Nunca invente valores. Use apenas tokens.
2. Se um token não existe pro que você precisa, pergunte.
3. Mantenha consistência: mesmo componente = mesmos tokens sempre.
4. Mobile-first: comece pelo mobile, adapte pro desktop.