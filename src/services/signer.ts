import { Wallet, BytesLike, SignedTransaction } from 'ethers';
import { createProvider } from '@lib/ethClient';
import { logger } from '@utils/logger';

const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  logger.warn('SIGNER_PRIVATE_KEY not set — signer endpoints will error in production');
}

export const signer = {
  wallet: PRIVATE_KEY ? new Wallet(PRIVATE_KEY, createProvider()) : undefined,

  async signMessage(message: string) {
    if (!this.wallet) throw new Error('no_signer_available');
    return this.wallet.signMessage(message);
  },

  async signTransaction(tx: Record<string, any>) {
    if (!this.wallet) throw new Error('no_signer_available');
    // expects partial tx object; ethers will fill defaults via the provider
    const signed = await this.wallet.signTransaction(tx as any);
    return signed as SignedTransaction | string;
  }
};
