import type { NextApiRequest, NextApiResponse } from 'next';
import { metrics } from '@services/metrics';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const uptime = process.uptime();
  const status = {
    status: 'ok',
    uptime,
    timestamp: Date.now()
  };
  // simple metric increment
  metrics.requestCounter.inc({ route: '/api/health' });
  res.status(200).json(status);
}
