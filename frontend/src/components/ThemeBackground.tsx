import { getThemeVisual } from '../config/themeVisuals';

interface ThemeBackgroundProps {
  themeSlug: string | null;
  isPlaying: boolean;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ themeSlug, isPlaying }) => {
  const visual = getThemeVisual(themeSlug);

  return (
    <>
      {/* Base gradient background */}
      <div
        data-testid="theme-background"
        style={{
          position: 'fixed',
          inset: 0,
          transition: 'background-color 1.5s ease',
          zIndex: 0,
        }}
      />

      {/* Background image layer — ready for theme-specific images */}
      {visual.backgroundImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage: `url(${visual.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5, // 50% opacity for better visibility
            transition: 'opacity 1.5s ease, background-image 1.5s ease',
            zIndex: 0,
          }}
        />
      )}

      {/* Radial glow pattern */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: visual.bgPattern,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 1.5s ease',
        }}
      />

      {/* Floating particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {isPlaying &&
          Array.from({ length: 20 }, (_, i) => i).map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i * 5.3) % 100}%`,
                bottom: '-10px',
                width: `${2 + (i % 4)}px`,
                height: `${2 + (i % 4)}px`,
                borderRadius: '50%',
                background: visual.textColor,
                opacity: 0.3 + (i % 5) * 0.1,
                animation: `floatUp ${4 + (i % 6)}s ${(i * 0.4) % 4}s linear infinite`,
              }}
            />
          ))}
      </div>

      {/* CRT scanlines overlay */}
      <div
        className="scanlines"
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </>
  );
};
