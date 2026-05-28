import { PDFParse } from "pdf-parse";
import fs from "fs";

async function parsePDF(filePath: string): Promise<any> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({data: dataBuffer});
    const text = await parser.getText();
    return text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
}

export default parsePDF;