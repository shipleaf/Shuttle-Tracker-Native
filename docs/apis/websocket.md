# WebSocket STOMP

← [api-spec.md](./api-spec.md)

> STOMP 메시지는 REST wrapper(`{success, data}`)를 적용하지 않는다. 토픽별 페이로드는 아래 그대로 전송.

---

## 연결

```
ws://localhost:8081/ws  (SockJS fallback 지원)

CONNECT
  Authorization: Bearer {accessToken}
```

실패: `INVALID_JWT_TOKEN`

---

## 구독 토픽

### 버스 위치

```
SUBSCRIBE /topic/route/{routeId}/bus
```

수신 메시지:
```json
// LIVE
{ "state": "LIVE", "lat": 35.14, "lng": 126.89, "updatedAt": "..." }
// NONE
{ "state": "NONE" }
```

### ETA

```
SUBSCRIBE /topic/route/{routeId}/arrival
```

수신 메시지: `POST /shuttle/arrival-time` 응답의 `data` 객체와 동일 구조 (wrapper 없이 그대로).

### 라이더 개인 큐 (공유 종료 통지)

```
SUBSCRIBE /user/queue/share-ended
```

수신 메시지:
```json
{ "reason": "MANUAL" | "TTL_EXPIRED" | "TERMINAL_REACHED", "routeId": 2, "endedAt": "2026-04-21T13:00:00Z" }
```

| reason | 설명 |
|---|---|
| `MANUAL` | 라이더가 수동 stop 호출 |
| `TTL_EXPIRED` | 60분 하드 캡 자동 종료 |
| `TERMINAL_REACHED` | 종점 50m 반경 자동 감지 (LS-015) |

라이더 클라이언트는 이 메시지 수신 시 공유 화면을 닫고 홈으로 복귀.

---

## 클라이언트 요구사항

- Heartbeat: 10s / 10s
- 재연결: 지수 백오프 (1s → 2s → 4s → … max 30s)
- Foreground 복귀 시 재연결

---

## 에러 코드

| 코드 | 한국어 메시지 |
|---|---|
| `INVALID_JWT_TOKEN` | 인증 토큰이 올바르지 않습니다. 다시 연결해주세요. |
