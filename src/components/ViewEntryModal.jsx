import React, { useState, useEffect } from 'react';
import { parseBoldSyntax as processInlineSyntax } from "../utils/formatUtils.jsx";
const UI = { text: "text-[15px] leading-8 text-[#6B7A6E]", title: "text-4xl font-bold text-[#6B9080] mb-4" };
export default function ViewEntryModal({ item, onClose }) {
  const [selectedContent, setSelectedContent] = useState(null);
  useEffect(() => { setSelectedContent(null); }, [item]);
  if (!item) return null;
  const renderFormattedText = (text, customClasses = "") => {
    if (!text) return <span className="italic text-gray-400">無記載</span>;
    const lines = typeof text === 'string' ? text.split('\n').filter(l => l.trim() !== '') : [text];
    return (<div className={`${UI.text} ${customClasses}`}>{lines.map((line, i) => { const trimmed = typeof line === 'string' ? line.trim() : line; const isNumbered = /^(?:\d+\.|[一二三四五六七八九十]+[、.])/.test(trimmed); const isIndented = trimmed.startsWith('●'); if (isNumbered) { const splitIndex = trimmed.search(/[.、]/) + 1; return <div key={i} className="grid grid-cols-[auto_1fr] gap-x-2 mb-1"><span className="font-bold shrink-0">{trimmed.substring(0, splitIndex)}</span><span>{processInlineSyntax(trimmed.substring(splitIndex).trim())}</span></div>; } if (isIndented) { return <div key={i} className="flex items-baseline pl-0 mb-1"><span className="text-[#A39284] mr-1.5 inline-block shrink-0 translate-y-[-2px]">●</span><span className="leading-relaxed text-left flex-1">{processInlineSyntax(trimmed.replace('●', '').trim())}</span></div>; } return <div key={i} className="mb-1">{processInlineSyntax(trimmed)}</div>; })}</div>);
  };
  const renderContent = () => {
    switch (item.category) {
      case '書籍': return <BookContent item={item} selectedContent={selectedContent} setSelectedContent={setSelectedContent} onClose={onClose} />;
      case '穴道': return <AcuContent item={item} renderFormattedText={renderFormattedText} />;
      case '中藥': return <HerbContent item={item} renderFormattedText={renderFormattedText} />;
      case '方劑': return <FormulaContent item={item} renderFormattedText={renderFormattedText} />;
      case '精油': return <OilContent item={item} renderFormattedText={renderFormattedText} />;
      default: return <div className="p-8 text-center text-[#A39284]">暫無此類別 UI 設定。</div>;
    }
  };
  return (<div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}><div className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] shadow-2xl relative border border-[#E5E0D8]/40 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}><button onClick={onClose} className="absolute top-5 right-5 text-[#A39284] hover:text-red-500 text-xl z-20">✕</button><div className="flex-1 overflow-y-auto">{renderContent()}</div></div></div>);
}
function BookContent({ item, selectedContent, setSelectedContent }) {
  const getRawTitle = (t) => { const m = t.match(/(.*?)[（\(]別名[：:](.*?)[）\)]/); return m ? m[1].trim() : t; };
  
  const renderTitleWithAlias = (fullTitle) => {
    const match = fullTitle.match(/(.*?)[（\(]別名[：:](.*?)[）\)]/);
    if (match) {
      return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
          <span className="text-2xl md:text-3xl text-[#3A4F3F] font-black">{match[1].trim()}</span>
          <span className="text-xs bg-[#6B9080]/10 text-[#6B9080] font-medium px-2 py-1 rounded border border-[#6B9080]/20 whitespace-nowrap shrink-0">
            別名：{match[2].trim()}
          </span>
        </div>
      );
    }
    return <span className="text-2xl md:text-3xl text-[#3A4F3F] block font-black">{fullTitle}</span>;
  };

  const parseModalSyntax = (str) => {
    const processInline = (text) => {
      const regex = /(\*\*.*?\*\*|==.*?==|【.*?】|《.*?》)/g;
      return text.split(regex).map((part, idx) => {
        if (!part) return null;
        if (part.startsWith('==')) return <mark key={idx} className="bg-[#F3E1C5] px-1 rounded">{part.slice(2, -2)}</mark>;
        if (part.startsWith('**')) return <strong key={idx} className="text-[#AAB8AB] font-bold">{part.replace(/\*\*/g, '')}</strong>;
        if (part.startsWith('《')) return <span key={idx} className="text-[#AAB8AB] font-bold">{part}</span>;
        if (part.startsWith('【')) {
          const hasAlias = part.match(/\(([^)]+)\)/);
          return (<span key={idx} className="flex flex-wrap items-center gap-2 font-bold text-[#3A4F3F] border-l-4 border-[#6B9080] pl-2 my-2 bg-[#F0EDE6]/40 py-1.5 rounded-r-lg w-full"><span>【{part.replace(/\([^)]+\)/, '').replace(/[【】]/g, '')}】</span>{hasAlias && <span className="text-xs font-medium bg-[#6B9080]/10 text-[#6B9080] px-2 py-0.5 rounded border border-[#6B9080]/20">{hasAlias[1]}</span>}</span>);
        }
        return part;
      });
    };
    return <div className="space-y-2">{str.split('\n').filter(l => l.trim() !== '').map((line, i) => <div key={i}>{processInline(line.trim())}</div>)}</div>;
  };

  const { chapters } = item.bookDetails || { chapters: [] };

  return (
    <div className="flex h-full bg-[#FBF9F6]">
      <div className="w-80 border-r border-[#E5E0D8]/60 bg-white overflow-y-auto p-4 space-y-4">
        <h4 className="text-base font-bold text-[#A39284] tracking-widest uppercase px-2 mb-2">目錄</h4>
        {chapters?.map((ch) => (
          <div key={ch.id} className="space-y-1.5">
            <div className="text-base text-[#3A4F3F] bg-[#F7F5F0] px-3 py-2 rounded-xl font-extrabold">📁 {ch.title}</div>
            <div className="pl-2 space-y-1 border-l border-[#6B9080]/20 ml-4">
              {ch.children?.map((child) => (
                <button key={child.id} onClick={() => child.type === 'content' && setSelectedContent(child)} className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2 ${selectedContent?.id === child.id ? 'bg-[#3A4F3F] text-white font-bold' : 'text-[#6B7A6E] hover:bg-[#F7F5F0]'}`}>
                  <span>{child.type === 'folder' ? '📂' : '📄'}</span>
                  <span className="truncate font-black">{getRawTitle(child.title)}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-12 bg-[#FCFBFA]">
        {selectedContent ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-[#E5E0D8]/60 pb-5">{renderTitleWithAlias(selectedContent.title)}</div>
            <div className="text-base leading-loose bg-[#FBF9F6] p-8 rounded-2xl border border-[#E5E0D8]/40 shadow-inner">{selectedContent.text ? parseModalSyntax(selectedContent.text) : "尚無內容。"}</div>
          </div>
        ) : <div className="text-center pt-20 text-[#A39284]">請從左側目錄選擇項目。</div>}
      </div>
    </div>
  );
}

function AcuContent({ item, renderFormattedText }) {
  const { acuTable, acuDetails } = item;

  return (
    <div className="p-8 md:p-12">
      {/* 頂部資訊 */}
      <div className="mb-2">
        <span className="text-[11px] font-medium tracking-widest px-2.5 py-0.5 rounded-full bg-[#EAE7E0] text-[#5C6B5F] font-sans">
          {item.category || '穴道'}百科 · {item.tag || '基本資料'}
        </span>
      </div>

      <h2 className="text-4xl font-bold text-[#3A4F3F] mb-1">{item.name}</h2>
      <p className="text-xs italic tracking-widest text-[#A39284] mt-1.5 mb-6 font-mono border-b border-[#E5E0D8]/40 pb-4">
        INTERNATIONAL CODE: {acuTable?.code || 'N/A'}
      </p>

      {/* 📊 表格區塊 */}
      <div className="overflow-hidden border border-[#E5E0D8]/80 rounded-xl mb-8 shadow-[0_4px_16px_rgba(58,79,63,0.01)] bg-white">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-[#F0EDE6]/60 text-[#4E6654] font-bold text-[14px] tracking-widest border-b border-[#E5E0D8]/70">
              <th className="px-4 py-3 border-r border-[#E5E0D8]/70">主治</th>
              <th className="px-4 py-3 border-r border-[#E5E0D8]/70">別名</th>
              <th className="px-4 py-3 border-r border-[#E5E0D8]/70">經絡</th>
              <th className="px-4 py-3">國際代碼</th>
            </tr>
          </thead>
          <tbody className="text-[#3A4F3F]">
            <tr className="divide-x divide-[#E5E0D8]/60 align-top">
              <td className="px-4 py-3.5 text-[15px] leading-8 text-[#6B7A6E]">{renderFormattedText(acuDetails?.indications || "無")}</td>
              <td className="px-4 py-3.5 text-[15px] leading-8 text-[#6B7A6E]">{renderFormattedText(acuTable?.alias || "無")}</td>
              <td className="px-4 py-3.5 text-[15px] leading-8 text-[#6B7A6E]">{renderFormattedText(acuTable?.meridian || "無")}</td>
              <td className="px-4 py-3.5 text-[15px] leading-8 text-[#6B7A6E]">{renderFormattedText(acuTable?.code || "無")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📝 詳細資訊區塊 */}
      <div className="space-y-6">
        {acuDetails?.type && (
          <div className="bg-[#F4F2ED]/40 p-4 rounded-xl border border-[#E5E0D8]/50">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🏷️ 類別</span>
            <div>{renderFormattedText(acuDetails.type)}</div>
          </div>
        )}

        {acuDetails?.nameExpl && (
          <div className="bg-[#FBFBFA] p-4 rounded-xl border border-[#E5E0D8]/40">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">📖 釋名</span>
            <div>{renderFormattedText(acuDetails.nameExpl)}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {acuDetails?.location && (
            <div className="bg-[#FBFBFA] p-4 rounded-xl border border-[#E5E0D8]/40">
              <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">📍 位置</span>
              <div>{renderFormattedText(acuDetails.location)}</div>
            </div>
          )}
          {acuDetails?.anatomy && (
            <div className="bg-[#FBFBFA] p-4 rounded-xl border border-[#E5E0D8]/40">
              <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">💀 解剖</span>
              <div className="text-[15px] leading-8 text-[#6B7A6E]">
                {acuDetails.anatomy.split('\n').map((line, i) => {
                  const isBoldLine = line.startsWith('肌肉') || line.startsWith('神經') || line.startsWith('血管');
                  if (isBoldLine) {
                    const colonIndex = line.indexOf('：');
                    return (
                      <div key={i} className="mb-1">
                        <strong className="text-[#3A4F3F] !font-bold">{line.substring(0, colonIndex)}</strong>
                        <span>{line.substring(colonIndex)}</span>
                      </div>
                    );
                  }
                  return <div key={i} className="mb-1">{line}</div>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#F5F2EC] p-4 rounded-xl border border-[#3A4F3F]/10">
          <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🎯 操作</span>
          <div>{renderFormattedText(acuDetails?.operation || "未記載操作說明")}</div>
        </div>

        {/* 功效區塊 */}
        <div className="bg-white border border-[#E5E0D8]/80 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(58,79,63,0.01)]">
          <div className="bg-[#F0EDE6]/60 px-4 py-2.5 font-bold text-[15px] tracking-widest text-[#3A4F3F] border-b border-[#E5E0D8]/70">✨ 功效</div>
          <div className="divide-y divide-[#E5E0D8]/60">
            <div className="p-4">
              <span className="font-bold text-[#4E6654] text-[13px] tracking-wider block mb-2">【古代功效記載】</span>
              <div>{renderFormattedText(acuDetails?.effectAncient || "未記載")}</div>
            </div>
            <div className="p-4 bg-[#FBFBFA]">
              <span className="font-bold text-[#4E6654] text-[13px] tracking-wider block mb-2">【現代臨床應用】</span>
              <div>{renderFormattedText(acuDetails?.effectModern || "未記載")}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#3A4F3F]/5 p-4 rounded-xl border border-[#3A4F3F]/10">
          <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🔗 配穴</span>
          <div className="text-[15px] leading-8 text-[#6B7A6E]">
            {acuDetails?.matchingPoints ? (
              acuDetails.matchingPoints.split('\n').map((line, i) => {
                const colonIndex = line.indexOf('：');
                return colonIndex !== -1 ? (
                  <div key={i} className="mb-1">
                    <strong className="text-[#3A4F3F] !font-bold">{line.substring(0, colonIndex)}</strong>
                    <span>{line.substring(colonIndex)}</span>
                  </div>
                ) : <div key={i} className="mb-1">{line}</div>;
              })
            ) : <span className="italic text-gray-400">未記載配穴資訊</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function HerbContent({ item, renderFormattedText }) {
  const displayAlert = item.alert || (['中藥', '方劑'].includes(item.category) ? "本資料庫的內容僅供學術參考，不作商業用途。有病請尋求合法的醫師，非中醫師請勿擅自處方服藥。" : "");

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-4xl font-bold text-[#6B9080] mb-6">{item.name}</h2>

      {/* 類別資訊框 */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 mb-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#6B7A6E]">
          <p><strong>別名：</strong> {item.alias || '無別名'}</p>
          <p><strong>類別：</strong> {item.tag || item.category || '無記載'}</p>
          <p className="col-span-2"><strong>科屬：</strong> {item.family || '無記載'}</p>
          <p><strong>性味：</strong> {item.nature || '無記載'}</p>
          <p><strong>歸經：</strong> {item.meridian || '無記載'}</p>
        </div>
      </div>

      {/* 主要內容陣列 */}
      <div className="space-y-6 text-[#3A4F3F]">
        {[
          { label: '品種來源', val: item.source },
          { label: '功效', val: item.effect },
          { label: '主治', val: item.indications },
          { label: '文獻別錄', val: item.literature },
          { label: '用法用量', val: item.dosage },
          { label: '注意禁忌', val: item.contraindication },
          { label: '現代藥理', val: item.pharmacology },
          { label: '附藥說明', val: item.directions },
          { label: '註', val: item.note }
        ].map((field, i) => (
          <div key={i}>
            <h4 className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">
              {field.label}
            </h4>
            {renderFormattedText(field.val)}
          </div>
        ))}
      </div>

      {/* 重要提醒 */}
      {displayAlert && (
        <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
          <strong className="block mb-1">⚠️ 重要提醒：</strong>
          {displayAlert}
        </div>
      )}
    </div>
  );
}

function FormulaContent({ item, renderFormattedText }) {
  // 方劑專屬的警示邏輯
  const alertContent = item.alert || "本資料庫的內容僅供學術參考，不作商業用途。有病請尋求合法的醫師，非中醫師請勿擅自處方服藥。";

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-4xl font-bold text-[#6B9080] mb-6">{item.name}</h2>

      {/* 2. 類別資訊框 */}
      <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 text-sm text-[#6B7A6E]">
          <p><strong>類別：</strong> {item.tag || item.category || '無記載'}</p>
          <p><strong>來源：</strong> {item.source || '無記載'}</p>
          <p className="col-span-2"><strong>功效：</strong> {item.effect || '無記載'}</p>
        </div>
      </div>

      {/* 3. 主要內容 */}
      <div className="space-y-6 text-[#3A4F3F]">
        {[
          { label: '製法用量', val: item.preparation },
          { label: '主治', val: item.indications },
          { label: '文獻別錄', val: item.literature },
          { label: '方義分析', val: item.analysis },
          { label: '方論', val: item.discussion },
          { label: '辨證要點', val: item.syndrome },
          { label: '加減變化', val: item.modifications },
          { label: '注意禁忌', val: item.contraindication },
          { label: '現代應用', val: item.modernApp },
          { label: '附方', val: item.prescription }
        ].map((field, i) => (
          <div key={i}>
            <h4 className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">
              {field.label}
            </h4>
            {renderFormattedText(field.val)}
          </div>
        ))}
      </div>

      {/* 紅色提醒區塊 */}
      {alertContent && (
        <div className="mt-10 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
          <strong className="block mb-1">⚠️ 重要提醒：</strong>
          {alertContent}
        </div>
      )}
    </div>
  );
}

function OilContent({ item, renderFormattedText }) {
  return (
    <div className="p-8 md:p-12">
      {/* 標籤區 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#EAE7E0] text-[#6B7A6E]">{item.constitutionTag}體質</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#E5EAE6] text-[#4E6654]">{item.chemicalTag}屬性</span>
      </div>

      <h2 className="text-4xl font-bold text-[#6B9080] mb-1">{item.name}</h2>
      <p className="text-base italic text-[#A39284] mt-1 mb-6 font-serif border-b border-[#F7F5F0] pb-4">{item.englishName}</p>

      {/* 資訊表格 */}
      <div className="overflow-hidden border border-[#E5E0D8] rounded-xl mb-8 shadow-sm">
        <table className="w-full text-[15px] border-collapse">
          <tbody className="divide-y divide-[#E5E0D8] text-[#3A4F3F]">
            {[
              { label: '別名', val: item.oilTable?.alias },
              { label: '植物種類／萃取部位', val: item.oilTable?.typePart },
              { label: '萃取方法', val: item.oilTable?.method },
              { label: '拉丁學名', val: item.oilTable?.latin },
              { label: '科名', val: item.oilTable?.family },
              { label: '性味(四氣／五味)', val: item.oilTable?.nature },
              { label: '五行／陰陽屬性', val: item.oilTable?.property },
              { label: '歸經', val: item.oilTable?.meridian },
              { label: '適用體質', val: item.oilTable?.constitution },
              { label: '主治功能', val: item.oilTable?.indications },
              { label: '類比音符', val: item.oilTable?.noteAnalogy },
              { label: '主宰星球', val: item.oilTable?.planet },
              { label: '重要產地', val: item.oilTable?.origin }
            ].map((row, i) => (
              <tr key={i} className="text-center bg-[#FBFBFA]/40">
                <td className="px-4 py-2 font-bold bg-[#FBFBFA] border-r border-[#E5E0D8]">{row.label}</td>
                <td className="px-4 py-2 text-left">{renderFormattedText(row.val)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 主要內容區 */}
      <div className="space-y-5 text-[#3A4F3F]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-[#E5E0D8]/40">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🔍 氣味</span>
            {renderFormattedText(item.oilDetails?.scent)}
          </div>
          <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-[#E5E0D8]/40">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">✨ 外觀</span>
            {renderFormattedText(item.oilDetails?.appearance)}
          </div>
        </div>

        <div>
          <span className="font-bold text-[#4E6654] block mb-1.5 text-base">📜 應用歷史與相關神話</span>
          <div className="bg-[#FBFBFA] px-5 py-4 rounded-xl border border-[#E5E0D8]/30">
            {renderFormattedText(item.oilDetails?.historyMyth)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-[#E5E0D8]/40">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🔬 化學結構</span>
            {renderFormattedText(item.oilDetails?.chemistry)}
          </div>
          <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-[#E5E0D8]/40">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">⚖️ 屬性</span>
            {renderFormattedText(item.oilDetails?.attribute)}
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-red-50/40 p-4 rounded-xl border border-red-200/40">
          <span className="font-bold text-red-800 block mb-1 text-[15px]">⚠️ 注意事項</span>
          {renderFormattedText(item.oilDetails?.caution, "text-red-700/90")}
        </div>

        {/* 深度效能 */}
        <div className="space-y-4 bg-[#F7F5F0]/60 p-4 rounded-xl border border-[#E5E0D8]/40">
          <span className="font-bold text-[#3A4F3F] block border-b border-[#E5E0D8] pb-1.5 mb-1 text-[15px]">🩺 深度效能</span>
          {[
            { label: '🧠 心靈療效', val: item.oilDetails?.mindEffect },
            { label: '💪 身體療效', val: item.oilDetails?.bodyEffect },
            { label: '🧴 皮膚療效', val: item.oilDetails?.skinEffect }
          ].map((effect, i) => (
            <div key={i}>
              <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">{effect.label}</span>
              <div className="pl-2 border-l-2 border-[#A39284]">{renderFormattedText(effect.val)}</div>
            </div>
          ))}
        </div>

        {/* 調和與配方 */}
        <div className="space-y-3 bg-[#3A4F3F]/5 p-4 rounded-xl border border-[#3A4F3F]/10">
          {[
            { label: '🔗 適合與之調和的精油', val: item.oilDetails?.blendingOils },
            { label: '🧪 精油配方', val: item.oilDetails?.formulas },
            { label: '🧴 按摩基底油', val: item.oilDetails?.carrierOils }
          ].map((field, i) => (
            <div key={i}>
              <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">{field.label}</span>
              {renderFormattedText(field.val)}
            </div>
          ))}
          <div className="mt-2 border-t border-[#E5E0D8] pt-2">
            <span className="font-bold text-[#4E6654] block border-b border-[#E5E0D8] pb-1 mb-2 text-sm tracking-widest">🚀 使用方法</span>
            <div className="px-1">{renderFormattedText(item.oilDetails?.usage)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}