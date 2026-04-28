# FCM 페이로드 / 딥링크 스킴

← [api-spec.md](./api-spec.md)

> FCM payload 의 `data` 필드는 Firebase 표준 키이며, REST 응답 wrapper(`{success, data}`)와 무관함.

---

## FCM 페이로드

### 공유 요청 알림

```json
{
  "notification": {
    "title": "{요청자명}",
    "body": "{요청자명}이 {노선명} 버스 위치를 요청했어요"
  },
  "data": {
    "type": "SHARE_REQUEST",
    "routeId": "2",
    "fromUserId": "10",
    "deepLink": "ssafyshuttle://share?routeId=2"
  }
}
```

### 앱 동작

| 상태 | 동작 |
|---|---|
| Foreground | 인앱 토스트 + "지금 공유" CTA |
| Background | 시스템 알림 → 탭 시 딥링크 파싱 → M6 홈 (routeId pre-select) → "지금 탑승" CTA 1-tap으로 위치 공유 시작 |

---

## 딥링크 스킴

| 스킴 | 도착 화면 | 동작 |
|---|---|---|
| `ssafyshuttle://share?routeId={id}` | **M6 홈** (routeId pre-select) | 홈이 해당 노선으로 자동 설정됨. "지금 탑승" CTA 누르면 즉시 해당 노선 위치 공유 시작 (1-tap 응답) |
