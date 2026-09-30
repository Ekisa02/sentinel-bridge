import { signer } from '../src/services/signer';

describe('signer service (unit)', () => {
  test('sign message errors if no key', async () => {
    // If no SIGNER_PRIVATE_KEY is set in CI, the signer should throw a specific error
    if (!process.env.SIGNER_PRIVATE_KEY) {
      await expect(signer.signMessage('hello')).rejects.toThrow('no_signer_available');
    } else {
      const sig = await signer.signMessage('hello');
      expect(typeof sig).toBe('string');
    }
  });
});
