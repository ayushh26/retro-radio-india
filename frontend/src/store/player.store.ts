import { create } from 'zustand';
import type { Song } from '../services/api';

export type RepeatMode = 'OFF' | 'SONG' | 'PLAYLIST';

interface PlayerState {
  playlist: Song[];
  playOrder: number[]; // Store the order of indices to play
  playOrderIndex: number; // Current index in the playOrder array
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  currentSong: Song | null;

  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setPlaylist: (songs: Song[], startSongId?: string) => void;
  setCurrentIndex: (index: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: RepeatMode) => void;
  resetPlayer: () => void;
}

// Fisher-Yates Shuffle
function shuffleArray(array: number[]): number[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  const generatePlayOrder = (length: number, shuffleActive: boolean, currentIdx: number): { playOrder: number[]; playOrderIndex: number } => {
    const indices = Array.from({ length }, (_, i) => i);
    if (!shuffleActive || length === 0) {
      return {
        playOrder: indices,
        playOrderIndex: Math.max(0, currentIdx),
      };
    }

    // Shuffled play order: place the current index first, then shuffle the rest
    const remaining = indices.filter((i) => i !== currentIdx);
    const shuffledRemaining = shuffleArray(remaining);
    const playOrder = [currentIdx, ...shuffledRemaining];

    return {
      playOrder,
      playOrderIndex: 0,
    };
  };

  return {
    playlist: [],
    playOrder: [],
    playOrderIndex: 0,
    isPlaying: false,
    volume: 50,
    isMuted: false,
    shuffle: false,
    repeat: 'PLAYLIST',
    currentSong: null,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    next: () => {
      const { playlist, playOrder, playOrderIndex, repeat, shuffle } = get();
      if (playlist.length === 0) return;

      if (repeat === 'SONG') {
        // Trigger a change to restart song, or let the player component restart it
        set({ isPlaying: true });
        return;
      }

      const nextOrderIndex = playOrderIndex + 1;

      if (nextOrderIndex < playOrder.length) {
        const nextSongIdx = playOrder[nextOrderIndex];
        set({
          playOrderIndex: nextOrderIndex,
          currentSong: playlist[nextSongIdx],
          isPlaying: true,
        });
      } else {
        // We reached the end of the playOrder
        if (repeat === 'PLAYLIST') {
          // Regenerate play order if shuffle is active so we get a new random order next loop
          const newOrder = generatePlayOrder(playlist.length, shuffle, playOrder[0]);
          const firstSongIdx = newOrder.playOrder[0];
          set({
            playOrder: newOrder.playOrder,
            playOrderIndex: 0,
            currentSong: playlist[firstSongIdx],
            isPlaying: true,
          });
        } else {
          // Repeat is OFF, stop playback
          set({ isPlaying: false });
        }
      }
    },

    previous: () => {
      const { playlist, playOrder, playOrderIndex, repeat } = get();
      if (playlist.length === 0) return;

      const prevOrderIndex = playOrderIndex - 1;

      if (prevOrderIndex >= 0) {
        const prevSongIdx = playOrder[prevOrderIndex];
        set({
          playOrderIndex: prevOrderIndex,
          currentSong: playlist[prevSongIdx],
          isPlaying: true,
        });
      } else {
        // We are at the beginning
        if (repeat === 'PLAYLIST') {
          const lastOrderIndex = playOrder.length - 1;
          const lastSongIdx = playOrder[lastOrderIndex];
          set({
            playOrderIndex: lastOrderIndex,
            currentSong: playlist[lastSongIdx],
            isPlaying: true,
          });
        } else {
          // Just replay the first song
          const firstSongIdx = playOrder[0];
          set({
            playOrderIndex: 0,
            currentSong: playlist[firstSongIdx],
            isPlaying: true,
          });
        }
      }
    },

    setPlaylist: (songs: Song[], startSongId?: string) => {
      if (songs.length === 0) {
        set({
          playlist: [],
          playOrder: [],
          playOrderIndex: 0,
          currentSong: null,
          isPlaying: false,
        });
        return;
      }

      let startIdx = 0;
      if (startSongId) {
        const idx = songs.findIndex((s) => s._id === startSongId);
        if (idx !== -1) startIdx = idx;
      }

      const { shuffle } = get();
      const { playOrder, playOrderIndex } = generatePlayOrder(songs.length, shuffle, startIdx);

      set({
        playlist: songs,
        playOrder,
        playOrderIndex,
        currentSong: songs[playOrder[playOrderIndex]],
        isPlaying: true,
      });
    },

    setCurrentIndex: (index: number) => {
      const { playlist, shuffle, playOrder } = get();
      if (index < 0 || index >= playlist.length) return;

      if (shuffle) {
        // Find where this index sits in our playOrder
        const orderIdx = playOrder.indexOf(index);
        if (orderIdx !== -1) {
          set({
            playOrderIndex: orderIdx,
            currentSong: playlist[index],
            isPlaying: true,
          });
        } else {
          // Fallback regenerates order
          const newOrder = generatePlayOrder(playlist.length, shuffle, index);
          set({
            playOrder: newOrder.playOrder,
            playOrderIndex: 0,
            currentSong: playlist[index],
            isPlaying: true,
          });
        }
      } else {
        set({
          playOrderIndex: index,
          currentSong: playlist[index],
          isPlaying: true,
        });
      }
    },

    setVolume: (volume: number) => {
      const bounded = Math.max(0, Math.min(100, volume));
      set({ volume: bounded, isMuted: bounded === 0 });
    },

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    toggleShuffle: () => {
      set((state) => {
        const nextShuffle = !state.shuffle;
        if (state.playlist.length === 0) {
          return { shuffle: nextShuffle };
        }

        // Get the index of the currently playing song in the original playlist
        const currentSongIndex = state.playlist.findIndex(
          (s) => s._id === state.currentSong?._id
        );
        const activeIndex = currentSongIndex !== -1 ? currentSongIndex : 0;

        const { playOrder, playOrderIndex } = generatePlayOrder(
          state.playlist.length,
          nextShuffle,
          activeIndex
        );

        return {
          shuffle: nextShuffle,
          playOrder,
          playOrderIndex,
        };
      });
    },

    setRepeat: (mode: RepeatMode) => set({ repeat: mode }),

    resetPlayer: () =>
      set({
        playlist: [],
        playOrder: [],
        playOrderIndex: 0,
        currentSong: null,
        isPlaying: false,
      }),
  };
});
