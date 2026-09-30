import client from 'prom-client';

const prefix = process.env.METRICS_PREFIX ?? 'sentinel_bridge_';

// default registry
client.collectDefaultMetrics({ prefix });

export const metrics = {
  requestCounter: new client.Counter({ name: `${prefix}requests_total`, help: 'Total HTTP requests', labelNames: ['route'] }),
  errorCounter: new client.Counter({ name: `${prefix}errors_total`, help: 'Total errors', labelNames: ['route'] }),
  rateLimitCounter: new client.Counter({ name: `${prefix}rate_limited_total`, help: 'Rate limited requests' })
};

export default client;
