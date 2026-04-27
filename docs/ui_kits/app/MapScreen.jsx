/* Map/ETA screen — core shuttle tracker view */

function MapScreen({ goFriends }) {
  const [selectedFriend, setSelectedFriend] = useState('MJ');
  const [sharing, setSharing] = useState(true);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [remainingMin, setRemainingMin] = useState(42); // session countdown

  useEffect(() => {
    if (!sharing) return;
    const t = setInterval(() => setRemainingMin(m => Math.max(0, m - 1)), 60_000);
    return () => clearInterval(t);
  }, [sharing]);

  const friends = [
    { id: 'MJ', name: '민지', eta: '3분', color: '#FF6F0F' },
    { id: 'SH', name: '승호', eta: '7분', color: '#3182F6' },
    { id: 'YR', name: '유리', eta: '12분', color: '#12B886' },
  ];

  const stops = [
    { id: 1, name: '효덕초 후문', eta: '약 12분 후', time: '08:23 예정', status: 'upcoming' },
    { id: 2, name: '정문 앞 사거리', eta: '약 18분 후', time: '08:29 예정', status: 'upcoming' },
    { id: 3, name: '시청역 3번 출구', eta: '지나감', time: '08:05 지나감', status: 'passed' },
    { id: 4, name: '종점 · 학교 기숙사', eta: '약 24분 후', time: '08:35 예정', status: 'upcoming' },
  ];

  return (
    <div className="app-body" style={{ background: '#F2F3F6', position: 'relative' }}>
      {/* ===== Map (stylized) ===== */}
      <MapCanvas selectedFriend={selectedFriend} friends={friends}/>

      {/* ===== Floating top bar ===== */}
      <div style={{
        position: 'absolute', top: 12, left: 16, right: 16,
        display: 'flex', gap: 8, alignItems: 'center', zIndex: 5
      }}>
        <div style={{
          flex: 1, height: 48, background: '#fff',
          borderRadius: 24, display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)',
          cursor: 'pointer'
        }}>
          <Icon name="search" size={20} color="var(--fg-3)"/>
          <span style={{ color: 'var(--fg-3)', fontSize: 15 }}>친구·노선 검색</span>
        </div>
        <button style={{
          width: 48, height: 48, borderRadius: 24, border: 0, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)',
          position: 'relative'
        }}>
          <Icon name="bell" size={22} color="var(--fg-1)"/>
          <span className="badge" style={{ position: 'absolute', top: 8, right: 8 }}>2</span>
        </button>
      </div>

      {/* ===== Session chip ===== */}
      {sharing && (
        <div style={{
          position: 'absolute', top: 76, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(25,31,40,.92)', color: '#fff',
          padding: '8px 14px 8px 10px', borderRadius: 999,
          fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,.15)'
        }}>
          <span style={{ position: 'relative', width: 8, height: 8 }}>
            <span className="dot" style={{ position: 'absolute', inset: 0 }}/>
            <span className="dot-pulse" style={{ position: 'absolute', inset: 0 }}/>
          </span>
          <span>위치 공유 중 · {String(Math.floor(remainingMin/60)).padStart(2,'0')}:{String(remainingMin%60).padStart(2,'0')} 남음</span>
        </div>
      )}

      {/* ===== Floating map controls ===== */}
      <div style={{
        position: 'absolute', right: 12, top: 140,
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 5
      }}>
        <MapButton icon="navigation"/>
        <MapButton icon="plus"/>
        <MapButton icon="refresh"/>
      </div>

      {/* ===== Friend chips row ===== */}
      <div style={{
        position: 'absolute', bottom: sheetExpanded ? 480 : 260, left: 0, right: 0,
        padding: '0 16px', display: 'flex', gap: 8, overflowX: 'auto', zIndex: 6,
        transition: 'bottom 280ms cubic-bezier(.2,0,.1,1)'
      }}>
        {friends.map(f => (
          <button key={f.id} onClick={() => setSelectedFriend(f.id)} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 14px 6px 6px', borderRadius: 999, border: 0, cursor: 'pointer',
            background: selectedFriend === f.id ? '#191F28' : '#fff',
            color: selectedFriend === f.id ? '#fff' : 'var(--fg-1)',
            fontSize: 13, fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            transition: 'all 160ms ease'
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 14,
              background: f.color, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700
            }}>{f.name[0]}</span>
            {f.name} · {f.eta}
          </button>
        ))}
      </div>

      {/* ===== Bottom sheet: ETA list ===== */}
      <BottomSheet expanded={sheetExpanded} onToggle={() => setSheetExpanded(e => !e)}>
        <div style={{ padding: '0 20px 12px' }}>
          <div className="row-between" style={{ marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--carrot-500)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                실시간 도착 예정
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
                1호차 · 학교 ↔ 시청
              </h2>
            </div>
            <button className="chip active">
              <Icon name="broadcast" size={14}/> 공유중
            </button>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>
            30초 전 업데이트 · 다음 정류장까지 약 420m
          </div>
        </div>

        <hr className="divider"/>

        <div style={{ padding: '8px 0' }}>
          {stops.map((s, i) => <StopRow key={s.id} stop={s} index={i+1} isLast={i === stops.length-1}/>)}
        </div>
      </BottomSheet>
    </div>
  );
}

function MapButton({ icon }) {
  return (
    <button style={{
      width: 44, height: 44, borderRadius: 22, border: 0, background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)'
    }}>
      <Icon name={icon} size={20} color="var(--fg-1)"/>
    </button>
  );
}

function StopRow({ stop, index, isLast }) {
  const passed = stop.status === 'passed';
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch', padding: '12px 20px',
      opacity: passed ? 0.5 : 1
    }}>
      {/* stepper */}
      <div style={{
        position: 'relative', width: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 12,
          background: passed ? 'var(--gray-300)' : 'var(--carrot-500)',
          color: '#fff', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2
        }}>{index}</div>
        {!isLast && (
          <div style={{
            position: 'absolute', top: 24, bottom: -12, width: 2,
            background: `repeating-linear-gradient(to bottom, ${passed ? '#D1D6DB' : '#FFA66B'} 0 4px, transparent 4px 8px)`
          }}/>
        )}
      </div>

      <div style={{ flex: 1, marginLeft: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
            {stop.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
            {stop.time}
          </div>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700,
          color: passed ? 'var(--fg-3)' : (stop.id === 1 ? 'var(--carrot-500)' : 'var(--fg-1)'),
          fontFeatureSettings: '"tnum" 1'
        }}>
          {stop.eta}
        </div>
      </div>
    </div>
  );
}

function BottomSheet({ expanded, onToggle, children }) {
  const height = expanded ? 560 : 320;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height, background: '#fff',
      borderRadius: '20px 20px 0 0',
      boxShadow: '0 -4px 24px rgba(0,0,0,.08)',
      transition: 'height 280ms cubic-bezier(.2,0,.1,1)',
      zIndex: 5, overflow: 'hidden'
    }}>
      <button onClick={onToggle} style={{
        width: '100%', padding: '10px 0 8px',
        border: 0, background: 'transparent', cursor: 'pointer',
        display: 'flex', justifyContent: 'center'
      }}>
        <span style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--gray-300)' }}/>
      </button>
      <div style={{ height: 'calc(100% - 26px)', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Stylized Map Canvas ---------- */
function MapCanvas({ selectedFriend, friends }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#E5E9EE',
      overflow: 'hidden'
    }}>
      <svg viewBox="0 0 390 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
           style={{ display: 'block' }}>
        {/* water / park patches */}
        <rect width="390" height="700" fill="#E8ECF0"/>
        <path d="M-20 540 Q 100 480 240 520 T 420 500 L 420 720 L -20 720 Z" fill="#D6E8F5"/>
        <rect x="40" y="120" width="110" height="70" rx="8" fill="#D9F0E2"/>
        <rect x="240" y="240" width="100" height="80" rx="8" fill="#D9F0E2"/>
        <rect x="280" y="60" width="80" height="50" rx="6" fill="#EEF1F5"/>

        {/* roads (wide base) */}
        <g stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" fill="none">
          <path d="M-20 90 L 420 70"/>
          <path d="M-20 220 L 420 260"/>
          <path d="M-20 400 L 420 390"/>
          <path d="M60 -20 L 90 730"/>
          <path d="M200 -20 L 220 730"/>
          <path d="M310 -20 L 340 730"/>
        </g>
        <g stroke="#F6F8FA" strokeWidth="18" strokeLinecap="round" fill="none">
          <path d="M-20 90 L 420 70"/>
          <path d="M-20 220 L 420 260"/>
          <path d="M-20 400 L 420 390"/>
          <path d="M60 -20 L 90 730"/>
          <path d="M200 -20 L 220 730"/>
          <path d="M310 -20 L 340 730"/>
        </g>

        {/* shuttle route polyline */}
        <path d="M40 420 Q 90 360 130 330 T 220 250 Q 270 210 310 160 T 370 80"
          fill="none" stroke="#FF6F0F" strokeWidth="5" strokeLinecap="round"/>
        <path d="M40 420 Q 90 360 130 330 T 220 250 Q 270 210 310 160 T 370 80"
          fill="none" stroke="#FFA66B" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 10" opacity="0.9"/>

        {/* Stops */}
        <StopMarker x={40} y={420} n={3} passed/>
        <StopMarker x={130} y={330} n={2}/>
        <StopMarker x={220} y={250} n={1} active/>
        <StopMarker x={370} y={80} n={4}/>

        {/* Bus — currently between stop 3 and stop 2 */}
        <g transform="translate(85, 375)">
          <circle r="22" fill="#FF6F0F" opacity="0.18"/>
          <circle r="16" fill="#FF6F0F"/>
          <g stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(-8,-8)">
            <path d="M3 12V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8"/>
            <rect x="2" y="12" width="12" height="2" rx="1" fill="#FFF"/>
          </g>
        </g>

        {/* Friends markers (selected = red/carrot, others = blue) */}
        <FriendMarker x={175} y={315} color="#FF6F0F" initial="민" selected={selectedFriend === 'MJ'}/>
        <FriendMarker x={260} y={200} color="#3182F6" initial="승" selected={selectedFriend === 'SH'}/>
        <FriendMarker x={340} y={130} color="#3182F6" initial="유" selected={selectedFriend === 'YR'}/>

        {/* My location — star */}
        <g transform="translate(110, 500)">
          <circle r="14" fill="#3182F6" opacity="0.2"/>
          <circle r="10" fill="#3182F6" stroke="#fff" strokeWidth="3"/>
        </g>
      </svg>
    </div>
  );
}

function StopMarker({ x, y, n, active, passed }) {
  const fill = passed ? '#D1D6DB' : active ? '#FF6F0F' : '#fff';
  const stroke = passed ? '#D1D6DB' : '#FF6F0F';
  const textColor = passed ? '#fff' : active ? '#fff' : '#FF6F0F';
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="13" fill={fill} stroke={stroke} strokeWidth="3"/>
      <text textAnchor="middle" y="4" fontSize="11" fontWeight="700" fill={textColor}
            style={{ fontFamily: 'Pretendard, sans-serif' }}>{n}</text>
    </g>
  );
}

function FriendMarker({ x, y, color, initial, selected }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {selected && <circle r="28" fill={color} opacity="0.15"/>}
      <g transform="translate(0,-6)">
        <path d={`M0 22 L -10 10 A 12 12 0 1 1 10 10 Z`} fill={color}/>
        <circle cy="-2" r="9" fill="#fff"/>
        <text textAnchor="middle" y="2" fontSize="10" fontWeight="700" fill={color}
              style={{ fontFamily: 'Pretendard, sans-serif' }}>{initial}</text>
      </g>
    </g>
  );
}

window.MapScreen = MapScreen;
