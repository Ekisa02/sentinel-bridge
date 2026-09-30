# Sentinel Bridge

A modular Web3 infrastructure toolkit built with Next.js and TypeScript. Sentinel Bridge provides an extensible foundation for common Web3 infrastructure responsibilities: RPC proxying, transaction/message signing, IPFS interaction, metrics and health endpoints, and opinionated operational tooling (logging, rate limiting, metrics).

This repository is organized for clarity and rapid extension so teams can compose production-grade infrastructure microservices and developer-facing dashboards.

## Architecture Overview

- Next.js for light front-end and serverless API routes (fast deploys on Vercel, Cloudflare Pages w/ Workers, or Node servers).
- TypeScript-first modular services:
  - lib/: Core protocol clients (Ethereum via ethers, IPFS client).
  - services/: Height-of-stack infrastructure utilities (signer, metrics, rate-limiter, queue adapters).
  - pages/api/: HTTP/JSON-RPC endpoints (health, rpc-proxy, sign) implemented as serverless-friendly handlers.
  - utils/: shared helpers such as logging and error normalization.
- Observability and ops:
  - Prometheus-compatible metrics (prom-client).
  - Structured logging (pino).
  - Health and readiness probes.

Example request flows:
- RPC Proxy: Client -> /api/rpc-proxy -> upstream configured JSON-RPC node (with optional rate-limit & metrics).
- Signer: Client -> /api/sign -> service signs a message/tx using KMS-backed or environment-backed key (with strict access controls).
- IPFS upload: integrate via lib/ipfsClient for pinning or retrieval.

## Quickstart (Local Development)

Prerequisites:
- Node >= 18 LTS
- npm or yarn

1. Clone

   git clone <repo>
   cd sentinel-bridge

2. Install

   npm install
   # or yarn

3. Copy environment sample and set required values

   cp .env.example .env.local
   # Edit .env.local and set RPC_UPSTREAM, SIGNER_PRIVATE_KEY (use test/fixture keys for local dev), etc.

4. Run development server

   npm run dev

5. Open http://localhost:3000

## Build & Production

- Build: npm run build
- Start (production): npm run start

Deploy to any Next.js-compatible host. For containerized deployment, build the Docker image (Dockerfile included) and run.

## API Endpoints

- GET /api/health — Basic health + uptime
- POST /api/rpc-proxy — Accepts JSON-RPC payload and forwards to upstream RPC (observability, rate-limiting applied)
- POST /api/sign — Signs a message or transaction payload (see API docs below)

### /api/rpc-proxy
POST body: standard JSON-RPC payload (object or array). The handler forwards to configured RPC_UPSTREAM and returns the raw upstream response. The route maintains limited validation and metrics.

### /api/sign
POST body:
{
  "type": "message" | "transaction",
  "payload": string | object,
  "address": string (optional, for verification)
}

The signer uses a configured private key or (in production) hooks to a KMS provider. Production systems must ensure keys are protected and signing requests are authenticated/authorized.

## Environment variables (.env)

- NODE_ENV=development|production
- PORT=3000
- RPC_UPSTREAM=https://rpc.yournode.example
- SIGNER_PRIVATE_KEY=0xabc... (local dev only — use KMS in production)
- METRICS_PREFIX=sentinel_bridge_
- RATE_LIMIT_REQUESTS=100
- RATE_LIMIT_WINDOW_MS=60000

See .env.example for defaults.

## Testing

Unit tests use Jest + ts-jest. Run:

  npm run test

## Project Layout

- package.json - dependency manifest & scripts
- tsconfig.json - TypeScript configuration
- src/
  - pages/api/* - HTTP API routes
  - lib/* - protocol clients (ethers, ipfs)
  - services/* - application-level services (signer, metrics, rate-limiter)
  - utils/* - logging, errors
  - pages/index.tsx - simple UI placeholder
- tests/ - Jest unit tests

## Extending

Sentinel Bridge is designed to be extended: add new protocol adapters to lib/, new endpoints under pages/api/ and wire them to services. For production, replace environment-key signing with your preferred KMS/HSM connector and add robust auth (mTLS, JWT with short TTLs, or gateway-level shielding).

## Security & Operational Notes
- Do not store private keys in repo or plaintext. Use vaults/KMS.
- Always enable request authentication on signing endpoints in production.
- Rate-limit the RPC proxy to avoid abuse.
- Collect and export metrics to Prometheus or compatible backends.

---

If you find this project useful, star it and contribute new protocol adapters, monitoring exporters, and KMS integrations.
