# 도착 시간(ETA) API — `/shuttle/*`

← [api-spec.md](./api-spec.md)

---

## POST /shuttle/arrival-time

```json
// Request
{ "routeId": 2 }

// Response — 정상
{
  "success": true,
  "data": {
    "routeName": "광주 2호차",
    "stops": [
      {
        "stopId": 10,
        "stopName": "효덕초 후문 앞",
        "sequence": 1,
        "etaSeconds": 120,
        "expectedArrival": "2026-04-21T12:02:00Z",
        "status": "UPCOMING"
      }
    ],
    "fallback": false
  }
}

// Response — Kakao Directions 실패 시 폴백 (200 OK)
{
  "success": true,
  "data": {
    "routeName": "광주 2호차",
    "stops": [],
    "fallback": true
  }
}
```

- 폴백 시 `stops: []` + `fallback: true`
- FE 처리: "지금 ETA 계산이 안 됩니다, 잠시 후 다시 시도해주세요" 표시 + 30초 후 자동 재호출 권장

---

## 에러 코드

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `NOT_FOUND_BUS_LOCATION` | 404 | 현재 운행 중인 셔틀이 없습니다. |
| `NOT_FOUND_SHUTTLE_ROUTE` | 404 | 존재하지 않는 노선입니다. |

> 502 (Kakao Directions 실패)는 에러 반환 대신 폴백 응답으로 대체.
