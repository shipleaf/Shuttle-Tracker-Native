# 에러 코드 카탈로그

← [api-spec.md](./api-spec.md)

> BE가 응답 JSON의 `error.message` 필드에 한국어 메시지를 내려준다. FE는 토스트·다이얼로그에 그대로 노출하거나, 필요 시 `error.code`로 분기.

---

## 공통

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `INVALID_ARGUMENT` | 400 | 입력값이 올바르지 않습니다. |
| `UNAUTHORIZED` | 401 | 로그인이 필요합니다. |
| `INVALID_REFRESH_TOKEN` | 401 | 세션이 만료되었습니다. 다시 로그인해주세요. |
| `FORBIDDEN` | 403 | 권한이 없습니다. |
| `NOT_FOUND` | 404 | 요청한 정보를 찾을 수 없습니다. |
| `EXTERNAL_SERVER_ERROR` | 502 | 외부 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요. |
| `INTERNAL_SERVER_ERROR` | 500 | 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요. |

---

## 인증

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `DUPLICATE_EMAIL` | 409 | 이미 사용 중인 이메일입니다. |
| `DUPLICATE_STUDENT_NUMBER` | 409 | 이미 사용 중인 학번입니다. |
| `INVALID_CREDENTIALS` | 401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| `INVALID_MATTERMOST_CODE` | 400 | 인증 코드가 올바르지 않거나 만료되었습니다. |
| `MATTERMOST_WEBHOOK_FAILED` | 502 | 인증 코드 발송에 실패했습니다. Mattermost 웹훅 URL을 확인해주세요. |
| `MATTERMOST_NOT_VERIFIED` | 400 | Mattermost 인증을 먼저 완료해주세요. |
| `ADMIN_CANNOT_WITHDRAW` | 403 | 관리자 계정은 탈퇴할 수 없습니다. |

---

## 친구

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `CANNOT_FRIEND_SELF` | 400 | 자기 자신에게는 친구 요청을 보낼 수 없습니다. |
| `USER_NOT_FOUND` | 404 | 해당 학번의 사용자를 찾을 수 없습니다. |
| `FRIENDSHIP_EXISTS` | 409 | 이미 친구이거나 요청을 보낸 사용자입니다. |

---

## 위치 공유

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `LOCATION_SHARE_NOT_AGREED` | 403 | 위치 공유 동의가 필요합니다. 설정에서 동의를 켜주세요. |
| `NO_ACTIVE_SHARE` | 409 | 활성화된 공유 세션이 없습니다. |

---

## 노선 / ETA

| 코드 | HTTP | 한국어 메시지 |
|---|---|---|
| `NOT_FOUND_SHUTTLE_ROUTE` | 404 | 존재하지 않는 노선입니다. |
| `NOT_FOUND_SHUTTLE_STOP` | 404 | 존재하지 않는 정류장입니다. |
| `NOT_FOUND_BUS_LOCATION` | 404 | 현재 운행 중인 셔틀이 없습니다. |

---

## WebSocket

| 코드 | 한국어 메시지 |
|---|---|
| `INVALID_JWT_TOKEN` | 인증 토큰이 올바르지 않습니다. 다시 연결해주세요. |

---

## FE 표준 처리 정책

| 상황 | 권장 처리 |
|---|---|
| `UNAUTHORIZED` | refreshToken 재시도 → 실패 시 M2 로그인 화면으로 이동 |
| `INVALID_REFRESH_TOKEN` | refresh 폐기 + M2 로그인 화면으로 이동 (자동 재시도 X) |
| `FORBIDDEN` | 토스트 노출 후 이전 화면으로 |
| `NOT_FOUND_*` | 인라인 안내 (전체 화면 차단 X) |
| `EXTERNAL_SERVER_ERROR` | "잠시 후 재시도" 토스트 + 재시도 버튼 |
| `INTERNAL_SERVER_ERROR` | "잠시 후 재시도" 토스트 + 문의 안내 |
| 네트워크 오류 (axios 등) | 코드 없이 "네트워크 연결을 확인해주세요" 토스트 |
