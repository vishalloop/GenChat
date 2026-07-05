export interface IConfig {
    MONGO_URI : string;
    JWT_SECRET : string;
    NODE_ENV : string;
    REDIS_HOST : string;
    REDIS_PORT : string;
    REDIS_PASSWORD : string;
    GOOGLE_CLIENT_ID : string;
    GOOGLE_CLIENT_SECRET : string;
    GROQ_API_KEY : string;
    GROQ_MODEL : string;
    PINECONE_API_KEY : string;
    PINECONE_INDEX_NAME : string;
    MISTRAL_API_KEY : string;
    MISTRAL_EMBED_MODEL : string;
}