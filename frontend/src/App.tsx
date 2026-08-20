import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemes } from './hooks/useThemes';
import { useRadio } from './hooks/useRadio';
import { usePlayerStore } from './store/player.store';
import { ThemeSelector } from './components/ThemeSelector';
import { MusicPlayer } from './components/MusicPlayer';
import { ThemeBackground } from './components/ThemeBackground';
import { getThemeVisual } from './config/themeVisuals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RadioApp() {
  const [activeThemeSlug, setActiveThemeSlug] = useState<string | null>(null);
  const { data: themes = [], isLoading: themesLoading } = useThemes();

  const effectiveThemeSlug = activeThemeSlug || (themes.length > 0 ? themes[0].slug : null);
  const visual = getThemeVisual(effectiveThemeSlug);

  const { data: radioData, isLoading: radioLoading } = useRadio(effectiveThemeSlug || undefined);
  const { setPlaylist, resetPlayer, currentSong, isPlaying } = usePlayerStore();
  const prevSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!radioData) return;
    if (prevSlugRef.current !== effectiveThemeSlug) {
      prevSlugRef.current = effectiveThemeSlug;
      if (radioData.songs.length > 0) {
        setPlaylist(radioData.songs);
      } else {
        resetPlayer();
      }
    }
  }, [radioData, effectiveThemeSlug, setPlaylist, resetPlayer]);

  const handleThemeSelect = (slug: string) => {
    if (slug === activeThemeSlug) return;
    prevSlugRef.current = null;
    setActiveThemeSlug(slug);
    resetPlayer();
  };

  const activeThemeData = themes.find((t) => t.slug === effectiveThemeSlug);
  const currentQuote = activeThemeData?.quotes?.[0] || visual.quote;

  return (
    <div
      data-testid="radio-app"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ThemeBackground themeSlug={effectiveThemeSlug} isPlaying={isPlaying} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Center Top: Theme Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(12px, 3vw, 24px) 16px 8px 16px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}>
          {themesLoading ? (
            <div style={{ color: visual.accentColor, fontFamily: 'var(--mono)', fontSize: '13px' }}>Loading themes...</div>
          ) : (
            <ThemeSelector themes={themes} activeThemeSlug={activeThemeSlug} onThemeSelect={handleThemeSelect} />
          )}
        </div>

        {/* Body */}
        <div className="app-body" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* Main Area: Now Playing + Visual */}
          <div className="main-content" style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 'clamp(16px, 5vw, 40px) clamp(12px, 4vw, 32px)', position: 'relative', minWidth: 0,
            overflow: 'hidden', minHeight: 0,
          }}>
            <div className="ambient-emoji" style={{
              fontSize: 'clamp(48px, 13vw, 120px)', marginBottom: '24px',
              filter: 'drop-shadow(0 0 60px ' + visual.accentColor + '66)',
              animation: isPlaying ? 'pulse 2s ease-in-out infinite' : 'none', userSelect: 'none',
            }}>
            </div>

            <h1 className="now-playing-title" style={{
              fontFamily: "'Rock Salt', 'Kalam', cursive", fontSize: 'clamp(20px, 4.5vw, 44px)',
              color: '#fff', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: 'normal',
              textShadow: `0 0 40px ${visual.accentColor}88`,
            }}>
              {activeThemeData?.name || 'Retro Radio India'}
            </h1>

            <p style={{
              fontFamily: "'Rock Salt', 'Kalam', cursive", fontSize: 'clamp(13px, 3.5vw, 20px)', color: visual.accentColor,
              textAlign: 'center', margin: '0 0 24px 0', fontStyle: 'italic',
            }}>
              "{currentQuote}"
            </p>

            {currentSong ? (
              <div style={{
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
                border: `1px solid ${visual.accentColor}44`, borderRadius: '16px',
                padding: 'clamp(14px, 4vw, 20px) clamp(16px, 5vw, 28px)', textAlign: 'center', maxWidth: '400px', width: '100%',
                boxShadow: `0 0 40px ${visual.accentColor}22`,
              }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: visual.accentColor, letterSpacing: '2px', marginBottom: '8px' }}>
                  NOW PLAYING
                </div>
                <div data-testid="song-title" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, color: '#fff', fontFamily: 'var(--sans)', marginBottom: '6px' }}>
                  {currentSong.title}
                </div>
                <div data-testid="song-artist" style={{ fontSize: '14px', color: visual.accentColor, fontFamily: 'var(--mono)' }}>
                  {currentSong.artist}
                  {currentSong.movie && ` • ${currentSong.movie}`}
                </div>
                {currentSong.year && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', fontFamily: 'var(--mono)' }}>{currentSong.year}</div>
                )}
                {isPlaying && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 1s ease-in-out infinite' }} />
                    <span style={{ fontSize: '11px', color: '#22c55e', fontFamily: 'var(--mono)', letterSpacing: '1px' }}>LIVE</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px',
                padding: '24px 32px', textAlign: 'center', maxWidth: '360px',
              }}>
                {radioLoading ? (
                  <div style={{ color: visual.accentColor, fontFamily: 'var(--mono)', fontSize: '14px' }}>📻 Loading playlist...</div>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📡</div>
                    <div style={{ color: '#6b7280', fontFamily: 'var(--mono)', fontSize: '13px' }}>
                      {activeThemeSlug ? 'No songs for this theme yet' : 'Select a theme to start'}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <MusicPlayer />
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .main-content { padding: 12px !important; }
          .ambient-emoji { margin-bottom: 12px !important; }
          .now-playing-title { margin-bottom: 8px !important; }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RadioApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
