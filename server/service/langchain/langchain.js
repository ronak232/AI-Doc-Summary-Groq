import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const pdfParser = async (filepath) => {
  console.log('filepath', filepath);
  try {
    if (filepath) {
      const loader = new PDFLoader(filepath, {
        parsedItemSeparator: "",
      });
      const docs = await loader.load();
      const content = docs[0].pageContent;

      const result = groq.chat.completions
        .create({
          messages: [
            {
              role: "system",
              content: `You are a ai summarizer who summarizes whole document ${content} with the below following points and give me the json format: 
          1. Keep concise and relevant
          2. Summarize the document or text provided by user in short and informational format.
          4. Read the original work
          5. Identify main points...
          6. Structure your summary similarly to the original work.
          7. Use simple language and avoid unnecessary words.
          8. Break the text down into sections.
          9. Identify and write down short key points in each section of provided docs.
          10. Keep short and relevant`,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_completion_tokens: 1440,
          response_format: {
            type: "json_object",
          },
        })
        .withResponse();
      return (await result).data.choices[0].message.content;
    }
  } catch (error) {
    throw new Error("Enable to generate...");
  }
};

export { pdfParser };
