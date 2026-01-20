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
  KpiCard.tsx
  Sidebar.tsx
  Topbar.tsx
  TopEntities.tsx
lib/
  data.ts
 data/
  mock.ts
```

## Onde plugar APIs

Os dados estão centralizados em `lib/data.ts`, com funções prontas para serem substituídas por chamadas reais:

- `getKpis(filters, scope)`
- `getTimeSeries(filters, scope)`
- `getCampaignTable(filters, scope)`
- `getTopPosts(filters, scope)`
- `getTopEntities(filters, scope)`

Basta trocar o corpo dessas funções por integrações com seu backend/MySQL.

## Observações de estilo

- Tema dark premium com acentos neon.
- Cards com glow, gradientes e sombras suaves.
- Layout responsivo com sidebar fixa (desktop) e conteúdo adaptável.
