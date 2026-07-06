import React from 'react';

export default function AcupointRenderer({ text, customClasses = "" }) {
  if (!text) return null;
  
  const stringText = String(text);
  let paragraphs = [];
  
  // 💡 智慧段落切分：橫著連寫時，會自動依據「數字/國字編號」或「黑點符號 • - *」切分段落
  if (!stringText.includes('\n') && /(?:\d+|[一二三四五六七八九十]+)[.、)]|[-•*]\s/.test(stringText)) {
    paragraphs = stringText.split(/(?=(?:\d+|[一二三四五六七八九十]+)[.、)]|[-•*]\s)/).map(p => p.trim());
  } else {
    paragraphs = stringText.split(/\\n|\r?\n/).map(p => p.trim());
  }

  // 🔬 特定詞彙粗體解析器：將 **文字** 轉換成加粗標籤，並加上精緻的草本微襯底（bg-[#3A4F3F]/5）
  const parseBoldSyntax = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong 
            key={i} 
            className="font-bold text-[#2C3C30] bg-[#3A4F3F]/5 px-1.5 py-0.5 rounded-md mx-0.5 inline-block align-baseline"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return paragraphs
    .filter(p => p !== '')
    .map((paragraph, index) => {
      // 🔍 偵測是否為列表項目（包含編號類 或 黑點符號類）
      const isListItem = /^((?:\d+|[一二三四五六七八九十]+)[.、)]|[\u2460-\u2473]|[-•*])/.test(paragraph);
      
      return (
        <p 
          key={index} 
          // 🎯 懸掛縮進：如果是編號或黑點開頭，自動對齊第二行，字體絕對不卡在編號下方！
          className={`text-justify leading-relaxed break-all mb-1.5 last:mb-0 ${isListItem ? 'pl-6 -indent-6' : ''} ${customClasses}`}
        >
          {parseBoldSyntax(paragraph)}
        </p>
      );
    });
}