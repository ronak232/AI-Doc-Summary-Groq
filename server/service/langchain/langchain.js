import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const pdfParser = async (filepath) => {
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
              content: `You are an AI-powered document summarizer. Your task is to generate a **well-structured summary** of the provided document while keeping only the necessary HTML tags for rendering on the frontend.
          
              🔹 **Guidelines:**
              - Extract all **key points, topics, and subtopics** from the document.
              - Keep the response **structured and easy to read**.
              - Format the response using **only essential HTML tags**:
                - **Main title:** <h1>Main Topic</h1>
                - **Subtopics:** <h2>Subtopic</h2>
                - **Key sections:** <h3>Sub-sections</h3>
                - **Details:** <p>Paragraph text...</p>
                - **Key takeaways:** <ul><li>Point 1</li><li>Point 2</li></ul>
              - Avoid unnecessary HTML elements like <html>, <head>, <body>.
              - Ensure the summary is **detailed yet concise**.
          
              🔹 **Example Output Format:**
              <h1>Main Topic</h1>
              <h2>Introduction</h2>
              <p>Brief but detailed summary of the introduction...</p>
              
              <h2>Main Topic 1</h2>
              <p>Summary of this topic covering all necessary details...</p>
          
              <h3>Subtopic 1.1</h3>
              <p>Details about this subtopic...</p>
          
              <h3>Subtopic 1.2</h3>
              <p>Additional information...</p>
          
              <h2>Key Takeaways</h2>
              <ul>
                <li>Important conclusion 1</li>
                <li>Important conclusion 2</li>
                <li>Final important point</li>
              </ul>
          
              Now, summarize the following document using **only essential HTML tags** for structured output:
          
              ${content}
              `,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_completion_tokens: 1440,
          stream: false,
        })
        .withResponse();
      return (await result).data.choices[0].message.content.replace(/\\n/g, "");
    }
  } catch (error) {
    throw new Error("Enable to generate...");
  }
};

export { pdfParser };
