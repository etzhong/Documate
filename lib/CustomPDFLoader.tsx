// import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
// import PDFJS from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';

class CustomPDFLoader {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async loadAndSplit(): Promise<Array<{ content: string; pageNumber: number }>> {
    const pdf = await this.loadPDF();
    const numPages = pdf.numPages;
    const pagesWithMetadata = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await this.extractText(page);
      pagesWithMetadata.push({ content, pageNumber: i });
    }

    return pagesWithMetadata;
  }

  private async loadPDF(): Promise<pdfjsLib.PDFDocumentProxy> {
    return await pdfjsLib.getDocument(this.filePath).promise;
  }

  private async extractText(page: any): Promise<string> {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
  }
}

export default CustomPDFLoader;
