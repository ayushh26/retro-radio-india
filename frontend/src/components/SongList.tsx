import { useState } from 'react';
import type { Song } from '../services/api';
import { usePlayerStore } from '../store/player.store';

interface SongListProps {
  songs: Song[];
  loading?: boolean;
  error?: string | null;
  themeAccentColor?: string;
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  loading,
  error,
  themeAccentColor = '#a855f7',
}) => {
  const { currentSong, isPlaying, setCurrentIndex, playlist } = usePlayerStore();
  const [search, setSearch] = useState('');

  const filtered = search
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase()) ||
          (s.movie || '').toLowerCase().includes(search.toLowerCase())
      )
    : songs;

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7c3aed', fontFamily: 'var(--mono)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 2s linear infinite' }}>📻</div>
        <div>Loading playlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', fontFamily: 'var(--mono)' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</div>
        <div>Could not load songs</div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{error}</div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#7c3aed', fontFamily: 'var(--mono)' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎶</div>
        <div>No songs in this theme yet</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <input
          data-testid="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search songs, artists, movies..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e9d5ff',
            fontFamily: 'var(--sans)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* Song list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '13px', fontFamily: 'var(--mono)' }}>
            No results for "{search}"
          </div>
        ) : (
          filtered.map((song) => {
            const isActive = currentSong?._id === song._id;
            const playlistIdx = playlist.findIndex((s) => s._id === song._id);
            return (
              <div
                key={song._id}
                onClick={() => {
                  if (playlistIdx !== -1) setCurrentIndex(playlistIdx);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(170,59,255,0.12)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.15s ease',
                  borderLeft: isActive ? `3px solid ${themeAccentColor}` : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Thumbnail / indicator */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    background: song.thumbnail
                      ? `url(${song.thumbnail}) center/cover`
                      : 'linear-gradient(135deg, #3b0764, #1e1b4b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '16px',
                    border: isActive ? `1px solid ${themeAccentColor}` : '1px solid rgba(255,255,255,0.05)',
                    overflow: 'hidden',
                  }}
                >
                  {isActive && isPlaying ? (
                    <span style={{ color: themeAccentColor, fontSize: '14px' }}>♪</span>
                  ) : (
                    !song.thumbnail && '🎵'
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13px',
                      color: isActive ? '#e9d5ff' : '#c4b5fd',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'var(--sans)',
                    }}
                  >
                    {song.title}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    {song.artist}
                    {song.movie && ` • ${song.movie}`}
                    {song.year && ` • ${song.year}`}
                  </div>
                </div>

                {/* Playing indicator */}
                {isActive && (
                  <div style={{ fontSize: '14px', color: themeAccentColor, flexShrink: 0 }}>
                    {isPlaying ? '🎵' : '⏸'}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
