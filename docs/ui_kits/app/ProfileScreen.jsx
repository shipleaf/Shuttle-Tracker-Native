/* Profile / My Shuttle screen */

function ProfileScreen({ onToast }) {
  const [sharing, setSharing] = useState(true);
  const [mins, setMins] = useState(42);

  return (
    <div className="app-body" style={{ background: 'var(--bg-2)' }}>
      <TopNav large title="나의 셔틀" right={
        <IconButton name="settings"/>
      }/>

      {/* Profile header */}
      <div style={{ padding: '8px 20px 20px', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name="현우" size="lg" color="#FF6F0F"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>김현우</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>hyunwoo@email.com</div>
          </div>
          <button className="btn btn-outline btn-sm">프로필 편집</button>
        </div>
      </div>

      {/* Sharing card */}
      <div style={{ padding: 16 }}>
        <div className="card-accent" style={{ padding: 20 }}>
          <div className="row-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--carrot-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon name="broadcast" size={22} color="#fff"/>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>위치 공유</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                  {sharing ? `${Math.floor(mins/60).toString().padStart(2,'0')}:${(mins%60).toString().padStart(2,'0')} 남음` : '꺼짐'}
                </div>
              </div>
            </div>
            <Toggle on={sharing} onChange={(v) => {
              setSharing(v);
              onToast?.(v ? '1시간 동안 공유해요' : '공유를 중단했어요');
            }}/>
          </div>

          {sharing && (
            <>
              <div style={{
                height: 6, background: 'rgba(255,111,15,.15)', borderRadius: 3,
                marginTop: 14, overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(mins/60)*100}%`, height: '100%',
                  background: 'var(--carrot-500)', borderRadius: 3,
                  transition: 'width 400ms ease'
                }}/>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8 }}>
                10초마다 현재 위치를 친구들에게 전송해요
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu */}
      <div style={{ background: 'var(--bg-1)', marginTop: 4 }}>
        <MenuRow icon="bus" label="내 노선" value="1호차 · 학교 ↔ 시청"/>
        <MenuRow icon="bell" label="도착 알림" value="5분 전"/>
        <MenuRow icon="clock" label="공유 세션 기본 시간" value="1시간"/>
      </div>

      <div style={{ background: 'var(--bg-1)', marginTop: 12 }}>
        <MenuRow icon="lock" label="개인정보 설정"/>
        <MenuRow icon="settings" label="알림 설정"/>
        <MenuRow icon="mail" label="문의하기"/>
      </div>

      <div style={{ padding: '24px 20px 40px' }}>
        <Button variant="ghost" block onClick={() => onToast?.('로그아웃 되었어요')}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      style={{
        width: 52, height: 32, borderRadius: 16, border: 0, cursor: 'pointer',
        background: on ? 'var(--carrot-500)' : 'var(--gray-300)',
        position: 'relative',
        transition: 'background 200ms ease',
        padding: 0
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 26, height: 26, borderRadius: 13, background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,.15)',
        transition: 'left 200ms cubic-bezier(.2,0,0,1)'
      }}/>
    </button>
  );
}

function MenuRow({ icon, label, value }) {
  return (
    <button className="list-item" style={{
      width: '100%', border: 0, background: 'transparent', textAlign: 'left',
      padding: '14px 20px'
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'var(--bg-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color="var(--fg-2)"/>
      </span>
      <span className="body">
        <span className="title" style={{ display: 'block' }}>{label}</span>
      </span>
      {value && <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{value}</span>}
      <Icon name="chevron-right" size={18} color="var(--fg-4)"/>
    </button>
  );
}

window.ProfileScreen = ProfileScreen;
