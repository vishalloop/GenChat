import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "mongoose",
    "ioredis",
    "bcryptjs",
    "jsonwebtoken",
    "@pinecone-database/pinecone",
    "@langchain/groq",
    "@langchain/core",
    "node-fetch",
  ],
};

export default nextConfig;