import { create } from 'zustand';

interface PlayerState {
  currentBookId: string | null;
  currentPage: number;
  isPlaying: boolean;
  speed: number;
  sleepTimerMinutes: number | null;
  setCurrentBook: (bookId: string) => void;
  setCurrentPage: (page: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setSleepTimer: (minutes: number | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentBookId: null,
  currentPage: 1,
  isPlaying: false,
  speed: 1,
  sleepTimerMinutes: null,
  setCurrentBook: (bookId) => set({ currentBookId: bookId }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed }),
  setSleepTimer: (minutes) => set({ sleepTimerMinutes: minutes }),
}));