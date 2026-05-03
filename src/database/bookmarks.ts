import { getDB } from './schema';

export async function deleteBookmarksForBook(bookId: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM Bookmarks WHERE bookId = ?', [bookId]);
}

export async function deleteProgressForBook(bookId: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM Progress WHERE bookId = ?', [bookId]);
}