import { config } from "@/lib/config";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGroq } from "@langchain/groq"
import z from "zod";

const llm = new ChatGroq({
    model: config.GROQ_MODEL,
    apiKey : config.GROQ_API_KEY,
});

export async function aiReply (message : string) : Promise<string> {
        const humanMessage = new HumanMessage(`Behave like a helpful assistant. Conversation. 
            ${message}
        Reply to the latest user message.`);

    const response = await llm.invoke([humanMessage]);

    return response.text;
};

export async function generateTitle(message: string): Promise<string> {
    // 1. Force the title constraint explicitly in the prompt 
    const humanMessage = new HumanMessage(
        `Behave like a title generator. Generate a crisp title for the following message. 
        CRITICAL RULE: The title MUST be between 2 and 5 words long. Do not use quotes.
        
        Message: ${message}`
    );

    // 2. Define a clean structural object schema that LLM engines can easily parse
    const titleSchema = z.object({
        title: z.string().describe("The generated title, strictly containing between 2 to 5 words.")
    });

    // 3. Bind the structure to the model
    const modelWithStructure = llm.withStructuredOutput(titleSchema);

    // 4. Invoke the structured model
    const response = await modelWithStructure.invoke([humanMessage]);

    // 5. Access the structured field directly (response is now typed as { title: string })
    return response.title;
}