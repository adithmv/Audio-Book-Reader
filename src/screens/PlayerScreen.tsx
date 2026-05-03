import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

interface PlayerScreenProps {
  navigation: any;
  route: any;
}

export function PlayerScreen({ navigation, route }: PlayerScreenProps) {
  const { bookId } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.placeholder}>Player Screen</Text>
        <Text style={styles.sub}>Book ID: {bookId}</Text>
        <Text style={styles.sub}>Full player coming in Phase 4</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  backBtn: { paddingTop: 52, paddingLeft: 16, paddingBottom: 12 },
  backText: { color: '#e94560', fontSize: 16, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { color: '#eaeaea', fontSize: 22, fontWeight: '700' },
  sub: { color: '#8a8a9a', fontSize: 13, marginTop: 8 },
});