import { create as createIpfs } from 'ipfs-http-client';

const IPFS_ENDPOINT = process.env.IPFS_ENDPOINT || 'https://ipfs.io';

export function createIpfsClient() {
  // ipfs-http-client accepts url string for remote nodes
  return createIpfs({ url: IPFS_ENDPOINT });
}

export async function addBuffer(buffer: Uint8Array | Buffer) {
  const client = createIpfsClient();
  const result = await client.add(buffer);
  return result.cid.toString();
}
