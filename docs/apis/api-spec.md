# SSAFY 셔틀 트래커 — API 명세서 인덱스 v1.4

> **v1.4** (2026-04-27) — Access token blacklist (AUTH-019), 종점 자동 감지(LS-015), ETA 폴백 응답 형식, STOMP `/user/queue/share-ended` 추가
> **v1.3** (2026-04-27) — 응답 포맷 풀 wrapper 통일
> **v1.2** (2026-04-22) — 친구 요청 body 학번 기반 전환

- Base URL: `https://shuttle.ssafy.com/api/v1`
- Local: `http://localhost:8081/api/v1`

---

## 도메인별 문서

| 도메인 | 파일 | 주요 경로 |
|---|---|---|
| 공통 규칙 | [common.md](./common.md) | 인증 헤더, 응답 포맷, 공통 에러 |
| 인증 | [auth.md](./auth.md) | `/auth/*` |
| 사용자 | [users.md](./users.md) | `/users/*` |
| 친구 | [friends.md](./friends.md) | `/friends/*` |
| 노선 | [routes.md](./routes.md) | `/routes/*` |
| 위치 공유 | [location.md](./location.md) | `/location/*` |
| 도착 시간(ETA) | [shuttle.md](./shuttle.md) | `/shuttle/*` |
| 기기 | [devices.md](./devices.md) | `/devices/*` |
| 관리자 | [admin.md](./admin.md) | `/admin/*` |
| 앱 정보 | [app.md](./app.md) | `/app/*` |
| WebSocket STOMP | [websocket.md](./websocket.md) | `ws://…/ws` |
| FCM / 딥링크 | [fcm-deeplink.md](./fcm-deeplink.md) | — |
| 에러 카탈로그 | [errors.md](./errors.md) | 전체 에러 코드 + 한국어 메시지 |
