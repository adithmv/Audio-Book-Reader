import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Modal, Alert, ToastAndroid,
  ActivityIndicator, StatusBar
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

import { Book, getAllBooks, insertBook, deleteBookRecord } from '../database/books';
import {
  getPageAudioPaths, clearAudioForBook, deletePagesForBook
} from '../database/pages';
import { deleteBookmarksForBook, deleteProgressForBook } from '../database/bookmarks';
import {
  copyPDFToAppStorage, deleteDirectory, deleteFile,
  getAudioFilesSize, getPDFSize, BOOKS_DIR
} from '../services/storageService';
import { bytesToMB } from '../utils/fileSize';
import { BookCard } from '../components/BookCard';
import { DeleteModal } from '../components/DeleteModal';

interface ShelfScreenProps {
  navigation: any;
}

export function ShelfScreen({ navigation }: ShelfScreenProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [importing, setImporting] = useState(false);
  const [actionModalBook, setActionModalBook] = useState<Book | null>(null);
  const [deleteModalBook, setDeleteModalBook] = useState<Book | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSizes, setDeleteSizes] = useState({
    audio: '0 MB', thumbnails: '0 MB', pdf: '0 MB', total: '0 MB'
  });

  const loadBooks = useCallback(async () => {
    const all = await getAllBooks();
    setBooks(all);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleImport = async () => {
    try {
      setImporting(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const bookId = uuidv4();
      const savedPath = await copyPDFToAppStorage(asset.uri, bookId);

      const title = asset.name.replace('.pdf', '') || 'Untitled Book';

      const book: Book = {
        id: bookId,
        title,
        author: null,
        filePath: savedPath,
        coverPath: null,
        totalPages: 0,
        addedAt: new Date().toISOString(),
      };

      await insertBook(book);
      await loadBooks();
      ToastAndroid.show('Book imported!', ToastAndroid.SHORT);
    } catch (e) {
      Alert.alert('Import Failed', 'Could not import the PDF file.');
    } finally {
      setImporting(false);
    }
  };

  const handleLongPress = (book: Book) => {
    setActionModalBook(book);
  };

  const handleOpenDeleteModal = async (book: Book) => {
    setActionModalBook(null);
    const audioPaths = await getPageAudioPaths(book.id);
    const audioSize = await getAudioFilesSize(audioPaths);
    const pdfSize = await getPDFSize(book.filePath);
    const bookDirSize = await FileSystem.getInfoAsync(
      BOOKS_DIR + book.id + '/', { size: true }
    );
    const thumbSize = Math.max(0, ((bookDirSize as any).size ?? 0) - audioSize - pdfSize);
    const total = audioSize + thumbSize + pdfSize;

    setDeleteSizes({
      audio: bytesToMB(audioSize),
      thumbnails: bytesToMB(thumbSize),
      pdf: bytesToMB(pdfSize),
      total: bytesToMB(total),
    });
    setDeleteModalBook(book);
  };

  const handleDeleteAudioOnly = async () => {
    if (!deleteModalBook) return;
    setDeleteLoading(true);
    try {
      const audioPaths = await getPageAudioPaths(deleteModalBook.id);
      for (const p of audioPaths) await deleteFile(p);
      await clearAudioForBook(deleteModalBook.id);
      ToastAndroid.show(`Audio cleared — ${deleteSizes.audio} freed`, ToastAndroid.SHORT);
    } finally {
      setDeleteLoading(false);
      setDeleteModalBook(null);
    }
  };

  const handleDeleteEverything = async () => {
    if (!deleteModalBook) return;
    setDeleteLoading(true);
    try {
      const audioPaths = await getPageAudioPaths(deleteModalBook.id);
      for (const p of audioPaths) await deleteFile(p);
      await clearAudioForBook(deleteModalBook.id);
      await deleteDirectory(BOOKS_DIR + deleteModalBook.id + '/');
      await deleteFile(deleteModalBook.filePath);
      await deleteBookmarksForBook(deleteModalBook.id);
      await deleteProgressForBook(deleteModalBook.id);
      await deletePagesForBook(deleteModalBook.id);
      await deleteBookRecord(deleteModalBook.id);
      setBooks(prev => prev.filter(b => b.id !== deleteModalBook.id));
      ToastAndroid.show(`Book deleted — ${deleteSizes.total} freed`, ToastAndroid.SHORT);
    } finally {
      setDeleteLoading(false);
      setDeleteModalBook(null);
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      progress={0}
      onPress={() => navigation.navigate('Player', { bookId: item.id })}
      onLongPress={() => handleLongPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleImport} disabled={importing}>
          {importing
            ? <ActivityIndicator color="#e94560" size="small" />
            : <Text style={styles.addBtnText}>＋</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Book Grid */}
      {books.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No books yet</Text>
          <Text style={styles.emptySubtitle}>Import a PDF to get started</Text>
          <TouchableOpacity style={styles.importBtn} onPress={handleImport}>
            <Text style={styles.importBtnText}>Import your first book</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Action Bottom Sheet */}
      <Modal
        visible={!!actionModalBook}
        transparent
        animationType="slide"
        onRequestClose={() => setActionModalBook(null)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setActionModalBook(null)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {actionModalBook?.title}
            </Text>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => {
                setActionModalBook(null);
                navigation.navigate('Player', { bookId: actionModalBook?.id });
              }}
            >
              <Text style={styles.sheetOptionText}>📖  Open Book</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetOption}
              onPress={() => actionModalBook && handleOpenDeleteModal(actionModalBook)}
            >
              <Text style={[styles.sheetOptionText, { color: '#e94560' }]}>🗑  Delete Book</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sheetOption, styles.sheetCancel]}
              onPress={() => setActionModalBook(null)}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Modal */}
      {deleteModalBook && (
        <DeleteModal
          visible={!!deleteModalBook}
          bookTitle={deleteModalBook.title}
          audioSizeMB={deleteSizes.audio}
          thumbnailSizeMB={deleteSizes.thumbnails}
          pdfSizeMB={deleteSizes.pdf}
          totalSizeMB={deleteSizes.total}
          onDeleteAudioOnly={handleDeleteAudioOnly}
          onDeleteEverything={handleDeleteEverything}
          onCancel={() => setDeleteModalBook(null)}
          loading={deleteLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16,
    paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#0f3460',
  },
  headerTitle: {
    color: '#eaeaea', fontSize: 24, fontWeight: '800', letterSpacing: 0.5,
  },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e94560', justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 26 },
  grid: { padding: 16 },
  row: { justifyContent: 'space-between' },
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#eaeaea', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#8a8a9a', fontSize: 15, marginBottom: 28 },
  importBtn: {
    backgroundColor: '#e94560', borderRadius: 12,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  importBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  sheetOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#16213e', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 24, paddingBottom: 40,
  },
  sheetTitle: {
    color: '#8a8a9a', fontSize: 13, marginBottom: 16,
    textAlign: 'center',
  },
  sheetOption: {
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#0f3460',
  },
  sheetOptionText: { color: '#eaeaea', fontSize: 16, fontWeight: '600' },
  sheetCancel: { borderBottomWidth: 0, marginTop: 4 },
  sheetCancelText: { color: '#8a8a9a', fontSize: 16, textAlign: 'center' },
});