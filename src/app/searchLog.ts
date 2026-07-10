// 検索キーワードを月ごとに localStorage に記録し、管理者ツールで集計表示するためのユーティリティ。

const STORAGE_KEY = 'searchLog';

// { "2026-07": { "醤油": 3, "ラー油": 1 }, ... }
type SearchLog = Record<string, Record<string, number>>;

function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function read(): SearchLog {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function logSearch(term: string): void {
  const t = term.trim();
  if (!t) return;
  const log = read();
  const mk = monthKey(new Date());
  if (!log[mk]) log[mk] = {};
  log[mk][t] = (log[mk][t] || 0) + 1;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    console.error('検索ログ保存失敗', e);
  }
}

export interface MonthlySearchStats {
  month: string; // "2026-07"
  terms: { term: string; count: number }[];
}

// 月ごとの検索ランキング（新しい月順、各月は多い順）
export function getMonthlySearchStats(): MonthlySearchStats[] {
  const log = read();
  return Object.keys(log)
    .sort((a, b) => b.localeCompare(a))
    .map(month => ({
      month,
      terms: Object.entries(log[month])
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count),
    }));
}
