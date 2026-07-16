import React from 'react';

export const parseBoldSyntax = (str) => {
  if (!str) return str;

  const lineStartRegex = /^(肌肉|神經|血管)([：:])/;
  const parts = str.split(/(\*\*.*?\*\*|==.*?==|《.*?》|【.*?】)/g);
  
  return parts.map((part, i) => {
    if (!part) return null;
    
    if (part.startsWith('==') && part.endsWith('==')) {
      return <mark key={i} className="bg-[#F3E1C5] text-[#2C3C30] px-1 py-0.5 rounded-md font-bold mx-0.5 shadow-sm">{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#1A261C]" style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith('《') && part.endsWith('》')) || (part.startsWith('【') && part.endsWith('】'))) {
      return <strong key={i} className="text-[#1A261C]" style={{ fontWeight: 'bold' }}>{part}</strong>;
    }

    if (lineStartRegex.test(part)) {
      return part.replace(lineStartRegex, (match, keyword, colon) => (
        <React.Fragment key={i}>
          <strong className="text-[#1A261C]" style={{ fontWeight: 'bold' }}>{keyword}</strong>{colon}
        </React.Fragment>
      ));
    }

    return part;
  });
};

export const renderFormattedText = (text, customClasses = "") => {
  if (!text) return <span className="italic text-gray-400">無記載</span>;
  
  const lines = typeof text === 'string' ? text.split('\n').filter(l => l.trim() !== '') : [text];
  
  return (
    <div className={`text-[15px] leading-8 text-[#6B7A6E] ${customClasses}`}>
      {lines.map((line, i) => (
        <div key={i} className="mb-1">
          {typeof line === 'string' ? parseBoldSyntax(line) : line}
        </div>
      ))}
    </div>
  );
};