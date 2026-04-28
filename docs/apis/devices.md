# 기기 API — `/devices/*`

← [api-spec.md](./api-spec.md)

---

## POST /devices/register

```json
// Request
{ "fcmToken": "...", "platform": "ANDROID" }
// Response
{ "success": true, "data": null }
```

---

## DELETE /devices

**Headers**: `Authorization: Bearer {accessToken}` (인증 필요).

본 사용자의 device_token 삭제.

```json
// Response
{ "success": true, "data": null }
```
