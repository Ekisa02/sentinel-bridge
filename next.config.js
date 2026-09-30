/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_UPSTREAM: process.env.RPC_UPSTREAM,
    SIGNER_PRIVATE_KEY: process.env.SIGNER_PRIVATE_KEY
  }
};
module.exports = nextConfig;
