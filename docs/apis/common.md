# 공통 규칙

← [api-spec.md](./api-spec.md)

---

## 인증

```
Authorization: Bearer {accessToken}
```

아래 경로는 **무인증** 허용:
- `/auth/register`, `/auth/login`, `/auth/refresh`
- `/auth/register/mattermost/*`
- `/app/version`

그 외 모든 엔드포인트는 헤더 필수.

---

## 응답 포맷 (풀 wrapper)

모든 REST 응답은 아래 wrapper 구조로 직렬화한다.

**성공**:
```json
{ "success": true, "data": { ... } }
```

**성공 — data 없음**:
```json
{ "success": true, "data": null }
```

**실패**:
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "한국어 메시지" } }
```

> WebSocket STOMP 메시지에는 wrapper를 적용하지 않는다. ([websocket.md](./websocket.md) 참고)

---

## 공통 에러 코드

| 코드 | HTTP | 설명 |
|---|---|---|
| `INVALID_ARGUMENT` | 400 | 입력 검증 실패 |
| `UNAUTHORIZED` | 401 | accessToken 없음/잘못됨 |
| `INVALID_REFRESH_TOKEN` | 401 | refreshToken 검증 실패 / 재사용 감지 |
| `FORBIDDEN` | 403 | 권한 부족 (관리자 전용 등) |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `EXTERNAL_SERVER_ERROR` | 502 | Kakao / FCM 외부 API 실패 |
| `INTERNAL_SERVER_ERROR` | 500 | 미처리 예외 |

---

## 좌표·시각 포맷

- 좌표: `{"lat": 35.123456, "lng": 126.987654}` (소수점 6자리)
- 시각: ISO 8601 UTC (`2026-04-21T12:00:00Z`)
