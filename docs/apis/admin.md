# 관리자 API — `/admin/*`

← [api-spec.md](./api-spec.md)

권한: `ADMIN` 또는 `SUPERADMIN`. 부족 시 `403 FORBIDDEN`.

---

## 노선 관리

### GET /admin/routes

```json
// Response
{
  "success": true,
  "data": [
    {
      "region": "광주",
      "routeNumber": 2,
      "versions": [
        { "routeId": 2, "version": 1, "isActive": false, "routeName": "..." },
        { "routeId": 15, "version": 2, "isActive": true, "routeName": "..." }
      ]
    }
  ]
}
```

### POST /admin/routes (신규 노선 생성)

생성 시 Kakao Directions 자동 호출 → `route_polyline` 시드.

```json
// Request
{
  "region": "광주",
  "routeNumber": 5,
  "routeName": "광주 5호차",
  "description": "...",
  "stops": [
    { "stopName": "...", "lat": 35.1, "lng": 126.8, "sequence": 1, "isTerminal": false }
  ]
}
// Response
{
  "success": true,
  "data": { "routeId": 20, "polylineId": 30, "vertexCount": 328 }
}
```

### POST /admin/routes/{routeId} (수정 = 새 버전)

stops 배열 전체 교체. 사실상 새 버전 클론 액션.

```json
// Request
{ "stops": [] }
// Response
{
  "success": true,
  "data": { "newRouteId": 25, "version": 3 }
}
```

### POST /admin/routes/{routeId}/activate (버전 활성화/롤백)

```json
// Response
{ "success": true, "data": null }
```

---

## 폴리라인 관리

### GET /admin/routes/{routeId}/polylines

```json
// Response
{
  "success": true,
  "data": [
    { "polylineId": 30, "isOriginal": true, "isActive": false, "createdBy": 1, "createdAt": "..." },
    { "polylineId": 45, "isOriginal": false, "isActive": true, "createdBy": 1, "createdAt": "..." }
  ]
}
```

### GET /admin/routes/{routeId}/polylines/{polylineId}

```json
// Response
{
  "success": true,
  "data": {
    "polylineId": 45,
    "coordinates": [ { "lat": "...", "lng": "..." } ],
    "isOriginal": false,
    "isActive": true
  }
}
```

### POST /admin/routes/{routeId}/polylines (편집본 저장)

규칙: 기존 active → false, 새 row INSERT.

```json
// Request
{ "coordinates": [ { "lat": "...", "lng": "..." } ] }
// Response
{
  "success": true,
  "data": { "polylineId": 50, "isActive": true }
}
```

### POST /admin/routes/{routeId}/polylines/{polylineId}/activate (롤백)

```json
// Response
{ "success": true, "data": null }
```

### POST /admin/routes/{routeId}/polylines/partial-regen (부분 자동 채우기)

저장 안 함. 관리자 클라이언트가 편집 중 polyline에 반영 후 `POST /admin/routes/{id}/polylines`로 저장.

```json
// Request
{
  "from": { "lat": 35.19, "lng": 126.81 },
  "to": { "lat": 35.20, "lng": 126.80 },
  "via": [ { "lat": 35.195, "lng": 126.805 } ]
}
// Response
{
  "success": true,
  "data": { "vertices": [ { "lat": "...", "lng": "..." } ] }
}
```

---

## 사용자 관리 (SUPERADMIN)

### GET /admin/users

```json
// Response
{
  "success": true,
  "data": [
    { "userId": 10, "email": "...", "name": "...", "role": "USER" }
  ]
}
```

### POST /admin/users/{userId}/role (역할 변경)

```json
// Request
{ "role": "ADMIN" }
// Response
{ "success": true, "data": null }
```
