import { useState } from 'react';
import { notification } from 'antd';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;


export const usePDFProcessor = (contractPages, setContractPages, saveToHistory, nextPageId) => {
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [pdfInputRef, setPdfInputRef] = useState(null);

  const handlePdfUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      notification.error({
        message: "Invalid File",
        description: "Please select a PDF file"
      });
      return;
    }

    setIsPdfProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
  data: arrayBuffer,
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
  cMapPacked: true,
}).promise;

      
      const numPages = pdf.numPages;
      const fileName = file.name.replace(/\.pdf$/i, '');
      const pdfPages = [];
      
      const QUALITY = 2.0;
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: QUALITY * devicePixelRatio });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', {
          alpha: false,
          desynchronized: true
        });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'print',
          enableWebGL: true,
        }).promise;
        
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        pdfPages.push({
          id: nextPageId.current++,
          title: fileName,
          elements: [],
          backgroundImage: dataUrl,
          isPdfPage: true,
          pdfPageNum: pageNum,
          pdfFileName: fileName,
          pdfTotalPages: numPages,
          locked: true,
          pdfQuality: QUALITY,
          originalWidth: viewport.width / devicePixelRatio,
          originalHeight: viewport.height / devicePixelRatio
        });
      }
      
      const newPages = [...contractPages, ...pdfPages];
      setContractPages(newPages);
      
      notification.success({
        message: "PDF Successfully Imported",
        description: `${numPages} page(s) have been added`
      });
      
      saveToHistory(newPages, [], 'add_pdf_pages');
      
    } catch (error) {
      console.error('PDF processing error:', error);
      notification.error({
        message: "PDF Processing Error",
        description: "The PDF could not be processed"
      });
    } finally {
      setIsPdfProcessing(false);
    }
  };

  return {
    handlePdfUpload,
    isPdfProcessing,
    setPdfInputRef
  };
};
