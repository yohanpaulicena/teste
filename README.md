# Premium Agency Dashboard

Dashboard premium multi-abas para apresentar resultados de Social Media e Tráfego Pago para clientes.

## Stack

- Next.js (App Router) + React + TypeScript
- TailwindCSS
- Recharts
- lucide-react (ícones)

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/dashboard/geral`.

> Não existe `index.html` neste projeto. O conteúdo é renderizado pelo App Router do Next.

## Configuração do banco (MySQL)

Crie um arquivo `.env.local` baseado em `.env.local.example` com as credenciais do seu MySQL remoto.

## Como abrir o preview (qual opção escolher)

- **Use o servidor do Next.js**, não um arquivo HTML estático.
- A URL correta é **`http://localhost:3000/dashboard/geral`** após rodar `npm run dev`.
- **Não abra `index.html` no navegador**, porque ele não existe neste projeto e não renderiza o dashboard.

## Estrutura de pastas

```
app/
  dashboard/
    geral/
    trafego/
    social/
    meta-ads/
    google-ads/
    instagram/
    facebook/
components/
  Charts.tsx
  ChartCard.tsx
  DataTable.tsx
  FiltersBar.tsx
  Funnel.tsx
  Header.tsx
  KpiCard.tsx
  Sidebar.tsx
  Tabs.tsx
  TopEntities.tsx
lib/
  auth.ts
  data.ts
  format.ts
styles/
  globals.css
```

## Onde plugar APIs

Os dados estão centralizados em `lib/data.ts`, com funções prontas para serem substituídas por chamadas reais:

- `getKpis(filters, scope)`
- `getTimeSeries(filters, scope)`
- `getCampaignTable(filters, scope)`
- `getTopPosts(filters, scope)`
- `getTopEntities(filters, scope)`

Basta trocar o corpo dessas funções por integrações com seu backend/MySQL.

## Single-tenant (cliente único)

O usuário atual é simulado em `lib/auth.ts`:

```ts
currentUser = { role: 'client', clientId: 123 }
```

Quando `role === 'client'`, o filtro de cliente fica oculto e os dados são filtrados por `clientId` automaticamente.

## Observações de estilo

- Tema dark premium (bg0/bg1) com acentos neon (ciano/rosa/roxo).
- Cards com glassmorphism, bordas com gradiente neon e glow sutil no hover.
- Gráficos responsivos com tooltip premium.
