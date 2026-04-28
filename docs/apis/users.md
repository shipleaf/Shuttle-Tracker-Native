# 사용자 API — `/users/*`

← [api-spec.md](./api-spec.md)

---

## GET /users/me

```json
// Response
{
  "success": true,
  "data": {
    "userId": 10,
    "email": "...",
    "name": "...",
    "studentNumber": "...",
    "region": "광주",
    "role": "USER",
    "locationShareAgree": false,
    "defaultRouteId": 2
  }
}
```

---

## PATCH /users/me

부분 수정. 현재는 이름만.

```json
// Request
{ "name": "새이름" }
// Response
{ "success": true, "data": null }
```

에러: `INVALID_ARGUMENT`

---

## DELETE /users/me

```json
// Request
{ "password": "..." }
// Response
{ "success": true, "data": null }
```

에러: `INVALID_CREDENTIALS`, `ADMIN_CANNOT_WITHDRAW`

---

## POST /users/me/location-share-agree

단일 boolean 토글. (이전 PATCH → POST 액션성으로 정리)

```json
// Request
{ "agree": true }
// Response
{ "success": true, "data": null }
```

---

## POST /users/me/region

단일 필드 세팅. (PATCH → POST)

```json
// Request
{ "region": "광주" }
// Response
{ "success": true, "data": null }
```

---

## PUT /users/me/default-route

`routeId: null` 로 해제 가능. region 불일치 허용 (광주 사용자가 대전 노선 default 설정 가능).

```json
// Request
{ "routeId": 2 }
// 해제
{ "routeId": null }
// Response
{ "success": true, "data": null }
```
