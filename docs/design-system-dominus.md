📐 Design System - Dominus Platform
🎨 Estilo e Tematização
Tokens de Design (CSS Variables)
Localizado em: client/src/index.css

CSS
@theme inline {
  /* Fontes */
  --font-sans: "Inter", sans-serif;
  --font-display: "Plus Jakarta Sans", sans-serif;
  
  /* Border Radius */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */

  /* Cores Base */
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
}
🧩 Componentes UI
1. TactileCard - Componente de Card com Interação
📁 client/src/components/ui/tactile-card.tsx

Características:

Bordas arredondadas (rounded-xl)
Sombra suave (shadow-sm)
Transições suaves (transition-all duration-200)
Prop hover para efeitos interativos:
hover:shadow-md - aumenta sombra
hover:border-primary/20 - destaca borda
hover:-translate-y-0.5 - efeito de elevação
cursor-pointer - indica interatividade
Uso:

TSX
<TactileCard hover={true} className="p-4">
  {/* Conteúdo */}
</TactileCard>
2. Skeleton - Componente de Loading
📁 client/src/components/ui/skeleton.tsx

Características:

Animação de pulso (animate-pulse)
Cor de fundo baseada na cor primária (bg-primary/10)
Bordas arredondadas (rounded-md)
Uso:

TSX
<Skeleton className="h-12 w-full" />
3. Item - Componente de Lista
📁 client/src/components/ui/item.tsx

Variantes:

default: Estilo padrão sem fundo
icon: Com ícone em fundo cinza (bg-muted)
image: Para avatares/imagens redondas
Tamanhos:

TSX
sm: "gap-2.5 px-4 py-3"
default: "gap-3 px-5 py-4"
🎭 Ícones
Biblioteca: lucide-react

Ícones usados no sistema:

TSX
import {
  Plus, GripVertical, Trash2, Type, Image,
  LayoutGrid, FileText, Star, Quote, DollarSign,
  Columns, Minus, Award, Users, FileCheck,
  PenTool, AlertCircle, Palette, Settings,
  ExternalLink, Globe, ChevronRight, MoreHorizontal
} from "lucide-react";
Padrões de tamanho:

Pequeno: size-4 (16px)
Padrão: size-5 (20px)
Ícones de lista: size-8 com bordas arredondadas
📦 Padrões de Composição
Estrutura de Dialog/Modal
TSX
<DialogHeader>
  <DialogTitle />
  <DialogDescription />
</DialogHeader>
<DialogContent>
  {/* Conteúdo principal */}
</DialogContent>
<DialogFooter>
  {/* Ações */}
</DialogFooter>
Estrutura de Drawer
TSX
<DrawerContent>
  <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
  <DrawerHeader />
  <DrawerFooter />
</DrawerContent>
Características:

Handle visual no topo (h-2 w-[100px] rounded-full bg-muted)
Bordas arredondadas superiores (rounded-t-[10px])
Overlay com transparência (bg-black/80)
🎯 Diretrizes de Estilo
Espaçamento
Pequeno: gap-1.5 / gap-2
Médio: gap-3 / gap-4
Grande: gap-6
Padding de Containers
Cards: p-4 / p-6
Headers: p-4
Footers: p-6 pt-0
Tipografia
TSX
// Títulos
text-xl font-semibold         // Seções
text-sm font-medium           // Labels

// Descrições
text-sm text-muted-foreground  // Texto secundário
text-[0.8rem]                 // Texto pequeno (forms)
Estados de Hover
TSX
hover:shadow-md               // Elevação
hover:opacity-100             // Fade in
hover:border-primary/20       // Destaque sutil
hover:-translate-y-0.5        // Elevação física
📱 Responsividade
Grid Layouts
TSX
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Texto
TSX
text-center sm:text-left
Espaçamento
TSX
gap-1.5 // Mobile
gap-2.5 // Tablet+
♿ Acessibilidade
ARIA Labels
TSX
aria-label="Go to next page"
aria-describedby={formDescriptionId}
aria-invalid={!!error}
aria-hidden="true" // Para elementos decorativos
Screen Reader Only
TSX
<span className="sr-only">More</span>
Focus States
TSX
focus:outline-none 
focus:ring-2 
focus:ring-ring 
focus:ring-offset-2
🔄 Transições
Padrão:

TSX
transition-all duration-200
Para opacidade:

TSX
transition-opacity
🎨 Sistema de Cores
Nomenclatura de Cores HSL
TSX
hsl(var(--primary))           // Cor primária
hsl(var(--muted-foreground))  // Texto secundário
hsl(var(--destructive))       // Erros/exclusões
hsl(var(--accent))            // Destaques
Opacidades
TSX
opacity-70   // Elementos inativos
opacity-80   // Elementos do sistema
opacity-90   // Texto secundário
bg-black/80  // Overlays
📚 Stack Tecnológico
UI Framework: React 18 + TypeScript
Biblioteca de Componentes: shadcn/ui (baseado em Radix UI)
Estilização: Tailwind CSS v4
Ícones: lucide-react
Animações: tailwindcss-animate
Drag & Drop: @dnd-kit
Gráficos: Recharts
✅ Checklist para Novos Componentes
 Usar forwardRef para componentes que precisam de ref
 Definir displayName para debug no React DevTools
 Usar função cn() para merge de classes
 Suportar prop className para customização
 Adicionar ARIA labels quando necessário
 Usar tokens de cor CSS variables
 Seguir padrões de espaçamento estabelecidos
 Adicionar estados de hover/focus
 Testar responsividade
Essas são as regras principais extraídas do código. O sistema utiliza uma abordagem baseada em Tailwind CSS com componentes compostos do Radix UI, priorizando acessibilidade, consistência visual e experiência tátil através de transições suaves.