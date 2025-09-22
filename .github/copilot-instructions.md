# JP Store - Instruções para Assistente IA

## Visão Geral do Projeto

JP Store é uma plataforma de e-commerce moderna construída com Next.js 13, Prisma e TypeScript. O projeto segue uma arquitetura estruturada com clara separação de responsabilidades.

## Padrões Principais de Arquitetura

### Autenticação

- Utiliza NextAuth com provedor OAuth do Google
- Configuração de autenticação em `src/lib/auth.ts`
- Rotas protegidas em `src/app/(dashboard)/*`
- Sessões de usuário gerenciadas através do adaptador Prisma

### Banco de Dados e Modelo de Dados

- PostgreSQL com ORM Prisma
- Entidades principais: User, Cart, Order, Product (ver `prisma/schema.prisma`)
- Operações de banco de dados centralizadas em `src/actions/*`

### Arquitetura Frontend

- Estrutura App Router (Next.js 13)
- Grupos de rotas:
  - `(auth)`: Páginas de autenticação
  - `(dashboard)`: Área administrativa
  - `(home)`: Loja pública
- Hierarquia de componentes:
  - Componentes de página em `src/app/**/page.tsx`
  - Componentes UI compartilhados em `src/components/ui`
  - Componentes específicos de rota em seus respectivos diretórios

### Gerenciamento de Estado

- Estado do carrinho gerenciado através do Context API (`src/providers/cart.tsx`)
- Estado de autenticação através da sessão NextAuth
- Server actions para mutações de dados

## Tarefas Comuns de Desenvolvimento

### Adicionando Novos Produtos

1. Atualizar schema do Prisma se necessário
2. Criar migração: `npx prisma migrate dev`
3. Adicionar produto através do painel admin `/admin/products`

### Integração de Pagamento

- Integração com Stripe em `src/actions/checkout.ts`
- Tratamento de sucesso de pagamento em `src/app/api/order/payment-success/route.ts`

### Componentes UI

- Utiliza componentes shadcn/ui com Tailwind CSS
- Componentes customizados seguem design atômico em `src/components/ui`
- Seguir padrões existentes de componentes para consistência

## Convenções do Projeto

### Estrutura de Arquivos

- Componentes de página: `src/app/**/page.tsx`
- Manipuladores de rota: `src/app/api/**/route.ts`
- Tipos compartilhados: `src/@types/*`
- Lógica de negócio: `src/actions/*`

### Padrões de Código

- Usar server actions para mutações de dados
- Manter componentes UI puros, mover lógica para actions
- Tratar estados de carregamento com suspense boundaries
- Seguir padrões existentes de tratamento de erro usando toast notifications

### Autenticação

- Verificar estado de autenticação usando hook `useSession()`
- Rotas protegidas devem redirecionar para login
- Rotas admin requerem verificação adicional de função

## Pontos de Atenção

- Estado do carrinho requer persistência manual para refresh
- Caminhos de imagem devem ser absolutos para o componente Image do Next.js
- Webhooks do Stripe precisam de configuração adequada de ambiente
- Rotas admin requerem tanto autenticação quanto validação de função
