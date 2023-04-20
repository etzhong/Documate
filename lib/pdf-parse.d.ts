declare module 'pdf-parse' {
  function pdfParse(dataBuffer: Buffer, options?: object): Promise<any>;
  export = pdfParse;
}