import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('audiobookreader.db');
  }
  return db;
}

export async function initDB(): Promise<void> {
  const database = await getDB();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS Books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      filePath TEXT NOT NULL,
      coverPath TEXT,
      totalPages INTEGER NOT NULL,
      addedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Pages (
      id TEXT PRIMARY KEY,
      bookId TEXT NOT NULL,
      pageNumber INTEGER NOT NULL,
      text TEXT NOT NULL,
      audioPath TEXT,
      thumbnailPath TEXT,
      audioDuration REAL,
      FOREIGN KEY (bookId) REFERENCES Books(id)
    );

    CREATE TABLE IF NOT EXISTS Bookmarks (
      id TEXT PRIMARY KEY,
      bookId TEXT NOT NULL,
      pageNumber INTEGER NOT NULL,
      audioPosition REAL NOT NULL,
      label TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (bookId) REFERENCES Books(id)
    );

    CREATE TABLE IF NOT EXISTS Progress (
      bookId TEXT PRIMARY KEY,
      currentPage INTEGER NOT NULL,
      audioPosition REAL NOT NULL,
      lastReadAt TEXT NOT NULL,
      FOREIGN KEY (bookId) REFERENCES Books(id)
    );
  `);
}