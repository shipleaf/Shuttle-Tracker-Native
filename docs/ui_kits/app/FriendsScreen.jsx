/* Friends screen — requests, list, search */

function FriendsScreen({ onToast }) {
  const [tab, setTab] = useState('friends'); // friends | requests | search
  const [searchQuery, setSearchQuery] = useState('');
  const [sharing, setSharing] = useState({ MJ: true, SH: true, YR: false, JH: false, NA: true });

  const friends = [
    { id: 'MJ', name: '민지', email: 'minji@email.com', status: '위치 공유 중', location: '학교 앞 버스정류장', eta: '3분 전 업데이트', color: '#FF6F0F' },
    { id: 'SH', name: '승호', email: 'seungho@email.com', status: '위치 공유 중', location: '시청역 부근', eta: '방금 전', color: '#3182F6' },
    { id: 'NA', name: '나래', email: 'narae@email.com', status: '위치 공유 중', location: '1호차 안', eta: '1분 전', color: '#12B886' },
    { id: 'YR', name: '유리', email: 'yuri@email.com', status: '오프라인', location: '', eta: '어제 18:42', color: '#A855F7' },
    { id: 'JH', name: '재현', email: 'jaehyun@email.com', status: '오프라인', location: '', eta: '3일 전', color: '#F59E0B' },
  ];

  const requests = [
    { id: 'R1', name: '지수', email: 'jisoo@email.com', mutual: 2, color: '#0EA5E9' },
    { id: 'R2', name: '현우', email: 'hyunwoo@email.com', mutual: 5, color: '#F04438' },
  ];

  return (
    <div className="app-body" style={{ background: 'var(--bg-1)' }}>
      <TopNav large title="친구" right={
        <IconButton name="plus" onClick={() => { setTab('search'); onToast?.('친구 추가하기'); }}/>
      }/>

      {/* Segmented tabs */}
      <div style={{ padding: '4px 16px 12px' }}>
        <div style={{
          display: 'flex', gap: 4, padding: 4,
          background: 'var(--bg-3)', borderRadius: 12
        }}>
          {[
            { id: 'friends', label: '내 친구', count: friends.length },
            { id: 'requests', label: '요청', count: requests.length },
            { id: 'search', label: '친구 찾기' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, height: 36, border: 0, borderRadius: 8, cursor: 'pointer',
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? 'var(--fg-1)' : 'var(--fg-3)',
              fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
              transition: 'all 160ms ease',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4
            }}>
              {t.label}
              {typeof t.count === 'number' && t.count > 0 && (
                <span style={{
                  background: tab === t.id ? 'var(--carrot-500)' : 'var(--gray-400)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 999
                }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'friends' && (
        <FriendsList friends={friends} sharing={sharing} onToggle={id => {
          setSharing(s => ({ ...s, [id]: !s[id] }));
          onToast?.(sharing[id] ? '위치 공유를 껐어요' : '위치 공유를 켰어요');
        }}/>
      )}
      {tab === 'requests' && (
        <RequestsList requests={requests} onAccept={(n) => onToast?.(`${n}님과 친구가 되었어요`)} onReject={(n) => onToast?.(`요청을 거절했어요`)}/>
      )}
      {tab === 'search' && (
        <FriendSearch q={searchQuery} setQ={setSearchQuery} onRequest={(n) => onToast?.(`${n}님에게 요청을 보냈어요`)}/>
      )}
    </div>
  );
}

function FriendsList({ friends, sharing, onToggle }) {
  const sharingFriends = friends.filter(f => sharing[f.id]);
  const offlineFriends = friends.filter(f => !sharing[f.id]);
  return (
    <div>
      {sharingFriends.length > 0 && (
        <>
          <SectionHeader title="위치 공유 중" count={sharingFriends.length} accent/>
          <div>{sharingFriends.map(f => <FriendRow key={f.id} friend={f} sharing onToggle={onToggle}/>)}</div>
        </>
      )}
      {offlineFriends.length > 0 && (
        <>
          <hr className="divider-thick"/>
          <SectionHeader title="오프라인" count={offlineFriends.length}/>
          <div>{offlineFriends.map(f => <FriendRow key={f.id} friend={f} onToggle={onToggle}/>)}</div>
        </>
      )}
    </div>
  );
}

function SectionHeader({ title, count, accent }) {
  return (
    <div style={{
      padding: '16px 20px 8px',
      display: 'flex', alignItems: 'center', gap: 6
    }}>
      <span style={{
        fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
        color: accent ? 'var(--carrot-500)' : 'var(--fg-2)'
      }}>{title}</span>
      {accent && <span style={{ position: 'relative', width: 6, height: 6 }}>
        <span className="dot" style={{ position: 'absolute', inset: 0, width: 6, height: 6 }}/>
      </span>}
      <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>{count}</span>
    </div>
  );
}

function FriendRow({ friend, sharing, onToggle }) {
  return (
    <div className="list-item" style={{ padding: '12px 20px' }}>
      <div style={{ position: 'relative' }}>
        <Avatar name={friend.name} color={friend.color}/>
        {sharing && (
          <span style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 14, height: 14, borderRadius: 7,
            background: 'var(--green-500)', border: '2px solid #fff'
          }}/>
        )}
      </div>
      <div className="body">
        <div className="title">{friend.name}</div>
        <div className="subtitle">
          {sharing ? `${friend.location} · ${friend.eta}` : friend.eta}
        </div>
      </div>
      {sharing ? (
        <button onClick={() => onToggle?.(friend.id)} className="chip active">
          <Icon name="pin" size={14}/>
          지도에서 보기
        </button>
      ) : (
        <Icon name="chevron-right" size={20} color="var(--fg-4)"/>
      )}
    </div>
  );
}

function RequestsList({ requests, onAccept, onReject }) {
  if (requests.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
        <div style={{ fontSize: 15, color: 'var(--fg-3)' }}>받은 요청이 없어요</div>
      </div>
    );
  }
  return (
    <div style={{ padding: '8px 16px' }}>
      {requests.map(r => (
        <div key={r.id} className="card" style={{ marginBottom: 10, padding: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name={r.name} color={r.color}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-1)' }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{r.email}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                함께 아는 친구 {r.mutual}명
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" size="sm" block onClick={() => onAccept?.(r.name)}>수락</Button>
            <Button variant="secondary" size="sm" block onClick={() => onReject?.(r.name)}>거절</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FriendSearch({ q, setQ, onRequest }) {
  const results = q.length >= 2 ? [
    { id: 'S1', name: q + '린', email: q.toLowerCase() + 'rin@email.com', color: '#F59E0B' },
    { id: 'S2', name: q + '아', email: q.toLowerCase() + 'a@email.com', color: '#12B886' },
  ] : [];
  return (
    <div>
      <div style={{ padding: '4px 16px 12px' }}>
        <div className="input-wrap">
          <span className="icon-left"><Icon name="search" size={20}/></span>
          <input className="input" placeholder="이메일 또는 이름으로 검색"
            value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 8, paddingLeft: 4 }}>
          이메일 주소로 정확히 검색할 수 있어요
        </div>
      </div>
      {q.length < 2 && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--fg-3)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: 'var(--bg-3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12
          }}>
            <Icon name="search" size={26} color="var(--fg-4)"/>
          </div>
          <div style={{ fontSize: 14 }}>이메일로 친구를 찾아보세요</div>
        </div>
      )}
      {results.map(r => (
        <div key={r.id} className="list-item">
          <Avatar name={r.name} color={r.color}/>
          <div className="body">
            <div className="title">{r.name}</div>
            <div className="subtitle">{r.email}</div>
          </div>
          <Button variant="primary" size="sm" onClick={() => onRequest?.(r.name)}>요청</Button>
        </div>
      ))}
    </div>
  );
}

window.FriendsScreen = FriendsScreen;
