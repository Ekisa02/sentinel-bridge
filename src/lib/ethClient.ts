import { ethers } from 'ethers';

const RPC_UPSTREAM = process.env.RPC_UPSTREAM || 'https://mainnet.infura.io/v3/YOUR-PROJECT';

export function createProvider(url?: string) {
  return new ethers.JsonRpcProvider(url ?? RPC_UPSTREAM);
}

export async function getChainId(provider = createProvider()) {
  return provider.getNetwork().then((n) => n.chainId);
}
