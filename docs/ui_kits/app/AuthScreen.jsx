/* Auth screens — Login / Signup
   Depends on Frame.jsx globals */

function AuthScreen({ onDone }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);

  const isValid = email.includes('@') && password.length >= 6 && (mode === 'login' || name.length >= 2);

  return (
    <div className="app-body" style={{ background: 'var(--bg-1)', display: 'flex', flexDirection: 'column' }}>
      {/* Brand header */}
      <div style={{ padding: '32px 24px 24px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(180deg, #FF8A3D, #FF6F0F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(255,111,15,.25)'
        }}>
          <Icon name="bus" size={40} color="#fff"/>
        </div>
        <h1 style={{
          margin: 0, fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--fg-1)'
        }}>
          {mode === 'login' ? '셔틀트래커에\n오신 걸 환영해요' : '계정을 만들어\n친구와 위치를 공유해요'}
          <style>{`h1 { white-space: pre-line; }`}</style>
        </h1>
        <p style={{
          margin: '8px 0 0', fontSize: 15, color: 'var(--fg-3)',
          lineHeight: 1.5, letterSpacing: '-0.01em'
        }}>
          {mode === 'login' ? '이메일로 로그인하고 실시간 셔틀 위치를 확인하세요.' : '친구에게 먼저 도착한 셔틀의 위치를 실시간으로 공유받아요.'}
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: '8px 20px 0', flex: 1 }}>
        <div className="stack stack-16">
          {mode === 'signup' && (
            <Field label="이름">
              <IconInput icon="user" placeholder="홍길동" value={name}
                onChange={e => setName(e.target.value)}/>
            </Field>
          )}
          <Field label="이메일">
            <IconInput icon="mail" type="email" placeholder="example@email.com"
              value={email} onChange={e => setEmail(e.target.value)}/>
          </Field>
          <Field label="비밀번호" hint="6자 이상, 영문·숫자 조합">
            <IconInput icon="lock"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              rightIcon={showPw ? 'eye-off' : 'eye'}
              onRightClick={() => setShowPw(v => !v)}/>
          </Field>
        </div>

        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <button style={{
              border: 0, background: 'transparent', cursor: 'pointer',
              color: 'var(--fg-3)', fontSize: 13, fontWeight: 500,
              padding: 4
            }}>비밀번호 찾기</button>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ padding: '16px 20px 24px' }}>
        <Button variant="primary" size="lg" block disabled={!isValid}
          onClick={() => onDone?.()}>
          {mode === 'login' ? '로그인' : '회원가입'}
        </Button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '20px 0', color: 'var(--fg-4)', fontSize: 12
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
          <span>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}/>
        </div>

        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--fg-2)' }}>
          {mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{
              border: 0, background: 'transparent',
              color: 'var(--carrot-500)', fontWeight: 700,
              marginLeft: 6, cursor: 'pointer', padding: 4,
              fontSize: 14, letterSpacing: '-0.01em'
            }}
          >
            {mode === 'login' ? '회원가입' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.AuthScreen = AuthScreen;
