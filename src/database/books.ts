import { getDB } from './schema';

export interface Book {
  id: string;
  title: string;
  author: string | null;
  filePath: string;
  coverPath: string | null;
  totalPages: number;
  addedAt: string;
}

export async function insertBook(book: Book): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO Books (id, title, author, filePath, coverPath, totalPages, addedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [book.id, book.title, book.author ?? null, book.filePath,
     book.coverPath ?? null, book.totalPages, book.addedAt]
  );
}

export async function getAllBooks(): Promise<Book[]> {
  const db = await getDB();
  return await db.getAllAsync<Book>('SELECT * FROM Books ORDER BY addedAt DESC');
}

export async function deleteBookRecord(bookId: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM Books WHERE id = ?', [bookId]);
}

export async function updateBookCover(bookId: string, coverPath: string): Promise<void> {
  const db = await getDB();
  await db.runAsync('UPDATE Books SET coverPath = ? WHERE id = ?', [coverPath, bookId]);
}