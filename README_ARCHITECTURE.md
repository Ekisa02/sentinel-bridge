# Sentinel Bridge — Architecture Notes

This file contains a concise architectural summary and operational considerations.

- Single codebase combining front-end (Next.js) and server logic (API routes). This enables quick deployments and serverless hosting.
- Service boundaries:
  - lib/: thin protocol adapters to 3rd-party libraries (ethers, ipfs). Keep them dependency-free of the app to ease replacement.
  - services/: adapt lib to business logic (e.g., signer implements KMS fallback).
  - pages/api/: HTTP surface. Keep handlers lean — delegate to services.
- Observability: metrics (prom-client) are collected with default Node metrics and custom counters. Export /api/_metrics for Prometheus scraping.
- Security: signing APIs should be placed behind a gateway or protected with mTLS/JWT. Replace environment key with KMS integration for production (AWS KMS, Azure Key Vault, Hashicorp Vault, or an HSM).
- Scaling considerations: rateLimiter is in-memory and only for single process. Use Redis or distributed rate-limiters when scaling horizontally.

Operational checklist for production:
- Replace in-memory rate limiter with Redis-based sliding window.
- Use a managed KMS; never store private keys in CI or environment variables for long-term keys.
- Set up Prometheus & Grafana to scrape /api/_metrics.
- Configure structured logs to your log aggregator (CloudWatch, Datadog, Loki).
