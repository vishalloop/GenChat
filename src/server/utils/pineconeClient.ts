// src/server/utils/pineconeClient.ts
import { config } from "@/lib/config";
import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";

// 1. Initialize the client directly. Environment parameters are now managed automatically inside Pinecone.
const pc = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

/** 
 * No longer needed! You can remove this function entirely, 
 * or keep it as an empty mock if other parts of your code call it during server startup.
 */
export async function initPinecone() {
  // Safe to remove or leave empty since client initializes immediately above.
  return Promise.resolve();
}

/** Upsert a single vector (one message) */
export async function upsertMessageVector(
  id: string,
  values: number[],
  metadata: RecordMetadata
) {
  // Use lowercase .index()
  const index = pc.index(config.PINECONE_INDEX_NAME);
  
  // Use PineconeRecord instead of Vector type
  const record: PineconeRecord = { id, values, metadata };
  
  // Payload structural syntax is flattened (no 'upsertRequest' wrapper needed)
  await index.upsert({
    records: [record]
  });
}

/** Query similar vectors */
export async function querySimilar(
  vector: number[],
  topK: number,
  filter?: RecordMetadata
) {
  const index = pc.index(config.PINECONE_INDEX_NAME);
  
  // Payload structural syntax is flattened (no 'queryRequest' wrapper needed)
  const response = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter,
  });
  
  return response.matches ?? [];
}
