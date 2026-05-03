import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';

interface DeleteModalProps {
  visible: boolean;
  bookTitle: string;
  audioSizeMB: string;
  thumbnailSizeMB: string;
  pdfSizeMB: string;
  totalSizeMB: string;
  onDeleteAudioOnly: () => void;
  onDeleteEverything: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function DeleteModal({
  visible, bookTitle, audioSizeMB, thumbnailSizeMB,
  pdfSizeMB, totalSizeMB, onDeleteAudioOnly,
  onDeleteEverything, onCancel, loading
}: DeleteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Delete "{bookTitle}"</Text>

          <View style={styles.sizeRow}>
            <Text style={styles.sizeLabel}>Generated audio files:</Text>
            <Text style={styles.sizeValue}>{audioSizeMB}</Text>
          </View>
          <View style={styles.sizeRow}>
            <Text style={styles.sizeLabel}>Page thumbnails:</Text>
            <Text style={styles.sizeValue}>{thumbnailSizeMB}</Text>
          </View>
          <View style={styles.sizeRow}>
            <Text style={styles.sizeLabel}>Original PDF file:</Text>
            <Text style={styles.sizeValue}>{pdfSizeMB}</Text>
          </View>
          <View style={[styles.sizeRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total storage used:</Text>
            <Text style={styles.totalValue}>{totalSizeMB}</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#e94560" style={{ marginTop: 20 }} />
          ) : (
            <>
              <TouchableOpacity style={styles.btnAudio} onPress={onDeleteAudioOnly}>
                <Text style={styles.btnAudioText}>Delete Audio Only</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAll} onPress={onDeleteEverything}>
                <Text style={styles.btnAllText}>Delete Everything</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={onCancel}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#16213e', borderRadius: 16,
    padding: 24, width: '100%',
    borderWidth: 1, borderColor: '#0f3460',
  },
  title: {
    color: '#eaeaea', fontSize: 18, fontWeight: '700',
    marginBottom: 20, textAlign: 'center',
  },
  sizeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8,
  },
  sizeLabel: { color: '#8a8a9a', fontSize: 14 },
  sizeValue: { color: '#eaeaea', fontSize: 14, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1, borderTopColor: '#0f3460',
    marginTop: 8, paddingTop: 12,
  },
  totalLabel: { color: '#eaeaea', fontSize: 15, fontWeight: '700' },
  totalValue: { color: '#e94560', fontSize: 15, fontWeight: '700' },
  btnAudio: {
    backgroundColor: '#0f3460', borderRadius: 10,
    padding: 14, marginTop: 20, alignItems: 'center',
  },
  btnAudioText: { color: '#eaeaea', fontWeight: '700', fontSize: 15 },
  btnAll: {
    backgroundColor: '#e94560', borderRadius: 10,
    padding: 14, marginTop: 10, alignItems: 'center',
  },
  btnAllText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancel: {
    padding: 14, marginTop: 6, alignItems: 'center',
  },
  btnCancelText: { color: '#8a8a9a', fontSize: 15 },
});