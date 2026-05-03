import React from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, Dimensions
} from 'react-native';
import { Book } from '../database/books';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

interface BookCardProps {
  book: Book;
  progress: number; // 0 to 1
  onPress: () => void;
  onLongPress: () => void;
}

export function BookCard({ book, progress, onPress, onLongPress }: BookCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.85}
    >
      <View style={styles.thumbnail}>
        {book.coverPath ? (
          <Image source={{ uri: book.coverPath }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>📖</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        {book.author && (
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        )}
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#16213e',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0f3460',
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    backgroundColor: '#0f3460',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3460',
  },
  placeholderText: {
    fontSize: 48,
  },
  info: {
    padding: 10,
    minHeight: 56,
  },
  title: {
    color: '#eaeaea',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  author: {
    color: '#8a8a9a',
    fontSize: 11,
    marginTop: 2,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: '#0f3460',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#e94560',
  },
});