# 🎮 JavaScript Tic Tac Toe Game

PowerShell로 실행 가능한 **JavaScript 기반** GUI 틱택토 게임입니다.

## 📋 프로젝트 구조

이 프로젝트는 **Clean Architecture**와 **SOLID 원칙**을 적용하여 JavaScript로 구현되었습니다.

```
TicTacToeGame/
├── src/
│   ├── domain/                 # 도메인 계층
│   │   ├── Position.js         # 위치 값 객체
│   │   ├── GameBoard.js        # 게임 보드 엔티티
│   │   └── Player.js          # 플레이어 및 게임 상태 열거형
│   ├── application/           # 애플리케이션 계층
│   │   └── GameEngine.js      # 게임 엔진 (비즈니스 로직)
│   └── infrastructure/        # 인프라 계층
│       ├── GameUI.js          # DOM 상호작용 UI 컨트롤러
│       └── styles.css         # 스타일시트
├── tests/                     # 테스트
│   ├── domain/                # 도메인 테스트
│   │   ├── Position.test.js
│   │   └── GameBoard.test.js
│   └── application/           # 애플리케이션 테스트
│       └── GameEngine.test.js
├── index.html                 # 메인 HTML 파일
├── package.json              # 프로젝트 설정
├── run.ps1                   # PowerShell 실행 스크립트
└── README.md                 # 이 파일
```

## 🎯 게임 규칙

- 3x3 격자에서 진행되는 2인용 게임
- 플레이어 X가 먼저 시작
- 가로, 세로, 대각선으로 3개를 연결하면 승리
- 모든 칸이 채워져도 승부가 나지 않으면 무승부

## 🚀 실행 방법

### 1. NPM 명령어 (권장)
```bash
# HTTP 서버 시작
npm run serve

# 테스트 실행
npm run test

# 브라우저에서 게임 열기
npm run open

# 개발 서버 (serve와 동일)
npm run dev
```

### 2. PowerShell 스크립트
```powershell
# 기본 실행 (브라우저에서 게임 열기)
.\run.ps1

# HTTP 서버로 실행 (권장)
.\run.ps1 -Serve

# 테스트 실행
.\run.ps1 -Test

# 도움말 보기
.\run.ps1 -Help
```

### 3. 직접 실행
```bash
# Node.js 서버 직접 실행
node server.cjs

# 테스트 직접 실행
node --test tests/**/*.test.js
```

## 🛠 기술 스택

- **JavaScript ES6+**: 메인 프로그래밍 언어
- **HTML5**: 마크업
- **CSS3**: 스타일링 (Flexbox, Grid, 애니메이션)
- **Node.js**: 테스트 실행 (선택사항)
- **ES Modules**: 모듈 시스템

## 🏗 아키텍처 원칙

### Clean Architecture
- **Domain Layer**: 비즈니스 규칙과 엔티티
  - `Position`: 좌표 값 객체
  - `GameBoard`: 게임 보드 엔티티  
  - `Player`, `GameState`: 열거형
- **Application Layer**: 사용 사례와 비즈니스 로직
  - `GameEngine`: 게임 규칙 및 상태 관리
- **Infrastructure Layer**: 외부 인터페이스
  - `GameUI`: DOM 조작 및 이벤트 처리
  - `styles.css`: UI 스타일링

### SOLID 원칙
- **Single Responsibility**: 각 클래스는 하나의 책임만 가짐
- **Open/Closed**: 확장에는 열려있고 수정에는 닫혀있음
- **Liskov Substitution**: 파생 클래스는 기본 클래스를 대체 가능
- **Interface Segregation**: 클라이언트는 사용하지 않는 인터페이스에 의존하지 않음
- **Dependency Inversion**: 고수준 모듈은 저수준 모듈에 의존하지 않음

### TDD (Test-Driven Development)
- 모든 비즈니스 로직은 테스트 우선 개발
- Node.js 내장 테스트 러너 사용
- Red-Green-Refactor 사이클 적용

## 🎮 게임 기능

- **반응형 GUI**: 다양한 화면 크기 지원
- **실시간 상태 표시**: 현재 플레이어와 게임 상태 표시
- **승리 감지**: 자동으로 승리 조건 확인
- **게임 재시작**: 언제든지 새 게임 시작 가능
- **시각적 피드백**: 
  - 플레이어별 색상 구분 (X=빨강, O=파랑)
  - 호버 효과 및 애니메이션
  - 승리 결과 모달
- **키보드 지원**: ESC 키로 모달 닫기
- **내장 테스트**: 브라우저에서 기본 테스트 자동 실행

## 📝 요구사항

### 최소 요구사항
- **모던 브라우저**: Chrome 61+, Firefox 60+, Safari 11+, Edge 16+
- **ES6 모듈 지원**: 대부분의 최신 브라우저

### 개발/테스트용 (선택사항)
- **Node.js 18+**: 단위 테스트 실행용
- **Python 3.x**: HTTP 서버 실행용 (대안)

## 🧪 테스트

### 브라우저 내장 테스트
게임을 실행하면 자동으로 기본 테스트가 실행되며 하단에 결과가 표시됩니다.

### Node.js 단위 테스트
```powershell
# 모든 테스트 실행
.\run.ps1 -Test

# 개별 테스트 실행
node --test tests/domain/Position.test.js
node --test tests/domain/GameBoard.test.js
node --test tests/application/GameEngine.test.js
```

## 🎨 주요 특징

### 모던 JavaScript
- ES6+ 클래스 및 모듈 사용
- Immutable 값 객체 (Position)
- 함수형 프로그래밍 요소

### 반응형 디자인
- CSS Grid 및 Flexbox 활용
- 모바일 친화적 인터페이스
- 부드러운 애니메이션 및 전환

### 접근성
- 시맨틱 HTML 구조
- 키보드 내비게이션 지원
- 명확한 시각적 피드백

## 🚀 시작하기

1. **프로젝트 클론 또는 다운로드**
2. **PowerShell에서 프로젝트 디렉토리로 이동**
3. **게임 실행**:
   ```powershell
   .\run.ps1
   ```
4. **브라우저에서 게임 즐기기! 🎮**

## 📚 개발 가이드

### 새로운 기능 추가
1. **도메인 로직**: `src/domain/`에 새 엔티티/값 객체 추가
2. **비즈니스 로직**: `src/application/`에 새 서비스 추가  
3. **UI 로직**: `src/infrastructure/`에 새 UI 컴포넌트 추가
4. **테스트 작성**: `tests/` 디렉토리에 해당 테스트 추가

### 코딩 스타일
- ES6+ 문법 사용
- 명확한 함수/변수 명명
- JSDoc 주석 활용
- 불변성 원칙 준수

## 🤝 기여하기

1. 이 저장소를 Fork
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🎯 학습 목표

이 프로젝트를 통해 다음을 학습할 수 있습니다:

- **Clean Architecture** 설계 패턴
- **TDD** 개발 방법론
- **SOLID** 원칙 적용
- **JavaScript ES6+** 모던 문법
- **모듈 시스템** 활용
- **DOM 조작** 및 이벤트 처리
- **CSS** 애니메이션 및 반응형 디자인

---

**즐거운 게임 되세요! 🎮✨**
