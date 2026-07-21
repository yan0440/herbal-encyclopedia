import React, { useState, useEffect } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import AddEntryPage from './AddEntryPage';
import EncyclopediaViewer from './EncyclopediaViewer';
import CardViewer from './CardViewer';

export default function AdminPage({ allData, onBack }) {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [viewState, setViewState] = useState('list');
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
  const [version, setVersion] = useState('v1.2.7');
  const [filterCategory, setFilterCategory] = useState('全部');

  useEffect(() => {
    fetch('/version.json')
      .then((res) => res.json())
      .then((data) => setVersion(data.version))
      .catch(() => setVersion('v1.2.7'));
    window.scrollTo(0, 0);
  }, [viewingItem, viewingCard, viewState]);

  const categories = ['全部', '書籍', '精油', '穴道', '中藥', '方劑'];
  const filteredEntries =
    filterCategory === '全部'
      ? allData
      : allData.filter((item) => item.category === filterCategory);

  if (!isAuth) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F7F5F0]">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#E5E0D8] w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-[#3A4F3F] mb-6 tracking-widest">開發者專區</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === '0423') setIsAuth(true);
              else alert('密碼錯誤');
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D8] outline-none"
              placeholder="輸入密碼"
            />
            <button type="submit" className="w-full bg-[#3A4F3F] text-white py-3 rounded-xl font-bold">
              進入專區
            </button>
          </form>
          <button onClick={onBack} className="mt-6 text-[#A39284] text-sm hover:underline">
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (viewState === 'add') {
    return (
      <AddEntryPage
        onClose={() => {
          setViewState('list');
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />
    );
  }

  return (
    <div className="w-screen h-dvh bg-[#F7F5F0] flex flex-col overflow-hidden">
      {viewingItem && (
        <EncyclopediaViewer
          item={viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}

      {viewingCard && (
        <CardViewer
          item={viewingCard}
          onClose={() => setViewingCard(null)}
        />
      )}

      <header className="shrink-0 bg-[#F7F5F0] px-6 md:px-10 py-6 border-b border-[#E5E0D8]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#3A4F3F]">開發者專區</h1>
            <p className="text-[#A39284] text-sm mt-1">目前版本：{version}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-[#3A4F3F] font-medium hover:bg-[#F0EDE6]"
            >
              返回首頁
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setViewState('add');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#6B9080] text-white font-medium hover:bg-[#5a7d6e]"
            >
              + 新增百科
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden px-6 md:px-10 py-6">
        <div className="h-full flex flex-col gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-[#3A4F3F] text-white'
                    : 'bg-white text-[#6B7A6E] border border-[#E5E0D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="grid gap-3">
              {filteredEntries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-[#E5E0D8]/60 flex justify-between items-center shadow-sm"
                >
                  <span className="font-semibold text-[#3A4F3F]">{item.name}</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => setViewingItem(item)}
                      className="px-4 py-2 text-sm text-[#3A4F3F] font-medium bg-[#F7F5F0] rounded-lg hover:bg-[#E5E0D8]"
                    >
                      檢視
                    </button>
                    <button
                      onClick={() => setViewingCard(item)}
                      className="px-4 py-2 text-sm text-[#3A4F3F] font-medium bg-[#F7F5F0] rounded-lg hover:bg-[#E5E0D8]"
                    >
                      圖卡
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setViewState('add');
                      }}
                      className="px-4 py-2 text-sm text-[#6B9080] font-medium bg-[#F7F5F0] rounded-lg hover:bg-[#E5E0D8]"
                    >
                      編輯
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('確定刪除？')) await deleteDoc(doc(db, 'entries', item.id));
                      }}
                      className="px-4 py-2 text-sm text-[#D4A373] font-medium bg-[#F7F5F0] rounded-lg hover:bg-[#E5E0D8]"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}