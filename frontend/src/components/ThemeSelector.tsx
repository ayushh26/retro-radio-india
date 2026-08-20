import { useState, useRef, useCallback, useEffect } from 'react';
import type { Theme } from '../services/api';

interface ThemeSelectorProps {
  themes: Theme[];
  activeThemeSlug: string | null;
  onThemeSelect: (slug: string) => void;
}

const THEME_ICONS: Record<string, string> = {
  'deluxe-salon': '✂️',
  'bus-driver': '🚌',
  'bhojpuri-bangers': '🐘',
  'bartan-time': '🍽️',
  'raju-mistri': '🔨',
  'papa-ke-gaane': '👨‍👩‍👧',
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  activeThemeSlug,
  onThemeSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeTheme = themes.find((t) => t.slug === activeThemeSlug);

  const updatePosition = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, updatePosition]);

  const handleSelect = (slug: string) => {
    onThemeSelect(slug);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="theme-selector-wrapper" style={{ position: 'relative', zIndex: 50, maxWidth: '90vw' }}>
      <button
        data-testid="theme-selector"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'rgba(30, 20, 50, 0.85)',
          border: '1px solid rgba(170, 59, 255, 0.4)',
          borderRadius: '10px',
          color: '#e9d5ff',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'var(--sans)',
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(170, 59, 255, 0.15)',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
        }}
        aria-label="Change Theme"
        aria-expanded={open}
      >
        <span style={{ fontSize: '16px' }}>
          {activeTheme ? (THEME_ICONS[activeTheme.slug] || '🎵') : '🎵'}
        </span>
        <span>{activeTheme ? activeTheme.name : 'Change Theme'}</span>
        <span style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {open && (
        <>
          <div
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              right: dropdownPos.right,
              minWidth: '230px',
              background: 'rgba(12, 8, 22, 0.97)',
              border: '1px solid rgba(170, 59, 255, 0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(170,59,255,0.1)',
              backdropFilter: 'blur(20px)',
              zIndex: 100,
            }}
          >
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: '#7c3aed',
              fontFamily: 'var(--mono)',
            }}>
              Select Vibe
            </div>
            {themes.map((theme) => (
              <button
                key={theme.slug}
                data-testid="theme-option"
                onClick={() => handleSelect(theme.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  background: activeThemeSlug === theme.slug
                    ? 'rgba(170, 59, 255, 0.15)'
                    : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  color: activeThemeSlug === theme.slug ? '#e9d5ff' : '#a78bfa',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'var(--sans)',
                  fontWeight: activeThemeSlug === theme.slug ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeThemeSlug !== theme.slug) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(170, 59, 255, 0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#c4b5fd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeThemeSlug !== theme.slug) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#a78bfa';
                  }
                }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{THEME_ICONS[theme.slug] || '🎵'}</span>
                <div>
                  <div>{theme.name}</div>
                  {theme.description && (
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px', fontWeight: 400 }}>
                      {theme.description.slice(0, 45)}{theme.description.length > 45 ? '…' : ''}
                    </div>
                  )}
                </div>
                {activeThemeSlug === theme.slug && (
                  <span style={{ marginLeft: 'auto', color: '#a855f7', fontSize: '12px' }}>▶</span>
                )}
              </button>
            ))}
          </div>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );
};
