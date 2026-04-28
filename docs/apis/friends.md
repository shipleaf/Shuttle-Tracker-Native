# 친구 API — `/friends/*`

← [api-spec.md](./api-spec.md)

---

## POST /friends/requests

```json
// Request
{ "targetStudentNumber": "1234567" }
// Response
{
  "success": true,
  "data": { "friendshipId": 42, "status": "PENDING" }
}
```

에러: `CANNOT_FRIEND_SELF`, `USER_NOT_FOUND`, `FRIENDSHIP_EXISTS`

---

## GET /friends/requests/received

```json
// Response
{
  "success": true,
  "data": [
    {
      "friendshipId": 42,
      "user": { "userId": 11, "name": "김철수", "studentNumber": "..." },
      "createdAt": "..."
    }
  ]
}
```

---

## GET /friends/requests/sent

구조 동일 (data가 동일 형태의 배열).

---

## POST /friends/requests/{friendshipId}/accept

```json
// Response
{ "success": true, "data": null }
```

---

## POST /friends/requests/{friendshipId}/reject

```json
// Response
{ "success": true, "data": null }
```

---

## GET /friends

```json
// Response
{
  "success": true,
  "data": [
    {
      "userId": 11,
      "name": "김철수",
      "studentNumber": "1234567",
      "isSharingLocation": true,
      "currentRouteId": 2
    }
  ]
}
```

---

## DELETE /friends/{userId}

양방향 해제.

```json
// Response
{ "success": true, "data": null }
```

---

## GET /friends/search

이름 또는 학번 부분 일치. M13 친구 추가 화면에서 후보 조회 → 사용자가 선택한 학번으로 `POST /friends/requests` 호출.

```
?keyword=김철수
?keyword=1234
```

```json
// Response
{
  "success": true,
  "data": [
    { "userId": 11, "name": "...", "studentNumber": "...", "friendshipStatus": "NONE|PENDING|ACCEPTED" }
  ]
}
```

---

## 에러 코드

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `CANNOT_FRIEND_SELF` | 400 | 자기 자신에게는 친구 요청을 보낼 수 없습니다. |
| `USER_NOT_FOUND` | 404 | 해당 학번의 사용자를 찾을 수 없습니다. |
| `FRIENDSHIP_EXISTS` | 409 | 이미 친구이거나 요청을 보낸 사용자입니다. |
