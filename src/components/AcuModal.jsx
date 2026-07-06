import React from 'react';

/**
 * 🎯 穴道/經絡專用智慧排版組件
 * @param {string} text - 來自資料庫的穴道文字內容
 * @param {string} customClasses - 外部額外傳入的 Tailwind 樣式
 */
export function AcupointRenderer({ text, customClasses = "" }) {
  if (!text) return null;
  
  const stringText = String(text);
  let paragraphs = [];
  
  // 💡 段落自動切分：支援 \n 換行，或自動依據「數字/國字編號」與「黑點符號 • - *」進行橫向切行
  if (!stringText.includes('\n') && /(?:\d+|[一二三四五六七八九十]+)[.、)]|[-•*]\s/.test(stringText)) {
    paragraphs = stringText.split(/(?=(?:\d+|[一二三四五六七八九十]+)[.、)]|[-•*]\s)/).map(p => p.trim());
  } else {
    paragraphs = stringText.split(/\\n|\r?\n/).map(p => p.trim());
  }

  // 🔬 穴道粗體解析器：將 **穴道名稱** 轉為加粗標籤，並加上精緻的視覺襯底
  const parseAcupointBold = (str) => {
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

  return (
    <div className={`space-y-2 text-sm text-[#3A4F3F] ${customClasses}`}>
      {paragraphs
        .filter(p => p !== '')
        .map((paragraph, index) => {
          // 🔍 偵測開頭是否為 列表項目（編號類 或 黑點符號類）
          const isListItem = /^((?:\d+|[一二三四五六七八九十]+)[.、)]|[\u2460-\u2473]|[-•*])/.test(paragraph);
          
          return (
            <p 
              key={index} 
              // 🎯 懸掛縮進：如果是編號或黑點開頭，自動對齊第二行，字體絕對不卡在編號下方
              className={`text-justify leading-relaxed break-all ${isListItem ? 'pl-6 -indent-6' : ''}`}
            >
              {parseAcupointBold(paragraph)}
            </p>
          );
        })}
    </div>
  );
}