# 인증 API — `/auth/*`

← [api-spec.md](./api-spec.md)

---

## POST /auth/register/mattermost/send-code

**무인증**. 회원가입 1단계.

```json
// Request
{ "email": "a@ssafy.com", "mattermostWebhookUrl": "https://meeting.ssafy.com/hooks/xxx" }
// Response
{ "success": true, "data": null }
```

에러: `MATTERMOST_WEBHOOK_FAILED`

---

## POST /auth/register/mattermost/verify

**무인증**. 회원가입 2단계 — 코드 확인.

일치 시 Redis `mattermost:auth:{email}` 의 `verified` 플래그를 `true` 로 갱신 (TTL 유지).

```json
// Request
{ "email": "a@ssafy.com", "code": "12345" }
// Response
{ "success": true, "data": null }
```

에러: `INVALID_MATTERMOST_CODE`

---

## POST /auth/register

**무인증**. 회원가입 3단계 — 계정 생성. 토큰 미발급 (별도 로그인 필요).

서버는 `GETDEL mattermost:auth:{email}` 로 인증 토큰을 atomic 소비 (race 방어).

```json
// Request
{
  "email": "a@ssafy.com",
  "password": "Pass1234!",
  "name": "홍길동",
  "studentNumber": "1234567"
}
// Response
{
  "success": true,
  "data": {
    "userId": 10,
    "email": "a@ssafy.com",
    "name": "홍길동",
    "studentNumber": "1234567"
  }
}
```

에러: `DUPLICATE_EMAIL`, `DUPLICATE_STUDENT_NUMBER`, `MATTERMOST_NOT_VERIFIED`

---

## POST /auth/login

**무인증**.

```json
// Request
{ "email": "a@ssafy.com", "password": "Pass1234!" }
// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "r.eyJ...",
    "user": { "userId": 10, "email": "...", "name": "...", "role": "USER" }
  }
}
```

에러: `INVALID_CREDENTIALS`

---

## POST /auth/refresh

**무인증** (refreshToken 자체가 인증).

```json
// Request
{ "refreshToken": "r.eyJ..." }
// Response
{
  "success": true,
  "data": { "accessToken": "...", "refreshToken": "..." }
}
```

에러: `INVALID_REFRESH_TOKEN`

---

## POST /auth/logout

- `DEL refresh:{userId}` + 현재 access token JTI 를 `blacklist:user:{userId}` SET 에 SADD (TTL 30분)
- `DELETE device_token WHERE user_id=?`

```json
// Response
{ "success": true, "data": null }
```

---

## POST /auth/password

새 비밀번호 적용 후 refresh + 현재 access JTI 모두 폐기 → 재로그인 강제.

```json
// Request
{ "currentPassword": "...", "newPassword": "..." }
// Response
{ "success": true, "data": null }
```

에러: `INVALID_CREDENTIALS`, `INVALID_ARGUMENT`

---

## 에러 코드

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `DUPLICATE_EMAIL` | 409 | 이미 사용 중인 이메일입니다. |
| `DUPLICATE_STUDENT_NUMBER` | 409 | 이미 사용 중인 학번입니다. |
| `INVALID_CREDENTIALS` | 401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| `INVALID_MATTERMOST_CODE` | 400 | 인증 코드가 올바르지 않거나 만료되었습니다. |
| `MATTERMOST_WEBHOOK_FAILED` | 502 | 인증 코드 발송에 실패했습니다. Mattermost 웹훅 URL을 확인해주세요. |
| `MATTERMOST_NOT_VERIFIED` | 400 | Mattermost 인증을 먼저 완료해주세요. |
| `ADMIN_CANNOT_WITHDRAW` | 403 | 관리자 계정은 탈퇴할 수 없습니다. |
