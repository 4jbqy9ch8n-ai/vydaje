// Výdaje za děti – synchronizace do Google tabulky
// Nastav TOKEN na vlastní tajný řetězec a stejný zadej v aplikaci.
const TOKEN = 'ZMEN-MNE-na-dlouhy-tajny-klic';
const SHEET = 'Výdaje';
const COLS = ['id', 'typ', 'castka', 'za_co', 'zaplatil', 'datum', 'smazano', 'upraveno', 'ts'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const req = JSON.parse(e.postData.contents || '{}');
    if (req.token !== TOKEN) return out({ ok: false, error: 'špatný klíč' });

    const sh = sheet_();
    const props = PropertiesService.getScriptProperties();
    const values = sh.getDataRange().getValues();
    const rows = values.slice(1);
    const index = new Map();
    rows.forEach((r, i) => index.set(String(r[0]), i));

    (req.entries || []).forEach(x => {
      if (!x || !x.id) return;
      const row = [
        String(x.id),
        x.type === 'settle' ? 'vyrovnání' : 'výdaj',
        Number(x.amount) || 0,
        String(x.note || ''),
        x.payer === 'ex' ? 'ex' : 'já',
        new Date(Number(x.ts) || Date.now()),
        x.deleted === true,
        Number(x.updated) || 0,
        Number(x.ts) || Date.now()
      ];
      const i = index.get(row[0]);
      if (i === undefined) { rows.push(row); index.set(row[0], rows.length - 1); }
      else if (row[7] > Number(rows[i][7] || 0)) rows[i] = row;
    });

    if (rows.length) {
      sh.getRange(2, 1, rows.length, COLS.length).setValues(rows);
      sh.getRange(2, 6, rows.length, 1).setNumberFormat('d.m.yyyy');
    }

    if (req.names && (req.names.me || req.names.ex)) props.setProperty('names', JSON.stringify(req.names));
    const names = JSON.parse(props.getProperty('names') || '{}');

    const entries = rows.map(r => ({
      id: String(r[0]),
      type: r[1] === 'vyrovnání' ? 'settle' : 'expense',
      amount: Number(r[2]) || 0,
      note: String(r[3] || ''),
      payer: r[4] === 'ex' ? 'ex' : 'me',
      ts: Number(r[8]) || (r[5] instanceof Date ? r[5].getTime() : Date.now()),
      deleted: r[6] === true || r[6] === 'TRUE',
      updated: Number(r[7]) || 0
    }));
    return out({ ok: true, entries, names });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, info: 'Výdaje za děti – sync běží' }); }

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
