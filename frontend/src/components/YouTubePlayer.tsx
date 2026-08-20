import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../store/player.store';

interface YTPlayer {
  loadVideoById: (config: { videoId: string; startSeconds: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (vol: number) => void;
  mute: () => void;
  unMute: () => void;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerState {
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
  Player: new (id: string, config: Record<string, unknown>) => YTPlayer;
}

declare global {
  interface Window {
    YT: YTPlayerState;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface YouTubePlayerProps {
  onProgress?: (currentTime: number, duration: number) => void;
  seekTime?: number | null;
  onSeeked?: () => void;
}

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existingCallback) existingCallback();
      resolve();
    };

    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  });
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  onProgress,
  seekTime,
  onSeeked,
}) => {
  const { currentSong, isPlaying, volume, isMuted, next } = usePlayerStore();
  const playerRef = useRef<YTPlayer | null>(null);
  const containerId = 'youtube-iframe-player';
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [apiReady, setApiReady] = useState(() => !!(window.YT && window.YT.Player));
  const onProgressRef = useRef(onProgress);
  const onSeekedRef = useRef(onSeeked);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);
  useEffect(() => {
    onSeekedRef.current = onSeeked;
  }, [onSeeked]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (apiReady) return;
    loadYouTubeAPI().then(() => setApiReady(true));
  }, [apiReady]);

  // Initialize or Update Player
  useEffect(() => {
    if (!apiReady || !currentSong) return;

    if (playerRef.current) {
      try {
        playerRef.current.loadVideoById({
          videoId: currentSong.youtubeVideoId,
          startSeconds: 0,
        });
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch {
        // Error loading video
      }
      return;
    }

    try {
      playerRef.current = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: currentSong.youtubeVideoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: YTPlayerEvent) => {
            event.target.setVolume(isMuted ? 0 : volume);
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: YTPlayerEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              next();
            }
          },
          onError: (event: YTPlayerEvent) => {
            // YT error codes: 2=invalid videoId, 5=HTML5 error, 100=not found/private, 101/150=embedding not allowed
            console.warn(`YouTube player error (code ${event.data}) — skipping to next song`);
            setTimeout(() => next(), 2000);
          },
        },
      });
    } catch {
      setTimeout(() => next(), 1000);
    }
  }, [apiReady, currentSong?.youtubeVideoId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle External Play/Pause State changes
  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.getPlayerState !== 'function') return;
    try {
      const playerState = playerRef.current.getPlayerState();
      if (isPlaying && playerState !== window.YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (!isPlaying && playerState === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch {
      // Failed to sync playback state
    }
  }, [isPlaying]);

  // Handle Volume and Mute changes
  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.setVolume !== 'function') return;
    try {
      playerRef.current.setVolume(isMuted ? 0 : volume);
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch {
      // Failed to sync volume/mute state
    }
  }, [volume, isMuted]);

  // Handle Seek Requests
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seekTime, true);
      onSeekedRef.current?.();
    }
  }, [seekTime]);

  // Monitor Progress Timer
  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === 'function' &&
        typeof playerRef.current.getDuration === 'function'
      ) {
        try {
          const current = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (onProgressRef.current && dur > 0) {
            onProgressRef.current(current, dur);
          }
        } catch {
          // Silent catch
        }
      }
    }, 500);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // Component Cleanup
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {
          // Failed to clean up YouTube Player
        }
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="scanlines" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, opacity: 0.1 }}></div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.85) 100%)' }}></div>

      {currentSong ? (
        <div id={containerId} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}></div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', zIndex: 10, userSelect: 'none' }}>
          <div style={{ fontSize: '48px', animation: 'pulse 2s ease-in-out infinite', marginBottom: '8px' }}>📺</div>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', color: '#6b7280', fontFamily: 'var(--mono)' }}>No Signal - Select Theme</p>
        </div>
      )}
    </div>
  );
};
