import { config } from "@/lib/config";
import { Pinecone, PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});


export async function initPinecone() {
  return Promise.resolve();
}

export async function upsertMessageVector(
  id: string,
  values: number[],
  metadata: RecordMetadata
) {
  
  const index = pc.index(config.PINECONE_INDEX_NAME);
  
  const record: PineconeRecord = { id, values, metadata };
  
  await index.upsert({
    records: [record]
  });
}

export async function querySimilar(
  vector: number[],
  topK: number,
  filter?: RecordMetadata
) {
  const index = pc.index(config.PINECONE_INDEX_NAME);
  
  const response = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter,
  });
  
  return response.matches ?? [];
}
