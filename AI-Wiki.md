# Devths AI/ML Engineering Wiki

### ~~**[Serving URL:](#)**~~ (개발 후 추가 예정)

**AI Repository:** [Link](https://github.com/100-hours-a-week/9-team-Devths-AI) <br>

<br />

## 📚 목차

### 프로젝트 개요
> - [1. 개발 일정](#1-개발-일정)
> - [2. 컨벤션 룰](#2-컨벤션-룰)

### AI 서비스 기능
> - [3. 서비스 시나리오](#3-서비스-시나리오)
> - [4. AI 기능 명세](#4-ai-기능-명세)

### 시스템 설계
> - [5. 아키텍처 설계](#5-아키텍처-설계)
> - [6. 모델 API 설계](#6-모델-api-설계)
> - [6.5 VectorDB 설계](#65-vectordb-설계)
> - [7. Sequence Diagram](#7-sequence-diagram)
> - [8. API 명세](#8-api-명세)
> - [9. 성능 최적화](#9-성능-최적화)
> - [10. 테스트 전략](#10-테스트-전략)
> - [11. 기술 의사결정 기록 (ADR)](#11-기술-의사결정-기록-adr)

### 운영 및 배포
> - [12. MLOps 및 배포 파이프라인](#12-mlops-및-배포-파이프라인)
> - [13. 트러블 슈팅](#13-트러블-슈팅)
> - [14. 사용 도구 및 라이브러리](#14-사용-도구-및-라이브러리)

---

## 1. 개발 일정

| 주차 | 기간 | 내용 | 비고 |
|:---:|:---|:---|:---|
| **1주차** | 25/12/22 → 25/12/28 | 서비스 기획, 기술 검토 | 기능정의서, 화면설계서 작성 |
| **2주차** | 25/12/29 → 26/1/4 | 서비스 기획, 기술 검토 | |
| **3주차** | 26/1/5 → 26/1/11 | 설계 | API 설계, 모델 평가 지표 설계, 서버 설계 |
| **4주차** | 26/1/12 → 26/1/18 | 설계 | |
| **5주차** | 26/1/19 → 26/1/25 | MVP 개발 | |
| **6주차** | 26/1/26 → 26/2/1 | MVP 개발 | |
| **7주차** | 26/2/2 → 26/2/8 | 1차 배포 및 출시 | 1/26 디스콰이엇 서비스 출시 |
| **8주차** | 26/2/9 → 26/2/15 | v2 업데이트 개발 | |
| **설 연휴** | 26/2/16 → 26/2/22 | 설 연휴 | |
| **9주차** | 26/2/23 → 26/3/1 | v2 업데이트 개발 | |
| **10주차** | 26/3/2 → 26/3/8 | 2차 업데이트 | 디스콰이엇 v2 업데이트 |
| **11주차** | 26/3/9 → 26/3/15 | v3 업데이트 개발 | |
| **12주차** | 26/3/16 → 26/3/22 | v3 업데이트 개발 | |
| **13주차** | 26/3/23 → 26/3/26 | 문서 총 정리 | 디스콰이엇 v3 업데이트 |

<br />

## 2. 컨벤션 룰
> **Why:** Python 기반의 AI 프로젝트 특성에 맞춰 코드 스타일을 통일하고 협업 효율을 높입니다.

### 2.1. 코드 스타일 (PEP 8 & Linter)
**네이밍 규칙**
| 항목 | 케이스 규칙 |
|-----|----------|
| 클래스명 | PascalCase |
| 함수 및 변수명 | snake_case |
| 상수 | UPPER_SNAKE_CASE |
| 모듈(파일)명 | snake_case |

**Formatter & Linter 설정**
| 도구 | 설정 값 | 설명 |
|-----|---|-----|
| Black | line-length=88 | 코드 포매터 |
| Ruff | default | 빠른 린터 |

### 2.2. 깃 브랜치 전략
**기본 브랜치**
| 브랜치 | 설명 |
|------|-----|
| main | 프로덕션 배포 브랜치 |
| dev | 개발 통합 브랜치 |

**작업 브랜치 네이밍 규칙**
| 브랜치 타입 | 네이밍 패턴 |
|----------|----------|
| 기능 추가 | feat/기능명 |
| 버그 수정 | fix/버그명 |
| 모델 실험 | exp/실험명 |

### 2.3. 커밋 메시지 컨벤션
**형식:** `type: 제목 (#이슈번호)`

| 타입 | 설명 |
| --- | --- |
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| model | 모델 관련 변경 |
| data | 데이터 처리 관련 |
| docs | 문서 수정 |
| refactor | 코드 리팩토링 |
| test | 테스트 코드 |
| chore | 기타 설정 변경 |

---

## 3. 서비스 시나리오
> **AI 기능의 사용자 흐름을 정의합니다.**

👉 **[서비스 시나리오 상세 보기](AI_Service_시나리오)**

### 주요 AI 기능 요약

| 기능 | 설명 | 사용 기술 |
|------|-----|----------|
| 이력서 분석 | 이력서 텍스트 분석 → 강점/약점/개선점 | LLM + RAG |
| 채용공고 매칭 | 이력서와 채용공고 매칭도 분석 | LLM + Embedding |
| 모의 면접 | AI 면접관이 질문 생성 및 답변 평가 | LLM + Langgraph |
| 캘린더 일정 추출 | 채용공고에서 전형 일정 자동 추출 | OCR/VLM + LLM |
| 캘린더 에이전트 | 자연어로 일정 CRUD | LLM + Function Calling |
| 게시판 마스킹 | 첨부파일 개인정보 자동 마스킹 | VLM |

<br />

## 4. AI 기능 명세
> **각 AI 기능의 상세 기술 스펙입니다.**

### 4.1. 사용 모델/API

| 용도 | 기술 | 비고 |
|------|-----|------|
| VLM (Vision-Language) | Gemini, OpenAI | 이미지+텍스트 동시 처리 |
| LLM (Text) | Gemini, OpenAI | 분석, 대화, 면접 |
| OCR | PaddleOCR → Tesseract (fallback) | 한국어 지원 |
| Embedding | Gemini Embedding | VectorDB 저장용 |
| VectorDB | ChromaDB / Pinecone | RAG 검색 |

### 4.2. 프롬프트 목록

| 시나리오 | Prompt 유형 | 우선순위 |
|---------|------------|----------|
| 개인정보 마스킹 | 좌표 추출 프롬프트 | 중 |
| 이력서 분석 | 분석 프롬프트 | 상 |
| 채용공고 분석 | 파싱 프롬프트 | 상 |
| 매칭도 분석 | 매칭 프롬프트 | 상 |
| 면접 질문 생성 | 질문 생성 프롬프트 | ⭐ 최상 |
| 답변 평가 | 평가 기준 프롬프트 | ⭐ 최상 |
| 종합 리포트 | 종합 분석 프롬프트 | 중 |
| 일정 추출 | 추출 프롬프트 | 하 |

### 4.3. 워크플로우 (Langgraph)

| 기능 | 워크플로우 | State 관리 |
|------|----------|-----------|
| 모의 면접 | generate_question → wait_answer → evaluate → next/report | questions, answers, scores |
| 캘린더 에이전트 | parse_intent → select_tool → execute → format_response | intent, tool, result |

---

## 5. 아키텍처 설계
> **Why:** 모델과 서비스(Backend) 간의 결합도를 낮추고(Decoupling), 표준화된 인터페이스를 통해 확장성을 확보합니다.

👉 **[상세 아키텍처 문서 보기](https://github.com/100-hours-a-week/9-team-Devths-WIKI/wiki/AI_%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%EC%84%A4%EA%B3%84)**

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                       Langchain                             │
│  - LLM 호출 래퍼 (Gemini, OpenAI)                             │
│  - Prompt Template 관리                                      │
│  - VectorDB 연동 (ChromaDB)                                  │
│  - RAG Chain                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                       Langgraph                             │
│  - 복잡한 워크플로우 관리 (상태 기반)                           │
│  - 에이전트 (Function Calling + 도구 실행)                    │
│  - 멀티 스텝 처리 (OCR → 분석 → 저장)                          │
└─────────────────────────────────────────────────────────────┘
```

### 서비스 모듈 구조
* **Boundary:** 추론 엔진과 전처리 로직 분리
* **Communication:** HTTP REST (FastAPI)
* **Benefit:** 장애 격리 및 배포 독립성 확보

<br />

## 6. 모델 API 설계 (4주차 조사 예정)
> **Why:** AI 서비스에서 사용하는 외부 모델/API를 정리하여 비용, 성능, 의존성을 관리합니다.

### 6.1. 사용 외부 모델/API

| 용도 | 제공사 | 모델명 | 비고 |
|------|-------|--------|------|
| **LLM (텍스트 생성)** | Google | Gemini 1.5 Flash | 대화, 분석, 면접 |
| **LLM (고품질)** | Google | Gemini 1.5 Pro | 복잡한 분석 (Fallback) |
| **VLM (이미지+텍스트)** | Google | Gemini 1.5 Flash | 이미지 분석, 마스킹 좌표 추출 |
| **Embedding** | Google | text-embedding-004 | VectorDB 저장용 |
| **OCR** | PaddlePaddle | PaddleOCR | 한국어 지원, 로컬 실행 |
| **OCR (Fallback)** | Google | Tesseract | PaddleOCR 실패 시 |

### 6.2. API 호출 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                       AI Server (FastAPI)                        │
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │  LangChain   │───▶│  Gemini API  │    │  PaddleOCR   │     │
│   │              │    │  (LLM/VLM)   │    │  (Local)     │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │  Embedding   │───▶│  ChromaDB    │    │    Redis     │     │
│   │  (Gemini)    │    │  (VectorDB)  │    │  (Context)   │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3. 모델별 용도 매핑

| AI Server API | 사용 모델/API |
|---------------|--------------|
| `/ai/ocr/extract` | PaddleOCR, Gemini VLM (Fallback) |
| `/ai/file/embed` | Gemini Embedding |
| `/ai/analyze` | Gemini Flash (RAG) |
| `/ai/interview/question` | Gemini Flash |
| `/ai/interview/save` | - (DB 저장만) |
| `/ai/interview/report` | Gemini Flash (RAG) |
| `/ai/chat` | Gemini Flash (RAG + Function Calling) |
| `/ai/calendar/parse` | Gemini Flash |
| `/ai/masking/draft` | Gemini VLM |

### 6.4. 임베딩 모델 비교

| 항목 | Gemini text-embedding-004 | OpenAI text-embedding-ada-002 |
|------|---------------------------|-------------------------------|
| **차원** | 768 | 1536 |
| **가격 (1M tokens)** | $0.00001 | $0.0001 |
| **한국어 성능** | 우수 | 우수 |
| **Rate Limit** | 1500 RPM | 3000 RPM |
| **지연 시간** | ~100ms | ~150ms |
| **최대 토큰** | 2048 | 8191 |

**✅ 선정: Gemini text-embedding-004**

| 선정 근거 |
|----------|
| 1. **비용 효율**: OpenAI 대비 10배 저렴 |
| 2. **LLM 일관성**: Gemini LLM과 같은 제공사 → 관리 용이 |
| 3. **한국어 성능**: 동등 수준 |
| 4. **차원**: 768차원으로 충분 (저장 공간 절약) |

### 6.5. 비용 및 Rate Limit 고려

| 모델 | 가격 (1M tokens) | Rate Limit | 비고 |
|------|-----------------|------------|------|
| Gemini 1.5 Flash | $0.075 (입력) / $0.30 (출력) | 1500 RPM | 메인 모델 |
| Gemini 1.5 Pro | $1.25 (입력) / $5.00 (출력) | 360 RPM | 고품질 분석 |
| text-embedding-004 | $0.00001 (1K 문자) | 1500 RPM | 임베딩 |

> 📌 **비용 최적화:** Flash 우선 사용, 복잡한 분석만 Pro 사용

### 6.5. VectorDB 설계

👉 **[VectorDB Collection 설계 상세 보기](https://github.com/100-hours-a-week/9-team-Devths-WIKI/wiki/AI_Vector-DB_%EC%84%A4%EA%B3%84)**

| Collection | 저장 데이터 | 활용 시점 |
|------------|------------|----------|
| `resumes` | 이력서 + 포트폴리오 | 분석, 면접 질문 생성, RAG |
| `job_postings` | 채용공고 | 분석, 면접 질문 생성 |
| `analysis_results` | 분석/매칭 결과 | "이전 피드백 뭐였지?" RAG |
| `interview_feedback` | 면접 Q&A + 평가 | 약점 기반 질문 생성 |
| `chat_context` | 중요 대화 컨텍스트 | 맥락 유지 대화 |

<br />

## 7. Sequence Diagram
> **Why:** Backend↔AI Server 간의 API 호출 흐름을 시각적으로 표현합니다.

👉 **[Sequence Diagram 상세 보기](AI_API_흐름도)**

### 주요 흐름도

| 시나리오 | 사용 AI API | 설명 |
|---------|------------|------|
| 이력서/포트폴리오 업로드 | 1 (또는 2) | OCR + 임베딩 (내부 처리) |
| 채용공고 업로드 | 1 (또는 2) | OCR + 임베딩 (내부 처리) |
| 분석 + 매칭도 | 3 | RAG + LLM 분석 |
| 모의면접 | 4, 5, 6 | 질문 생성 → Q&A 저장 → 평가 |
| 대화 + 에이전트 | 7 | RAG + Tool Calling |
| 캘린더 파싱 | 8 | 채용공고에서 일정 추출 |
| 게시판 마스킹 | 9 | 개인정보 자동 마스킹 |

<br />

## 8. API 명세
> **AI Server(FastAPI)에서 제공하는 API 상세 명세입니다.**

👉 **[AI Server API 명세서 상세 보기](AI_API_명세)**

### API 요약

| # | Endpoint | 설명 | 처리방식 |
|---|----------|------|----------|
| 1 | `/ai/ocr/extract` | OCR + 임베딩 (내부 처리) | 🔄 비동기 |
| 2 | `/ai/file/embed` | 텍스트 직접 입력 시 임베딩 | ⚡ 동기 |
| 3 | `/ai/analyze` | 분석 + 매칭도 | 📡 스트리밍 |
| 4 | `/ai/interview/question` | 면접 질문/꼬리질문 생성 | ⚡ 동기 |
| 5 | `/ai/interview/save` | 면접 Q&A 개별 저장 | ⚡ 동기 |
| 6 | `/ai/interview/report` | 면접 평가 및 피드백 | 📡 스트리밍 |
| 7 | `/ai/chat` | 대화 처리 (RAG + 에이전트) | 📡 스트리밍 |
| 8 | `/ai/calendar/parse` | 일정 정보 파싱 | ⚡ 동기 |
| 9 | `/ai/masking/draft` | 게시판 첨부파일 1차 마스킹 | 🔄 비동기 |

> 📌 **OCR 변경:** `/ai/ocr/extract`가 내부에서 임베딩까지 처리 (Backend 재호출 불필요)

<br />

## 9. 성능 최적화
> **Why:** 초기 모델의 높은 지연(Latency)과 자원 소모를 줄여, 사용자 경험(UX)을 개선하고 인프라 비용을 절감합니다.

👉 **[성능 최적화 보고서 보기](https://github.com/100-hours-a-week/9-team-Devths-WIKI/wiki/%EC%84%B1%EB%8A%A5-%EC%B5%9C%EC%A0%81%ED%99%94)**

| 구분 | 최적화 전 (Baseline) | 최적화 후 (Target) | 적용 기법 (Plan) |
|:---:|:---:|:---:|:---|
| **Latency** | - | - | Caching, Async |
| **Throughput** | - | - | Batch Processing |
| **Cost** | - | - | vLLM, Fallback |

<br />


---

## 10. 테스트 전략
> **Why:** AI 서버의 기능 정확성, 응답 형식, 성능을 검증하여 회귀를 방지하고 코드 품질을 보장합니다.

👉 **[테스트 전략 상세 보기](https://github.com/100-hours-a-week/9-team-Devths-WIKI/wiki/AI_%EC%84%9C%EB%B2%84_%ED%85%8C%EC%8A%A4%ED%8A%B8)**

### 테스트 스택 요약

| 도구 | 용도 | 비고 |
|------|------|------|
| **pytest** | 유닛/통합 테스트 | Python 테스트 표준 |
| **Ruff** | 린터 (코드 검사) | ESLint 대응 |
| **Black** | 포매터 (코드 스타일) | Prettier 대응 |
| **pytest-cov** | 커버리지 측정 | JaCoCo 대응 |
| **LLM Mock** | CI에서 실제 API 호출 방지 | 비용/속도 최적화 |

### 브랜치별 테스트 정책

| 브랜치 | Lint | Unit Test | Integration Test |
|--------|:----:|:---------:|:----------------:|
| **develop** | ✅ | ✅ | ❌ |
| **release** | ✅ | ✅ | ✅ |
| **main** | ✅ | ✅ | ✅ |

<br />

---

## 11. 기술 의사결정 기록 (ADR)
> **Architecture Decision Records - 프로젝트에서 기술 선택의 근거를 기록합니다.**

👉 **[ADR 001~005 보기](01.-AI_의사결정_ADR-(001~005))** | **[ADR 006~010 보기](02.-AI_의사결정_ADR-(006~010))**

### ADR 목록 (001~005)

| # | 제목 | 상태 | 결정 |
|---|------|------|------|
| ADR-001 | LLM 스트리밍 통신 방식 (SSE vs WebSocket) | ✅ 채택됨 | SSE 선택 |
| ADR-002 | 분석 결과 저장 형식 (JSON vs Text) | ✅ 채택됨 | JSON (하이브리드) |
| ADR-003 | VectorDB 선택 (ChromaDB vs Pinecone vs Qdrant) | ✅ 채택됨 | ChromaDB 선택 |
| ADR-004 | 비동기 처리 방식 (폴링 vs 콜백 vs WebSocket) | ✅ 채택됨 | 폴링(Polling) 선택 |
| ADR-005 | 면접 Q&A 개별 저장 방식 | ✅ 채택됨 | 매 문답 개별 저장 (DB) |

### ADR 목록 (006~010)

| # | 제목 | 상태 | 결정 |
|---|------|------|------|
| ADR-006 | 인프라 진화 전략 (EC2 → Docker → Kubernetes) | ✅ 채택됨 | 점진적 진화 |
| ADR-007 | Kubernetes vs Kubeflow 도입 시기 | ✅ 채택됨 | K8s: V3 / Kubeflow: V4 이후 |
| ADR-008 | OCR + 임베딩 내부 통합 처리 | ✅ 채택됨 | AI Server 내부에서 OCR→임베딩 통합 |
| ADR-009 | AI 채팅 컨텍스트 관리 (Redis) | ✅ 채택됨 | Redis + LangChain Memory |
| ADR-010 | (예정) | 🔄 검토중 | - |

---

## 12. MLOps 및 배포 파이프라인
> **Why:** 모델 학습부터 배포까지의 과정을 자동화하여, 실험의 재현성을 보장하고 배포 주기를 단축합니다.

👉 **[MLOps 상세 문서 보기](https://github.com/100-hours-a-week/9-team-Devths-WIKI/wiki/MLOPS-%EB%B0%B0%ED%8F%AC-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8)**

### 12.1. 인프라 아키텍처
* **Serving:** FastAPI + Uvicorn
* **Compute:** RunPod (GPU)
* **Registry:** Docker Hub

### 12.2. CI/CD 파이프라인
* **CI:** GitHub Actions (테스트, 린트)
* **CD:** Docker Build → Push → Deploy

<br />

## 13. 트러블 슈팅
~~- [1. 트러블 슈팅 제목](#)~~ (추가 예정)

<br />

## 14. 사용 도구 및 라이브러리

| 구분 | 도구명 | 선정 이유 (Justification) |
|:---:|:---|:---|
| **Framework** | FastAPI | 비동기 지원, 자동 문서화 |
| **LLM** | Langchain + Langgraph | 체인 구성, 워크플로우 관리 |
| **VectorDB** | ChromaDB | 로컬 실행, 간단한 설정 |
| **Cache** | Redis | 대화 컨텍스트, TTL 지원, LangChain 연동 |
| **Embedding** | Gemini text-embedding-004 | 비용 효율 (OpenAI 대비 10배 저렴) |
| **OCR** | PaddleOCR | 한국어 지원 |
| **Serving** | Uvicorn | 빠른 ASGI 서버 |
