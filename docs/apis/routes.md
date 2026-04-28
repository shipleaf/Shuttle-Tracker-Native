# 노선 API — `/routes/*`

← [api-spec.md](./api-spec.md)

---

## GET /routes

```
?region=광주  (optional)
```

```json
// Response
{
  "success": true,
  "data": [
    { "routeId": 2, "region": "광주", "routeNumber": 2, "routeName": "광주 2호차", "description": "..." }
  ]
}
```

---

## GET /routes/{routeId}

```json
// Response
{
  "success": true,
  "data": {
    "route": { "routeId": 2, "region": "광주", "routeNumber": 2, "routeName": "..." },
    "stops": [
      { "stopId": 10, "stopName": "효덕초 후문 앞", "lat": 35.112757, "lng": 126.897022, "sequence": 1, "isTerminal": false }
    ],
    "polyline": [ { "lat": 35.11, "lng": 126.89 } ]
  }
}
```

---

## GET /routes/{routeId}/stops

```
?fromSequence=3  (optional)
```

```json
// Response
{
  "success": true,
  "data": [
    { "stopId": 10, "stopName": "...", "lat": "...", "lng": "...", "sequence": 1, "isTerminal": false }
  ]
}
```

---

## GET /routes/{routeId}/polyline

```json
// Response
{
  "success": true,
  "data": { "coordinates": [ { "lat": "...", "lng": "..." } ] }
}
```

---

## GET /routes/{routeId}/timetable (Phase 1)

```json
// Response
{
  "success": true,
  "data": {
    "departures": [ "07:30", "08:00", "08:30" ],
    "operatingHours": { "start": "07:00", "end": "22:00" }
  }
}
```

---

## GET /routes/search (Phase 1)

```
?keyword=광주
```

```json
// Response
{
  "success": true,
  "data": { "routes": [], "stops": [] }
}
```

---

## 에러 코드

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `NOT_FOUND_SHUTTLE_ROUTE` | 404 | 존재하지 않는 노선입니다. |
| `NOT_FOUND_SHUTTLE_STOP` | 404 | 존재하지 않는 정류장입니다. |
