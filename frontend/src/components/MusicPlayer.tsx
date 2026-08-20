import { useState, useCallback } from 'react';
import { usePlayerStore } from '../store/player.store';
import { YouTubePlayer } from './YouTubePlayer';
import { ErrorBoundary } from './ErrorBoundary';

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    shuffle,
    repeat,
    playlist,
    togglePlay,
    next,
    previous,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeat,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  const handleProgress = useCallback((ct: number, dur: number) => {
    setCurrentTime(ct);
    setDuration(dur);
  }, []);

  const handleSeeked = useCallback(() => {
    setSeekTime(null);
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setSeekTime(ratio * duration);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    if (repeat === 'OFF') setRepeat('PLAYLIST');
    else if (repeat === 'PLAYLIST') setRepeat('SONG');
    else setRepeat('OFF');
  };

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    background: active ? 'rgba(170, 59, 255, 0.2)' : 'transparent',
    border: active ? '1px solid rgba(170, 59, 255, 0.5)' : '1px solid rgba(255,255,255,0.08)',
    color: active ? '#d8b4fe' : '#7c3aed',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  });

  const playBtnStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    boxShadow: '0 0 24px rgba(168, 85, 247, 0.5)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  return (
    <div
      style={{
        background: 'rgba(10, 5, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(170, 59, 255, 0.2)',
        padding: '12px 20px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <style>{`
        .player-main-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .player-song-info {
          flex: 0 0 200px;
          min-width: 0;
          overflow: hidden;
        }
        .player-time {
          font-size: 11px;
          color: #6b21a8;
          font-family: var(--mono);
          flex-shrink: 0;
        }
        .player-controls {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .player-volume {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .player-count {
          font-size: 11px;
          color: #4b5563;
          font-family: var(--mono);
          flex-shrink: 0;
        }
        .player-progress {
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .player-volume .volume-slider {
          width: 80px;
        }
        @media (max-width: 640px) {
          .player-progress {
            height: 6px;
          }
          .player-main-row {
            flex-wrap: wrap;
            gap: 0;
            row-gap: 10px;
          }
          .player-song-info {
            flex: 1 1 0;
            min-width: 0;
          }
          .player-time {
            flex: 0 0 auto;
          }
          .player-controls {
            order: 3;
            width: 100%;
            gap: 6px;
          }
          .player-volume {
            order: 4;
            width: 100%;
            justify-content: center;
            gap: 10px;
          }
          .player-volume .volume-slider {
            width: auto;
            flex: 1;
            max-width: 140px;
          }
          .player-count {
            display: none;
          }
        }
      `}</style>

      {/* Hidden YouTube Player */}
      <div style={{ display: 'none' }}>
        <ErrorBoundary>
          <YouTubePlayer onProgress={handleProgress} seekTime={seekTime} onSeeked={handleSeeked} />
        </ErrorBoundary>
      </div>

      {/* Progress Bar */}
      <div className="player-progress" onClick={handleProgressClick}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            borderRadius: '4px',
            transition: 'width 0.5s linear',
          }}
        />
      </div>

      {/* Main Player Row */}
      <div className="player-main-row">
        {/* Song Info */}
        <div className="player-song-info">
          {currentSong ? (
            <div>
              <div
                data-testid="song-title"
                style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#e9d5ff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'var(--sans)',
                }}
              >
                {currentSong.title}
              </div>
              <div
                data-testid="song-artist"
                style={{
                  fontSize: '12px',
                  color: '#7c3aed',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'var(--mono)',
                }}
              >
                {currentSong.artist}
                {currentSong.movie && ` • ${currentSong.movie}`}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#4b5563', fontFamily: 'var(--mono)' }}>
              No song selected
            </div>
          )}
        </div>

        {/* Time */}
        <div className="player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button
            data-testid="shuffle-button"
            onClick={toggleShuffle}
            style={btnStyle(shuffle)}
            aria-label="Shuffle"
            title="Shuffle"
          >
            🔀
          </button>

          <button
            data-testid="previous-button"
            onClick={previous}
            disabled={playlist.length === 0}
            style={{ ...btnStyle(), opacity: playlist.length === 0 ? 0.3 : 1 }}
            aria-label="Previous"
            title="Previous"
          >
            ⏮
          </button>

          <button
            data-testid={isPlaying ? 'pause-button' : 'play-button'}
            onClick={togglePlay}
            disabled={!currentSong}
            style={{ ...playBtnStyle, opacity: !currentSong ? 0.4 : 1 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            data-testid="next-button"
            onClick={next}
            disabled={playlist.length === 0}
            style={{ ...btnStyle(), opacity: playlist.length === 0 ? 0.3 : 1 }}
            aria-label="Next"
            title="Next"
          >
            ⏭
          </button>

          <button
            data-testid="repeat-button"
            onClick={cycleRepeat}
            style={btnStyle(repeat !== 'OFF')}
            aria-label={`Repeat: ${repeat}`}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'SONG' ? '🔂' : '🔁'}
          </button>
        </div>

        {/* Volume */}
        <div className="player-volume">
          <button
            onClick={toggleMute}
            style={{ ...btnStyle(isMuted), width: '30px', height: '30px', fontSize: '12px' }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : volume < 30 ? '🔈' : volume < 70 ? '🔉' : '🔊'}
          </button>
          <input
            type="range"
            className="retro-slider volume-slider"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
          <span style={{ fontSize: '11px', color: '#6b21a8', fontFamily: 'var(--mono)', width: '28px' }}>
            {isMuted ? 0 : volume}%
          </span>
        </div>

        {/* Playlist count */}
        <div className="player-count">
          {playlist.length > 0 ? `${playlist.length} songs` : ''}
        </div>
      </div>
    </div>
  );
};
