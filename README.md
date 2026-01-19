# Sync CRM (NestJS)

## Requisitos
- Node.js >= 24
- Docker

## Como rodar
1) Instale dependências
```
pnpm install
```

2) Crie o arquivo `.env`, baseado no `.env.example`

3) Suba o MongoDB local
```
docker compose up -d
```

4) Rode a aplicação
```
pnpm start:dev
```

## Endpoints
- `POST /contacts/sync` dispara uma sincronização manual
- `GET /contacts` lista contatos (query: `page`, `limit`)
- `GET /contacts/:id` busca contato pelo id

## Observações
- A sincronização automática roda em intervalo configurável (`CRM_POLL_INTERVAL_MS`).

## Exemplos
```
curl --location --request POST 'http://localhost:3000/contacts/sync' | jq
```

```
curl --location --request GET 'http://localhost:3000/contacts?page=1&limit=20' | jq
```

```
curl --location --request GET 'http://localhost:3000/contacts/hs_0001' | jq
```


