import * as FileSystem from 'expo-file-system';

export const BOOKS_DIR = FileSystem.documentDirectory + 'books/';
export const MODEL_DIR = FileSystem.documentDirectory + 'kokoro_model/';

export async function ensureBookDir(bookId: string): Promise<string> {
  const dir = BOOKS_DIR + bookId + '/';
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function getBookDirSize(bookId: string): Promise<number> {
  const dir = BOOKS_DIR + bookId + '/';
  const info = await FileSystem.getInfoAsync(dir, { size: true });
  if (!info.exists) return 0;
  return (info as any).size ?? 0;
}

export async function getAudioFilesSize(audioPaths: string[]): Promise<number> {
  let total = 0;
  for (const path of audioPaths) {
    const info = await FileSystem.getInfoAsync(path, { size: true });
    if (info.exists) total += (info as any).size ?? 0;
  }
  return total;
}

export async function getPDFSize(filePath: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(filePath, { size: true });
  if (!info.exists) return 0;
  return (info as any).size ?? 0;
}

export async function deleteFile(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
}

export async function deleteDirectory(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
}

export async function copyPDFToAppStorage(uri: string, bookId: string): Promise<string> {
  const dir = await ensureBookDir(bookId);
  const dest = dir + 'book.pdf';
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}