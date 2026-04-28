# 앱 정보 API — `/app/*`

← [api-spec.md](./api-spec.md)

---

## GET /app/version

**무인증**.

```json
// Response
{
  "success": true,
  "data": { "currentVersion": "1.2.0", "minSupported": "1.0.0", "downloadUrl": "..." }
}
```
