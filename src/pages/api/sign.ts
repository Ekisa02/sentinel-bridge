import type { NextApiRequest, NextApiResponse } from 'next';
import { signer } from '@services/signer';
import { metrics } from '@services/metrics';
import { logger } from '@utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  metrics.requestCounter.inc({ route: '/api/sign' });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const { type, payload } = req.body as { type: 'message' | 'transaction'; payload: any };

    if (!type || !payload) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    if (type === 'message') {
      const signature = await signer.signMessage(String(payload));
      return res.status(200).json({ signature });
    }

    if (type === 'transaction') {
      // here we accept a transaction object partially assembled and return signed serialized tx
      const signed = await signer.signTransaction(payload);
      return res.status(200).json({ signed });
    }

    return res.status(400).json({ error: 'invalid_type' });
  } catch (err: any) {
    logger.error({ err }, 'sign handler error');
    metrics.errorCounter.inc({ route: '/api/sign' });
    res.status(500).json({ error: 'sign_error', message: err?.message });
  }
}
