# QA Automation Tests

TimeBlocks QA 자동화 테스트 코드 및 화면 요소 레퍼런스 저장소.

## 디렉토리 구조

```
qa-test&info/
├── tests/                          # 실제 실행되는 회귀 테스트 (서버가 pull해서 실행)
│   ├── android/
│   ├── ios/
│   └── web/
└── info/                           # LLM 생성용 레퍼런스 데이터 (서버가 실행하지 않음)
    ├── maestro-hierarchy/
    │   ├── android/
    │   └── ios/
    └── playwright-snapshot/
```

## 각 폴더의 역할

### `tests/`
- **서버(qa-runner-server)가 실제로 실행하는 대상**
- Maestro YAML(android, ios), Playwright TS(web) 파일만 위치
- 새 파일 추가 시 반드시 사람 리뷰(PR) 거쳐서 merge

### `info/`
- LLM이 자연어 시나리오를 테스트 코드로 변환할 때 참고하는 화면 요소 레퍼런스
- **서버가 실행하지 않음** — 여기 있는 파일은 테스트 대상이 아님
- 화면 UI가 바뀌면 재캡처 필요 (staleness 주의)

## 명명 규칙

### `tests/` 파일명
`{screen}_{scenario}.{yaml|ts}`
예: `login_success.yaml`, `login_failure.yaml`, `calendar_month_navigation.yaml`

### `info/` 파일명
`{screen}_{state}.json`
예: `login.json`, `calendar_single_tap_option.json`, `calendar_drag_selection_option.json`

## 캡처 방법 (info/ 갱신)

### Android/iOS (Maestro)
```bash
# 에뮬레이터/시뮬레이터에서 원하는 화면으로 이동한 후
maestro hierarchy -> info/maestro-hierarchy/{platform}/{screen}_{state}.json
```

### Web (Playwright)
```ts
const snapshot = await page.locator('body').ariaSnapshot()
fs.writeFileSync('info/playwright-snapshot/{screen}.json', snapshot)
```

## 스냅샷 메타데이터

각 `info/` 파일은 아래 메타데이터를 포함해 최신성을 판단합니다:

```json
{
  "capturedAt": "2026-07-22T00:00:00Z",
  "appVersion": "x.y.z",
  "tree": { ... }
}
```

30일 이상 지난 스냅샷은 재확인 후 사용을 권장합니다.

## 관련 문서

- 캡처 담당/책임 구조: 별도 문서 참고
- LLM 기반 테스트 코드 생성 파이프라인: 별도 문서 참고
- Accessibility Identifier 요구사항 (개발팀 협업): 별도 문서 참고