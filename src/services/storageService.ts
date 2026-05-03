import * as FileSystem from 'expo-file-system';

const docDir = FileSystem.documentDirectory ?? '';

export const BOOKS_DIR = docDir + 'books/';
export const MODEL_DIR = docDir + 'kokoro_model/';

export async function ensureBookDir(bookId: string): Promise<string> {
  const dir = BOOKS_DIR + bookId + '/';
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function getBookDirSize(_bookId: string): Promise<number> {
  return 0;
}

export async function getAudioFilesSize(audioPaths: string[]): Promise<number> {
  let total = 0;
  for (const path of audioPaths) {
    try {
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists) total += 0;
    } catch {
      // skip
    }
  }
  return total;
}

export async function getPDFSize(_filePath: string): Promise<number> {
  return 0;
}

export async function deleteFile(path: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {
    // ignore
  }
}

export async function deleteDirectory(path: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {
    // ignore
  }
}

export async function copyPDFToAppStorage(uri: string, bookId: string): Promise<string> {
  const dir = await ensureBookDir(bookId);
  const dest = dir + 'book.pdf';

  try {
    await FileSystem.copyAsync({ from: uri, to: dest });
  } catch {
    const result = await FileSystem.downloadAsync(uri, dest);
    if (result.status !== 200) throw new Error('Download failed');
  }

  const verify = await FileSystem.getInfoAsync(dest);
  if (!verify.exists) throw new Error('File not found after copy');

  return dest;
}