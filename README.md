# TeamCheckMate

English | [한국어](#한국어)

---

A mobile application for university group project collaboration. Assign tasks to teammates, track progress, and manage your team — all in one place.

## Features

- **Team Management** — Create or join teams via team code, add/remove members
- **Task Assignment** — Create assignments and assign them to specific teammates
- **Personal Todo** — Manage personal tasks with category organization
- **Schedule** — Weekly calendar view for tracking deadlines
- **Teammate Info** — View teammates' contact info (email, phone, student ID) in-app
- **Guidance** — Onboarding guide for new users

## Tech Stack

| Category | Stack |
|---|---|
| Framework | React Native (Expo ~49) |
| Navigation | React Navigation (Stack + Bottom Tabs) |
| Backend | Firebase Firestore, Firebase Auth |
| State | React Hooks |
| Font | SUIT |

## Project Structure

```
TeamCheckMate/
├── App.js                  # Entry point, auth state, navigation setup
├── firebase.js             # Firebase initialization and exports
├── assets/
│   └── fonts/              # SUIT font family
└── screens/
    ├── InitialPage.js
    ├── logins/
    │   ├── LogInPage.js
    │   ├── SignUpPage.js
    │   └── UserInfoInputPage.js
    └── components/
        ├── Team/
        │   ├── TeamPage.js
        │   ├── TeamAddPage.js
        │   ├── TeamJoinPage.js
        │   ├── TeamUpdatePage.js
        │   ├── TeamMemberAddPage.js
        │   └── TeamCheckPage.js
        ├── AssignmentPage.js
        ├── AssignmentAddPage.js
        ├── AssignmentUpdatePage.js
        ├── PersonalPage.js
        ├── SchedulePage.js
        ├── GuidancePage.js
        └── SettingPage.js
```

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Firebase project

### Installation

```bash
git clone https://github.com/jeondowon/TeamCheckMate.git
cd TeamCheckMate
npm install
```

### Firebase Setup

Create a Firebase project and replace the config in `firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Run

```bash
npx expo start
```

## Screens

| Screen | Description |
|---|---|
| 개인 (Personal) | Personal todo list with categories |
| 팀 (Team) | Team list, task assignment per team |
| 시간표 (Schedule) | Weekly calendar view |
| 길라잡이 (Guidance) | App usage guide |
| 설정 (Settings) | Account settings, app info |

# 한국어

[English](#teamcheckmate) | 한국어

---

대학교 팀 프로젝트 협업을 위한 모바일 애플리케이션입니다. 팀원에게 과제를 부여하고, 진행 상황을 추적하며, 팀을 한 곳에서 관리하세요.

## 주요 기능

- **팀 관리** — 팀 코드로 팀 생성 및 참여, 팀원 추가/삭제
- **과제 부여** — 과제를 생성하고 특정 팀원에게 할당
- **개인 할일** — 카테고리별 개인 투두리스트 관리
- **시간표** — 마감일 관리를 위한 주간 캘린더
- **팀원 정보** — 앱 내에서 팀원 연락처(이메일, 전화번호, 학번) 확인
- **길라잡이** — 신규 사용자를 위한 앱 사용 가이드

## 기술 스택

| 분류 | 스택 |
|---|---|
| 프레임워크 | React Native (Expo ~49) |
| 네비게이션 | React Navigation (Stack + Bottom Tabs) |
| 백엔드 | Firebase Firestore, Firebase Auth |
| 상태 관리 | React Hooks |
| 폰트 | SUIT |

## 프로젝트 구조

```
TeamCheckMate/
├── App.js                  # 진입점, 인증 상태, 네비게이션 설정
├── firebase.js             # Firebase 초기화 및 export
├── assets/
│   └── fonts/              # SUIT 폰트
└── screens/
    ├── InitialPage.js
    ├── logins/
    │   ├── LogInPage.js
    │   ├── SignUpPage.js
    │   └── UserInfoInputPage.js
    └── components/
        ├── Team/
        │   ├── TeamPage.js
        │   ├── TeamAddPage.js
        │   ├── TeamJoinPage.js
        │   ├── TeamUpdatePage.js
        │   ├── TeamMemberAddPage.js
        │   └── TeamCheckPage.js
        ├── AssignmentPage.js
        ├── AssignmentAddPage.js
        ├── AssignmentUpdatePage.js
        ├── PersonalPage.js
        ├── SchedulePage.js
        ├── GuidancePage.js
        └── SettingPage.js
```

## 시작하기

### 사전 준비

- Node.js
- Expo CLI
- Firebase 프로젝트

### 설치

```bash
git clone https://github.com/jeondowon/TeamCheckMate.git
cd TeamCheckMate
npm install
```

### Firebase 설정

Firebase 프로젝트를 생성한 후 `firebase.js`의 설정값을 교체하세요:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 실행

```bash
npx expo start
```

## 화면 구성

| 탭 | 설명 |
|---|---|
| 개인 | 카테고리별 개인 투두리스트 |
| 팀 | 팀 목록 및 팀별 과제 관리 |
| 시간표 | 주간 캘린더 뷰 |
| 길라잡이 | 앱 사용 가이드 |
| 설정 | 계정 설정, 앱 정보 |
