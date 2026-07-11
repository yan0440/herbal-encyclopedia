import React, { useState } from 'react';

export default function BookModal({ item, onClose }) {
  // 記錄當前使用者點選了哪一個子篇章的內容
  const [selectedContent, setSelectedContent] = useState(null);

  if (!item) return null;

  // 取得書籍細節與目錄架構
  const { author, chapters } = item.bookDetails || { author: '經典文獻', chapters: [] };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#FCFBFA] rounded-3xl w-full max-w-5xl h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col border border-[#E5E0D8]/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 頂部導覽列 */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-[#E5E0D8]/50 bg-white">
          <div>
            <span className="text-[11px] font-bold text-[#6B9080] uppercase tracking-widest block mb-0.5">
              {item.category} 百科
            </span>
            <h2 className="text-2xl font-bold text-[#3A4F3F] flex items-center gap-3">
              {item.name}
              {author && <span className="text-xs font-normal text-[#A39284] bg-[#F7F5F0] px-2.5 py-1 rounded-full">{author}</span>}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#A39284] hover:text-red-500 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            ✕
          </button>
        </div>

        {/* 雙欄式閱讀器主體 */}
        <div className="flex flex-1 overflow-hidden bg-[#FBF9F6]">
          
          {/* 左側欄：動態目錄樹 */}
          <div className="w-80 border-r border-[#E5E0D8]/60 bg-white overflow-y-auto p-4 space-y-4">
            <h4 className="text-xs font-bold text-[#A39284] tracking-widest uppercase px-2 mb-2">書籍章節目錄</h4>
            
            {(!chapters || chapters.length === 0) && (
              <p className="text-sm text-[#A39284] italic p-2">此書籍尚未建立目錄架構。</p>
            )}

            {chapters?.map((ch) => (
              <div key={ch.id} className="space-y-1.5">
                {/* 大目錄標題（如：素問、靈樞） */}
                <div className="text-sm font-bold text-[#3A4F3F] bg-[#F7F5F0] px-3 py-2 rounded-xl flex items-center gap-2">
                  📁 {ch.title || '未命名目錄'}
                </div>

                {/* 子篇章節點 */}
                <div className="pl-4 space-y-1 border-l border-[#6B9080]/20 ml-2">
                  {ch.children?.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        if (child.type === 'content') {
                          setSelectedContent(child);
                        }
                      }}
                      className={`w-full text-left text-xs p-2.5 rounded-lg transition-all flex items-start gap-2 ${
                        child.type === 'folder' 
                          ? 'text-[#A39284] font-medium cursor-default' 
                          : selectedContent?.id === child.id
                            ? 'bg-[#3A4F3F] text-white font-bold shadow-sm'
                            : 'text-[#6B7A6E] hover:bg-[#F7F5F0] hover:text-[#3A4F3F]'
                      }`}
                    >
                      <span>{child.type === 'folder' ? '📂' : '📄'}</span>
                      <span className="truncate">{child.title || '未命名篇章'}</span>
                    </button>
                  ))}
                  {(!ch.children || ch.children.length === 0) && (
                    <span className="text-[11px] text-[#A39284] italic pl-2 block">無子篇章</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 右側欄：經文內文顯示區 */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-[#FCFBFA]">
            {selectedContent ? (
              <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
                {/* 當前閱讀篇章標題 */}
                <div className="border-b border-[#E5E0D8]/60 pb-4">
                  <span className="text-xs font-bold text-[#6B9080] tracking-wider block mb-1">CURRENT READING</span>
                  <h3 className="text-3xl font-bold text-[#3A4F3F]">{selectedContent.title}</h3>
                </div>
                
                {/* 經文主體內容 */}
                <div className="text-base text-[#3A4F3F] leading-loose font-serif whitespace-pre-line tracking-wide bg-[#FBF9F6] p-6 md:p-8 rounded-2xl border border-[#E5E0D8]/40 shadow-inner">
                  {selectedContent.text || <span className="text-[#A39284] italic">此章節尚無內文。</span>}
                </div>
              </div>
            ) : (
              /* 🟢 這裡修改為：佔滿深色區域、文字靠左齊、更具書卷感的UI */
              <div className="h-full max-w-3xl mx-auto flex flex-col justify-start pt-4 space-y-6 animate-in fade-in duration-300">
                {/* 頂部貼心提示與小圖標 */}
                <div className="flex items-center gap-3 border-b border-[#E5E0D8]/60 pb-4">
                  <span className="text-xl">📖</span>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#3A4F3F]">歡迎閱讀經典導覽</h4>
                    <p className="text-xs text-[#A39284]">請從左側目錄點選想要深入閱讀的細節篇章</p>
                  </div>
                </div>

                {/* 書籍簡介區塊：佔滿寬度、文字靠左對齊、支援 \n 換行 */}
                {item.description && (
                  <div className="w-full text-left bg-[#FBF9F6] p-6 md:p-8 rounded-2xl border border-[#E5E0D8]/50 shadow-inner space-y-3">
                    <strong className="text-base text-[#3A4F3F] flex items-center gap-2 border-b border-[#E5E0D8]/40 pb-2">
                      ✨ 書籍概要簡介
                    </strong>
                    <p className="text-sm text-[#6B7A6E] leading-relaxed font-sans whitespace-pre-line tracking-wide">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}