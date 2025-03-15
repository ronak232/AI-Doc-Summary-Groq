import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const pdfParser = async (filepath) => {
  try {
    if (filepath) {
      const extname = path.extname(filepath);
      if (extname.includes(".txt") || extname.includes(".docx")) {
        const data = fs.readFileSync(filepath, "utf-8");
        const response = groq.chat.completions
          .create({
            messages: [
              {
                role: "system",
                content: `You are an AI-powered document summarizer. Your task is to process the provided document and return a **structured HTML response** using **Tailwind CSS** for styling.
            
          
              🔹 **Formatting Rules**:
              - Use **<h1> for the main title**, styled with \`text-3xl font-bold text-center mb-6\`
              - Use **<h2> for sections**, styled with \`text-2xl font-semibold mt-6 mb-4\`
              - Use **<h3> for subtopics**, styled with \`text-xl font-medium mt-4 mb-2\`
              - Use **<p> for paragraphs**, styled with \`text-gray-700 leading-relaxed mb-4\`
              - Use **<ul><li> for lists**, styled with \`list-disc list-inside space-y-2\`
              - Ensure **proper margins, spacing, and readability**
              - Preserve the **original document structure** while keeping it concise.
              - Response summary with covering all important pages points.
          
              🔹 **Example Output Format**:
              
              <div class="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
                <h1 class="text-3xl font-bold text-center mb-6">[Document Title]</h1>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Introduction</h2>
                <p class="text-gray-700 leading-relaxed mb-4">[Introduction content]</p>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Main Topic 1</h2>
                <p class="text-gray-700 leading-relaxed mb-4">[Summary of the main topic]</p>
          
                <h3 class="text-xl font-medium mt-4 mb-2">Subtopic 1.1</h3>
                <p class="text-gray-700 leading-relaxed mb-4">[Details about the subtopic]</p>
          
                <h3 class="text-xl font-medium mt-4 mb-2">Subtopic 1.2</h3>
                <p class="text-gray-700 leading-relaxed mb-4">[Additional information]</p>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Key Takeaways</h2>
                <ul class="list-disc list-inside space-y-2">
                  <li class="text-gray-700">[Important point 1]</li>
                  <li class="text-gray-700">[Important point 2]</li>
                  <li class="text-gray-700">[Final key insight]</li>
                </ul>
              </div>
          
              Now, process the following document and return a **structured HTML summary** with Tailwind CSS styling:
              Don't share anything about structure of response...
              ${data}
              `,
              },
            ],

            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            stream: false,
          })
          .withResponse();
        return (await response).data.choices[0].message.content.replace(
          /\\n/g,
          ""
        );
      } else {
        const loader = new PDFLoader(filepath, {
          parsedItemSeparator: "",
        });
        const docs = await loader.load();
        const content = docs[0].pageContent;
        return extractDocContent(content);
      }
    }
  } catch (error) {
    throw new Error("Enable to generate...");
  }
};

const extractDocContent = async (content) => {
  const response = groq.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content: `You are an AI-powered document summarizer. Your task is to process the provided document and return a **structured HTML response** using **Tailwind CSS** for styling.
            
          
              🔹 **Formatting Rules**:
              - Use **<h1> for the main title**, styled with \`text-3xl font-bold text-center mb-6\`
              - Use **<h2> for sections**, styled with \`text-2xl font-semibold mt-6 mb-4\`
              - Use **<h3> for subtopics**, styled with \`text-xl font-medium mt-4 mb-2\`
              - Use **<p> for paragraphs**, styled with \`text-gray-700 leading-relaxed mb-4\`
              - Use **<ul><li> for lists**, styled with \`list-disc list-inside space-y-2\`
              - Ensure **proper margins, spacing, and readability**
              - Preserve the **original document structure** while keeping it concise.
              - Response summary with covering all important pages points.
          
              🔹 **Example Output Format**:
              
              <div class="max-w-3xl mx-auto p-6 shadow-lg rounded-lg">
                <h1 class="text-3xl font-bold text-center mb-6">[Document Title]</h1>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Introduction</h2>
                <p class="text-gray-700 leading-relaxed mb-4">[Introduction content]</p>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Main Topic 1</h2>
                <p class="text-gray-700 leading-relaxed mb-4">[Summary of the main topic]</p>
          
                <h3 class="text-xl font-medium mt-4 mb-2">Subtopic 1.1</h3>
                <p class="text-gray-700 leading-relaxed mb-4">[Details about the subtopic]</p>
          
                <h3 class="text-xl font-medium mt-4 mb-2">Subtopic 1.2</h3>
                <p class="text-gray-700 leading-relaxed mb-4">[Additional information]</p>
          
                <h2 class="text-2xl font-semibold mt-6 mb-4">Key Takeaways</h2>
                <ul class="list-disc list-inside space-y-2">
                  <li class="text-gray-700">[Important point 1]</li>
                  <li class="text-gray-700">[Important point 2]</li>
                  <li class="text-gray-700">[Final key insight]</li>
                </ul>
              </div>
          
              Now, process the following document and return a **structured HTML summary** with Tailwind CSS styling:
              Don't share anything about structure of response...
              ${content}
              `,
        },
      ],

      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      stream: false,
    })
    .withResponse();
  return (await response).data.choices[0].message.content.replace(/\\n/g, "");
};

export { pdfParser };
