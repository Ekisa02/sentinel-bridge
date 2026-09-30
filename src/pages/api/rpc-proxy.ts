import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { rateLimiter } from '@services/rateLimiter';
import { metrics } from '@services/metrics';
import { logger } from '@utils/logger';

const RPC_UPSTREAM = process.env.RPC_UPSTREAM || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  metrics.requestCounter.inc({ route: '/api/rpc-proxy' });

  if (!RPC_UPSTREAM) {
    logger.error('rpc upstream not configured');
    return res.status(500).json({ error: 'RPC_UPSTREAM not configured' });
  }

  try {
    const allowed = rateLimiter.check(req.socket.remoteAddress ?? 'unknown');
    if (!allowed) {
      metrics.rateLimitCounter.inc();
      return res.status(429).json({ error: 'rate_limited' });
    }

    // Expect JSON-RPC payload forwarded from client
    const response = await axios.post(RPC_UPSTREAM, req.body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15_000
    });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    logger.error({ err }, 'rpc-proxy error');
    metrics.errorCounter.inc({ route: '/api/rpc-proxy' });
    res.status(502).json({ error: 'upstream_error', details: err?.message });
  }
}
