/* Phone frame + shared primitives for Shuttle Tracker screens.
   Loaded via <script type="text/babel" src="Frame.jsx"></script>
   Requires: React 18 + Babel Standalone */

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ---------- Icon helper ---------- */
function Icon({ name, size = 24, color, className = '', style = {} }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size} height={size}
      style={{ color, width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <use href={`#${name}`} />
    </svg>
  );
}

/* ---------- iOS status bar ---------- */
function StatusBar({ color = 'dark' }) {
  const fg = color === 'light' ? '#fff' : '#191F28';
  return (
    <div className="status-bar" style={{ color: fg }}>
      <span>9:41</span>
      <div className="right">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill={fg}>
          <rect x="0" y="8" width="3" height="4" rx="1"/>
          <rect x="5" y="5" width="3" height="7" rx="1"/>
          <rect x="10" y="2" width="3" height="10" rx="1"/>
          <rect x="15" y="0" width="3" height="12" rx="1"/>
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill={fg}>
          <path d="M8 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM3.5 6.3a7 7 0 0 1 9 0l-1 1.2a5.5 5.5 0 0 0-7 0l-1-1.2zM1 3.2a11 11 0 0 1 14 0l-1 1.2a9.5 9.5 0 0 0-12 0L1 3.2z"/>
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0" y="0" width="22" height="12" rx="3" fill="none" stroke={fg} strokeOpacity="0.4"/>
          <rect x="23" y="4" width="2" height="4" rx="1" fill={fg} fillOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={fg}/>
        </svg>
      </div>
    </div>
  );
}

/* ---------- Home indicator (iOS bottom bar) ---------- */
function HomeIndicator({ color = '#191F28' }) {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: '50%',
      transform: 'translateX(-50%)',
      width: 134, height: 5, borderRadius: 3,
      background: color, opacity: 0.9, zIndex: 20, pointerEvents: 'none'
    }}/>
  );
}

/* ---------- App frame (390×844 iOS) ---------- */
function AppFrame({ children, statusBarColor = 'dark', homeColor = '#191F28' }) {
  return (
    <div className="app-frame">
      <div className="app-frame-inner">
        <StatusBar color={statusBarColor}/>
        {children}
        <HomeIndicator color={homeColor}/>
      </div>
    </div>
  );
}

/* ---------- Buttons ---------- */
function Button({ variant = 'primary', size = 'md', block, children, ...props }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'lg' && 'btn-lg',
    size === 'sm' && 'btn-sm',
    block && 'btn-block',
  ].filter(Boolean).join(' ');
  return <button className={cls} {...props}>{children}</button>;
}

/* ---------- Top nav ---------- */
function TopNav({ title, left, right, bordered = false, large = false }) {
  if (large) {
    return (
      <>
        <div className="nav-top">
          <div className="left">{left}</div>
          <div className="right">{right}</div>
        </div>
        <div className="nav-top-large"><h1>{title}</h1></div>
      </>
    );
  }
  return (
    <div className={`nav-top ${bordered ? 'bordered' : ''}`}>
      <div className="left">{left}</div>
      <div className="title">{title}</div>
      <div className="right">{right}</div>
    </div>
  );
}

function IconButton({ name, onClick, badge }) {
  return (
    <button className="icon-btn" onClick={onClick} style={{ position: 'relative' }}>
      <Icon name={name}/>
      {badge ? (
        <span className="badge" style={{ position: 'absolute', top: 4, right: 4 }}>{badge}</span>
      ) : null}
    </button>
  );
}

/* ---------- Bottom nav ---------- */
function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'map', label: '지도', icon: 'pin' },
    { id: 'friends', label: '친구', icon: 'users' },
    { id: 'search', label: '검색', icon: 'search' },
    { id: 'profile', label: '나의 셔틀', icon: 'user' },
  ];
  return (
    <div className="nav-bottom">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange?.(t.id)}
        >
          <Icon name={t.icon} size={26} color={active === t.id ? 'var(--carrot-500)' : undefined}/>
          <span className="label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Avatar ---------- */
const AVATAR_COLORS = ['#FF8A3D', '#3182F6', '#12B886', '#F04438', '#A855F7', '#F59E0B', '#0EA5E9'];
function Avatar({ name, size = 'md', color }) {
  const i = useMemo(() => {
    if (!name) return 0;
    let s = 0; for (const c of name) s += c.charCodeAt(0);
    return s % AVATAR_COLORS.length;
  }, [name]);
  const bg = color || AVATAR_COLORS[i];
  const initial = (name || '?')[0].toUpperCase();
  const cls = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : '';
  return (
    <div className={`avatar ${cls}`} style={{ background: bg }}>
      {initial}
    </div>
  );
}

/* ---------- Field ---------- */
function Field({ label, children, hint, error }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: 'var(--red-500)' }}>{error}</span>}
    </div>
  );
}

function IconInput({ icon, rightIcon, onRightClick, ...props }) {
  return (
    <div className="input-wrap">
      {icon && <span className="icon-left"><Icon name={icon} size={20}/></span>}
      <input className="input" {...props}/>
      {rightIcon && (
        <button type="button" className="icon-right" onClick={onRightClick}>
          <Icon name={rightIcon} size={20}/>
        </button>
      )}
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ message, show }) {
  return (
    <div style={{
      position: 'absolute', bottom: 110, left: '50%',
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      opacity: show ? 1 : 0,
      background: 'rgba(25,31,40,.92)', color: '#fff',
      padding: '12px 20px', borderRadius: 12,
      fontSize: 14, fontWeight: 500,
      transition: 'all 220ms cubic-bezier(.2,0,0,1)',
      pointerEvents: 'none', zIndex: 100,
      whiteSpace: 'nowrap',
      boxShadow: '0 8px 24px rgba(0,0,0,.2)'
    }}>{message}</div>
  );
}

Object.assign(window, {
  Icon, StatusBar, HomeIndicator, AppFrame, Button, TopNav, IconButton, BottomNav,
  Avatar, Field, IconInput, Toast,
});
