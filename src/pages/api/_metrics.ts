import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@services/metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const metrics = await client.register.metrics();
    res.setHeader('Content-Type', client.register.contentType);
    res.status(200).send(metrics);
  } catch (err: any) {
    res.status(500).json({ error: 'metrics_error', message: err?.message });
  }
}
