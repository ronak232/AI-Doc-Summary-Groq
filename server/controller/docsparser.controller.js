import { pdfParser } from "../service/langchain/langchain.js";
import fs from "fs";
export const handleDocumentParser = async (req, res) => {
  const file = req.file.path;
  try {
    if (!file) {
      res.status(404).json({
        message: "Unknown path error...",
      });
    }
    fs.readFile(file, () => {
      pdfParser(file);
      res.status(200).json({
        success: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error..." });
  }
};
