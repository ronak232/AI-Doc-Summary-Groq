import { pdfParser } from "../service/langchain/langchain.js";
import fs from "fs";
export const handleDocumentParser = async (req, res) => {
  const file = req.file.path;
  try {
    if (!file) {
      return res.status(404).json({
        message: "Unknown path error...",
      });
    }
    const data = await pdfParser(file);
    console.log('data', data);
    fs.readFile(file, () => {
      if (data && data.length > 0) {
       return res.status(200).json({
          success: true,
          data,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error..." });
  }
};
