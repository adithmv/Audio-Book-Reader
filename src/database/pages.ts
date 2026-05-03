import { getDB } from './schema';

export interface Page {
  id: string;
  bookId: string;
  pageNumber: number;
  text: string;
  audioPath: string | null;
  thumbnailPath: string | null;
  audioDuration: number | null;
}

export async function insertPage(page: Page): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO Pages (id, bookId, pageNumber, text, audioPath, thumbnailPath, audioDuration)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [page.id, page.bookId, page.pageNumber, page.text,
     page.audioPath ?? null, page.thumbnailPath ?? null, page.audioDuration ?? null]
  );
}

export async function getPagesForBook(bookId: string): Promise<Page[]> {
  const db = await getDB();
  return await db.getAllAsync<Page>(
    'SELECT * FROM Pages WHERE bookId = ? ORDER BY pageNumber ASC',
    [bookId]
  );
}

export async function getPageAudioPaths(bookId: string): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ audioPath: string }>(
    'SELECT audioPath FROM Pages WHERE bookId = ? AND audioPath IS NOT NULL',
    [bookId]
  );
  return rows.map(r => r.audioPath);
}

export async function clearAudioForBook(bookId: string): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    'UPDATE Pages SET audioPath = NULL, audioDuration = NULL WHERE bookId = ?',
    [bookId]
  );
}

export async function deletePagesForBook(bookId: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM Pages WHERE bookId = ?', [bookId]);
}

export async function getBookProgress(bookId: string): Promise<{ currentPage: number; totalPages: number } | null> {
  const db = await getDB();
  const progress = await db.getFirstAsync<{ currentPage: number }>(
    'SELECT currentPage FROM Progress WHERE bookId = ?',
    [bookId]
  );
  const total = await db.getFirstAsync<{ totalPages: number }>(
    'SELECT totalPages FROM Books WHERE id = ?',
    [bookId]
  );
  if (!progress || !total) return null;
  return { currentPage: progress.currentPage, totalPages: total.totalPages };
}