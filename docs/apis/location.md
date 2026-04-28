# 위치 공유 API — `/location/*`

← [api-spec.md](./api-spec.md)

---

## POST /location/start (라이더)

```json
// Request
{ "routeId": 2, "latitude": 35.112, "longitude": 126.897 }
// Response
{
  "success": true,
  "data": { "isActive": true, "startTime": "...", "endTime": "..." }
}
```

에러: `LOCATION_SHARE_NOT_AGREED`, `ROUTE_NOT_FOUND`

---

## POST /location/update (라이더)

```json
// Request
{ "latitude": 35.113, "longitude": 126.898 }
// Response
{ "success": true, "data": null }
```

에러: `NO_ACTIVE_SHARE`

---

## POST /location/stop (라이더)

```json
// Response
{ "success": true, "data": null }
```

---

## GET /location/my-status

```json
// Response
{
  "success": true,
  "data": { "isActive": true, "routeId": 2, "startTime": "...", "endTime": "...", "remainingSeconds": 2400 }
}
```

---

## GET /location/route/{routeId} (대기자)

폴링 권장 주기: **30초** (초기 진입 시 1회 호출 + STOMP 구독으로 전환). 수동 새로고침은 별도 버튼.

```json
// LIVE
{
  "success": true,
  "data": { "state": "LIVE", "lat": 35.14, "lng": 126.89, "updatedAt": "2026-04-21T12:00:00Z" }
}
// NONE
{
  "success": true,
  "data": { "state": "NONE" }
}
```

---

## POST /location/share-requests (공유 요청)

```json
// Request
{ "targetUserIds": [11, 12, 13], "routeId": 2 }
// Response
{
  "success": true,
  "data": { "sent": 2, "noToken": 1, "notFriend": 0, "alreadySharing": 0 }
}
```

---

## 에러 코드

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `LOCATION_SHARE_NOT_AGREED` | 403 | 위치 공유 동의가 필요합니다. 설정에서 동의를 켜주세요. |
| `NO_ACTIVE_SHARE` | 409 | 활성화된 공유 세션이 없습니다. |
