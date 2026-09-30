import { createProvider, getChainId } from '../src/lib/ethClient';

jest.setTimeout(10000);

describe('ethClient', () => {
  test('createProvider returns provider and getChainId resolves', async () => {
    const provider = createProvider();
    expect(provider).toBeDefined();
    const cid = await getChainId(provider);
    expect(typeof cid === 'number').toBeTruthy();
  });
});
