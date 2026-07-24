export function handlePrintItem(item) {
  const clean = (v) => (v == null || v === '' ? '' : String(v));

  const escapeHtml = (str) =>
    clean(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const renderText = (v) => escapeHtml(v).replace(/\n/g, '<br>');

  const getValue = (path) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), item);
  };

  const renderChapters = (chapters, level = 0) => {
    if (!Array.isArray(chapters)) return '';
    return chapters
      .map((node, index) => {
        const indent = level * 18;
        const title = node.title || `章節 ${index + 1}`;
        const text = node.text ? `<div class="chapter-text">${renderText(node.text)}</div>` : '';
        const children = node.children ? renderChapters(node.children, level + 1) : '';
        const typeLabel = node.type ? `<span class="chapter-type">(${escapeHtml(node.type)})</span>` : '';
        return `
          <div class="chapter-item" style="margin-left:${indent}px">
            <div class="chapter-title">${escapeHtml(title)} ${typeLabel}</div>
            ${text}
            ${children}
          </div>
        `;
      })
      .join('');
  };

  const fieldsByCategory = {
    書籍: [
      ['作者 / 編著', 'bookDetails.author'],
      ['描述', 'description'],
    ],
    精油: [
      ['核心標籤', 'tag'],
      ['簡介描述', 'description'],
      ['外文名', 'englishName'],
      ['適用體質與化學屬性標籤', 'constitutionTag'],
      ['化學屬性標籤', 'chemicalTag'],
      ['別名', 'alias'],
      ['植物種類／萃取部位', 'typePart'],
      ['萃取方法', 'method'],
      ['拉丁學名', 'latin'],
      ['科名', 'family'],
      ['性味', 'nature'],
      ['五行／陰陽屬性', 'property'],
      ['歸經', 'meridian'],
      ['主治', 'indications'],
      ['類比音符', 'noteAnalogy'],
      ['主宰星球', 'planet'],
      ['重要產地', 'origin'],
      ['氣味', 'oilDetails.scent'],
      ['外觀描述', 'oilDetails.appearance'],
      ['應用歷史與相關神話', 'oilDetails.historyMyth'],
      ['化學結構', 'oilDetails.chemistry'],
      ['屬性', 'oilDetails.attribute'],
      ['注意事項', 'oilDetails.caution'],
      ['心靈療效', 'oilDetails.mindEffect'],
      ['身體療效', 'oilDetails.bodyEffect'],
      ['皮膚療效', 'oilDetails.skinEffect'],
      ['適合與之調和的精油', 'oilDetails.blendingOils'],
      ['精油配方', 'oilDetails.formulas'],
      ['按摩基底油', 'oilDetails.carrierOil'],
      ['使用方法', 'oilDetails.usage'],
    ],
    穴道: [
      ['名稱', 'name'],
      ['簡介描述', 'description'],
      ['國際代碼', 'acuTable.code'],
      ['穴道經絡', 'acuTable.meridian'],
      ['別名', 'acuTable.alias'],
      ['主治', 'acuDetails.indications'],
      ['類別', 'acuDetails.type'],
      ['釋名', 'acuDetails.nameExpl'],
      ['位置', 'acuDetails.location'],
      ['解剖', 'acuDetails.anatomy'],
      ['操作', 'acuDetails.operation'],
      ['古代功效', 'acuDetails.effectAncient'],
      ['現代功效', 'acuDetails.effectModern'],
      ['配穴建議', 'acuDetails.matchingPoints'],
    ],
    中藥: [
      ['名稱', 'name'],
      ['簡介描述', 'description'],
      ['核心標籤', 'tag'],
      ['別名', 'alias'],
      ['科屬', 'family'],
      ['性味', 'nature'],
      ['歸經', 'meridian'],
      ['品種來源', 'source'],
      ['性狀', 'traits'],
      ['功效', 'effect'],
      ['主治', 'indications'],
      ['用法用量', 'dosage'],
      ['現代藥理', 'pharmacology'],
      ['現代應用', 'contemporary'],
      ['選方', 'medicine'],
      ['文獻別錄', 'literature'],
      ['注意禁忌', 'contraindication'],
      ['炮製儲藏', 'preparation'],
      ['附藥說明', 'directions'],
      ['註', 'note'],
    ],
    方劑: [
      ['名稱', 'name'],
      ['簡介描述', 'description'],
      ['別名', 'alias'],
      ['來源', 'source'],
      ['功效', 'effect'],
      ['製法用量', 'preparation'],
      ['主治', 'indications'],
      ['文獻別錄', 'literature'],
      ['方義', 'analysis'],
      ['方論', 'discussion'],
      ['辨證要點', 'syndrome'],
      ['加減', 'modifications'],
      ['注意禁忌', 'contraindication'],
      ['現代應用', 'modernApp'],
      ['現代藥理', 'modernPharmacology'],
      ['附方', 'prescription'],
    ],
    書籍章節: [
      ['章節內容', 'bookDetails.chapters'],
    ],
  };

  const category = item.category || '';
  const fields = fieldsByCategory[category] || [];

  const rows = fields
    .map(([label, path]) => {
      const value = getValue(path);
      if (path === 'bookDetails.chapters') return '';
      if (value == null || value === '') return '';
      return `
        <tr>
          <td class="label">${escapeHtml(label)}</td>
          <td class="value">${renderText(value)}</td>
        </tr>
      `;
    })
    .join('');

  const bookChaptersHtml =
    category === '書籍' && item.bookDetails?.chapters
      ? `
        <tr>
          <td class="label">章節內容</td>
          <td class="value">
            <div class="chapters">
              ${renderChapters(item.bookDetails.chapters)}
            </div>
          </td>
        </tr>
      `
      : '';

  const title = escapeHtml(item.name || '百科資料');
  const subtitle = category ? `<div class="subtitle">${escapeHtml(category)}</div>` : '';

  const content = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: "Microsoft JhengHei", "PingFang TC", "Heiti TC", sans-serif;
            color: #222;
            font-size: 12pt;
            line-height: 1.65;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          h1 {
            font-size: 18pt;
            margin: 0 0 3mm 0;
            text-align: center;
            letter-spacing: 1px;
          }
          .subtitle {
            text-align: center;
            color: #555;
            font-size: 10pt;
            margin-bottom: 5mm;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          td {
            padding: 2.5mm 2mm;
            vertical-align: top;
            border: 1px solid #999;
            word-break: break-word;
          }
          td.label {
            width: 34mm;
            background: #f3f3f3;
            font-weight: bold;
            color: #333;
          }
          td.value {
            white-space: pre-wrap;
          }
          .chapters {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .chapter-item {
            padding: 6px 0;
          }
          .chapter-title {
            font-weight: bold;
            color: #3A4F3F;
            margin-bottom: 4px;
          }
          .chapter-type {
            font-weight: normal;
            color: #666;
            font-size: 10pt;
          }
          .chapter-text {
            white-space: pre-wrap;
            margin-bottom: 4px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${subtitle}
        <table>
          ${rows}
          ${bookChaptersHtml}
        </table>
        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(content);
  win.document.close();
  win.focus();
}