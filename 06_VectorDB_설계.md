# VectorDB Collection 설계

> ChromaDB 기반 VectorDB 스키마 설계

---

## 📚 목차

- [1. 개요](#1-개요)
- [2. Collection 구조](#2-collection-구조)
- [3. Collection 상세 스키마](#3-collection-상세-스키마)
- [4. 임베딩 모델](#4-임베딩-모델)
- [5. 활용 시나리오별 쿼리](#5-활용-시나리오별-쿼리)
- [6. 데이터 생명주기](#6-데이터-생명주기)

---

## 1. 개요

### 1.1. VectorDB vs RDB 역할 분담

| 저장소 | 저장 데이터 | 용도 |
|--------|------------|------|
| **RDB (PostgreSQL)** | 사용자 정보, 채팅방, 면접 세션, Q&A 원본 | CRUD, 트랜잭션 |
| **VectorDB (ChromaDB)** | 텍스트 임베딩, 메타데이터 | 유사도 검색 (RAG) |

### 1.2. 사용 기술

| 항목 | 선택 |
|------|------|
| **VectorDB** | ChromaDB |
| **Embedding Model** | Gemini text-embedding-004 |
| **Embedding Dimension** | 768 |
| **Distance Metric** | Cosine Similarity |

---

## 2. Collection 구조

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VectorDB Collection 구조                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  resumes                                                            │   │
│   │  └── 이력서 + 포트폴리오 임베딩 (같은 컬렉션)                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  job_postings                                                       │   │
│   │  └── 채용공고 임베딩                                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  analysis_results                                                   │   │
│   │  └── 분석 결과 (이력서 분석, 매칭도 분석) 임베딩                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  interview_feedback                                                 │   │
│   │  └── 면접 Q&A + 피드백 임베딩                                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  chat_context                                                       │   │
│   │  └── 중요 대화 컨텍스트 임베딩                                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Collection 요약

| # | Collection | 저장 데이터 | 활용 시점 |
|---|------------|------------|----------|
| 1 | `resumes` | 이력서 + 포트폴리오 | 분석, 면접 질문 생성, 일반 대화 RAG |
| 2 | `job_postings` | 채용공고 | 분석, 면접 질문 생성, 일정 추론 |
| 3 | `analysis_results` | 분석 결과, 매칭도 결과 | "이전 피드백 뭐였지?" RAG |
| 4 | `interview_feedback` | 면접 Q&A + 평가 | 다음 면접 시 약점 기반 질문 생성 |
| 5 | `chat_context` | 중요 대화 | 맥락 유지한 대화 |

---

## 3. Collection 상세 스키마

### 3.1. `resumes` (이력서 + 포트폴리오)

> 이력서와 포트폴리오는 함께 RAG 검색 대상이 되므로 같은 컬렉션에 저장

```python
# ChromaDB Collection 생성
collection = client.create_collection(
    name="resumes",
    metadata={"hnsw:space": "cosine"}
)

# 문서 추가 예시
collection.add(
    ids=["resume_123_chunk_0", "resume_123_chunk_1", ...],
    embeddings=[[0.1, 0.2, ...], [0.3, 0.4, ...], ...],  # 768차원
    documents=["이력서 텍스트 청크 1...", "이력서 텍스트 청크 2...", ...],
    metadatas=[
        {
            "user_id": "user_456",
            "document_id": "resume_123",
            "document_type": "resume",      # "resume" | "portfolio"
            "file_name": "홍길동_이력서.pdf",
            "chunk_index": 0,
            "total_chunks": 5,
            "created_at": "2026-01-08T10:00:00Z",
            "updated_at": "2026-01-08T10:00:00Z"
        },
        ...
    ]
)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | `{document_id}_chunk_{index}` |
| `embedding` | vector[768] | Gemini Embedding 벡터 |
| `document` | string | 청크 텍스트 원본 |
| **metadata** | | |
| `user_id` | string | 사용자 ID |
| `document_id` | string | 이력서/포트폴리오 ID (RDB FK) |
| `document_type` | string | `"resume"` 또는 `"portfolio"` |
| `file_name` | string | 원본 파일명 |
| `chunk_index` | int | 청크 인덱스 (0부터 시작) |
| `total_chunks` | int | 전체 청크 수 |
| `created_at` | datetime | 생성 시간 |
| `updated_at` | datetime | 수정 시간 |

---

### 3.2. `job_postings` (채용공고)

```python
collection = client.create_collection(
    name="job_postings",
    metadata={"hnsw:space": "cosine"}
)

collection.add(
    ids=["posting_789_chunk_0", "posting_789_chunk_1", ...],
    embeddings=[[0.1, 0.2, ...], ...],
    documents=["채용공고 텍스트 청크 1...", ...],
    metadatas=[
        {
            "user_id": "user_456",
            "posting_id": "posting_789",
            "company_name": "카카오",
            "position": "백엔드 개발자",
            "job_type": "신입",              # "신입" | "경력" | "인턴"
            "deadline": "2026-01-15",
            "chunk_index": 0,
            "total_chunks": 3,
            "created_at": "2026-01-08T10:00:00Z"
        },
        ...
    ]
)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | `{posting_id}_chunk_{index}` |
| `embedding` | vector[768] | 임베딩 벡터 |
| `document` | string | 청크 텍스트 원본 |
| **metadata** | | |
| `user_id` | string | 사용자 ID |
| `posting_id` | string | 채용공고 ID (RDB FK) |
| `company_name` | string | 회사명 |
| `position` | string | 직무 |
| `job_type` | string | 신입/경력/인턴 |
| `deadline` | date | 서류 마감일 |
| `chunk_index` | int | 청크 인덱스 |
| `total_chunks` | int | 전체 청크 수 |
| `created_at` | datetime | 생성 시간 |

---

### 3.3. `analysis_results` (분석 결과)

> `/ai/analyze` API 호출 결과 저장 → "이전에 받은 피드백 뭐였지?" 질문에 RAG 활용

```python
collection = client.create_collection(
    name="analysis_results",
    metadata={"hnsw:space": "cosine"}
)

collection.add(
    ids=["analysis_001"],
    embeddings=[[0.1, 0.2, ...]],
    documents=[
        """
        이력서 분석 결과:
        - 강점: 3년 프론트엔드 경험, React/TypeScript 숙련
        - 약점: 클라우드 경험 부족
        - 제안: AWS 자격증 취득 권장
        
        매칭도: 85점 (A등급)
        - 보유 스킬: React, TypeScript
        - 부족 스킬: GraphQL, Next.js
        """
    ],
    metadatas=[
        {
            "user_id": "user_456",
            "room_id": "room_001",
            "resume_id": "resume_123",
            "posting_id": "posting_789",
            "analysis_type": "full",      # "resume_only" | "matching_only" | "full"
            "score": 85,
            "grade": "A",
            "created_at": "2026-01-08T10:00:00Z"
        }
    ]
)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 분석 결과 ID |
| `embedding` | vector[768] | 분석 결과 요약 임베딩 |
| `document` | string | 분석 결과 전체 텍스트 |
| **metadata** | | |
| `user_id` | string | 사용자 ID |
| `room_id` | string | 채팅방 ID |
| `resume_id` | string | 분석 대상 이력서 ID |
| `posting_id` | string | 분석 대상 채용공고 ID |
| `analysis_type` | string | 분석 유형 |
| `score` | int | 매칭 점수 (0-100) |
| `grade` | string | 등급 (S/A/B/C/D) |
| `created_at` | datetime | 생성 시간 |

---

### 3.4. `interview_feedback` (면접 Q&A + 피드백)

> 면접 종료 시 전체 Q&A + 평가 결과 저장 → 다음 면접 약점 기반 질문 생성

```python
collection = client.create_collection(
    name="interview_feedback",
    metadata={"hnsw:space": "cosine"}
)

# 세션 전체 요약 저장
collection.add(
    ids=["interview_session_abc123"],
    embeddings=[[0.1, 0.2, ...]],
    documents=[
        """
        면접 유형: 기술 면접
        총점: 78점 (B+)
        
        Q1: React Virtual DOM이란?
        A1: 실제 DOM과 비교해서...
        평가: 80점 - 개념 이해 우수, Reconciliation 설명 추가 필요
        
        Q2: diffing 알고리즘 동작 방식?
        A2: 이전 트리와 새 트리를...
        평가: 75점 - 기본 원리 이해, 시간 복잡도 설명 부족
        
        강점 패턴: 기술 개념 이해도 높음
        약점 패턴: 심화 개념 설명 부족, 답변 길이 짧음
        학습 가이드: React Fiber, Concurrent Mode 학습
        """
    ],
    metadatas=[
        {
            "user_id": "user_456",
            "room_id": "room_001",
            "session_id": "session_abc123",
            "interview_type": "technical",   # "technical" | "personality"
            "total_score": 78,
            "grade": "B+",
            "question_count": 5,
            "ended_by": "auto",              # "auto" | "manual"
            "weakness_keywords": ["심화 개념", "답변 구조화"],
            "created_at": "2026-01-08T10:00:00Z"
        }
    ]
)

# 개별 Q&A도 저장 (선택적 - 상세 검색용)
collection.add(
    ids=["qa_001", "qa_002", ...],
    embeddings=[[...], [...]],
    documents=[
        "Q: React Virtual DOM이란? A: 실제 DOM과 비교해서... 평가: 80점",
        "Q: diffing 알고리즘? A: 이전 트리와... 평가: 75점",
        ...
    ],
    metadatas=[
        {
            "user_id": "user_456",
            "session_id": "session_abc123",
            "question_id": "q_001",
            "interview_type": "technical",
            "is_followup": False,
            "score": 80,
            "created_at": "2026-01-08T10:00:00Z"
        },
        ...
    ]
)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 세션 ID 또는 QA ID |
| `embedding` | vector[768] | Q&A/피드백 임베딩 |
| `document` | string | Q&A + 평가 텍스트 |
| **metadata (세션)** | | |
| `user_id` | string | 사용자 ID |
| `room_id` | string | 채팅방 ID |
| `session_id` | string | 면접 세션 ID (RDB FK) |
| `interview_type` | string | `"technical"` 또는 `"personality"` |
| `total_score` | int | 총점 (0-100) |
| `grade` | string | 등급 |
| `question_count` | int | 질문 수 |
| `ended_by` | string | 종료 방식 |
| `weakness_keywords` | list[string] | 약점 키워드 (다음 질문 생성에 활용) |
| `created_at` | datetime | 생성 시간 |

---

### 3.5. `chat_context` (중요 대화 컨텍스트)

> 일반 대화 중 중요한 컨텍스트만 선별 저장 → 맥락 유지한 대화

```python
collection = client.create_collection(
    name="chat_context",
    metadata={"hnsw:space": "cosine"}
)

collection.add(
    ids=["context_001"],
    embeddings=[[0.1, 0.2, ...]],
    documents=[
        "사용자가 카카오 백엔드 포지션에 관심 있음. "
        "React 3년 경력 보유, 클라우드 경험 부족. "
        "AWS 자격증 취득 예정."
    ],
    metadatas=[
        {
            "user_id": "user_456",
            "room_id": "room_001",
            "context_type": "preference",    # "preference" | "advice" | "goal"
            "importance": "high",            # "high" | "medium" | "low"
            "created_at": "2026-01-08T10:00:00Z",
            "expires_at": "2026-04-08T10:00:00Z"  # 3개월 후 만료
        }
    ]
)
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | 컨텍스트 ID |
| `embedding` | vector[768] | 컨텍스트 임베딩 |
| `document` | string | 컨텍스트 요약 텍스트 |
| **metadata** | | |
| `user_id` | string | 사용자 ID |
| `room_id` | string | 채팅방 ID |
| `context_type` | string | 컨텍스트 유형 |
| `importance` | string | 중요도 |
| `created_at` | datetime | 생성 시간 |
| `expires_at` | datetime | 만료 시간 |

---

## 4. 임베딩 모델

### 4.1. 선택: Gemini text-embedding-004

| 항목 | 값 |
|------|-----|
| **모델명** | `text-embedding-004` |
| **Provider** | Google AI |
| **차원** | 768 |
| **최대 토큰** | 2,048 |
| **비용** | $0.00001 / 1K 문자 |
| **Rate Limit** | 1,500 RPM |

### 4.2. 청킹 전략

| 문서 유형 | 청크 크기 | 오버랩 | 이유 |
|----------|----------|--------|------|
| **이력서** | 512 tokens | 50 tokens | 경력/프로젝트 단위 분리 |
| **채용공고** | 512 tokens | 50 tokens | 요구사항 단위 분리 |
| **분석 결과** | 전체 저장 | - | 보통 짧음 |
| **면접 Q&A** | Q&A 쌍 단위 | - | 맥락 유지 |
| **대화 컨텍스트** | 요약 저장 | - | LLM이 요약 생성 |

### 4.3. 임베딩 파이프라인

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# 텍스트 분할기
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", ".", " "]
)

# 임베딩 모델
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=GEMINI_API_KEY
)

# 파이프라인
def embed_document(text: str, document_id: str, metadata: dict):
    # 1. 청킹
    chunks = text_splitter.split_text(text)
    
    # 2. 임베딩
    vectors = embeddings.embed_documents(chunks)
    
    # 3. ChromaDB 저장
    collection.add(
        ids=[f"{document_id}_chunk_{i}" for i in range(len(chunks))],
        embeddings=vectors,
        documents=chunks,
        metadatas=[{**metadata, "chunk_index": i, "total_chunks": len(chunks)} 
                   for i in range(len(chunks))]
    )
```

---

## 5. 활용 시나리오별 쿼리

### 5.1. 이력서 분석 시 RAG

```python
# 시나리오: /ai/analyze 호출 시
# 목적: 유사 이력서의 이전 분석 결과 참조

# 1. 현재 이력서 임베딩
query_vector = embeddings.embed_query(resume_text)

# 2. 유사 분석 결과 검색
results = analysis_collection.query(
    query_embeddings=[query_vector],
    n_results=3,
    where={"user_id": user_id}
)

# 3. LLM 프롬프트에 참조로 제공
prompt = f"""
현재 이력서: {resume_text}

참고할 이전 분석 결과:
{results['documents']}

위 내용을 참고하여 이력서를 분석해주세요.
"""
```

### 5.2. 면접 질문 생성 시 RAG

```python
# 시나리오: /ai/interview/question 호출 시
# 목적: 이전 면접 약점 기반 질문 생성

# 1. 이력서 검색 (질문 관련 컨텍스트)
resume_results = resume_collection.query(
    query_embeddings=[query_vector],
    n_results=3,
    where={"user_id": user_id}
)

# 2. 이전 면접 피드백 검색 (약점 패턴)
feedback_results = interview_collection.query(
    query_embeddings=[query_vector],
    n_results=2,
    where={
        "user_id": user_id,
        "interview_type": interview_type
    }
)

# 3. LLM 프롬프트
prompt = f"""
이력서 관련 내용: {resume_results['documents']}

이전 면접에서의 약점:
{feedback_results['documents']}

위 약점을 보완할 수 있는 {interview_type} 면접 질문을 생성해주세요.
"""
```

### 5.3. 일반 대화 RAG

```python
# 시나리오: /ai/chat 호출 시
# 목적: 맥락 유지한 대화

# 1. 사용자 메시지 임베딩
query_vector = embeddings.embed_query(user_message)

# 2. 관련 컨텍스트 검색
context_results = chat_context_collection.query(
    query_embeddings=[query_vector],
    n_results=3,
    where={
        "user_id": user_id,
        "room_id": room_id
    }
)

# 3. 이력서/채용공고도 검색 (필요시)
resume_results = resume_collection.query(
    query_embeddings=[query_vector],
    n_results=2,
    where={"user_id": user_id}
)

# 4. LLM 프롬프트
prompt = f"""
대화 컨텍스트: {context_results['documents']}
관련 이력서 정보: {resume_results['documents']}

사용자: {user_message}

위 컨텍스트를 참고하여 답변해주세요.
"""
```

---

## 6. 데이터 생명주기

### 6.1. 저장 시점

| Collection | 저장 시점 | API |
|------------|----------|-----|
| `resumes` | 파일 업로드 후 임베딩 | `/ai/file/embed` |
| `job_postings` | 파일 업로드 후 임베딩 | `/ai/file/embed` |
| `analysis_results` | 분석 완료 후 | `/ai/analyze` 내부 |
| `interview_feedback` | 면접 종료 후 리포트 생성 시 | `/ai/interview/report` 내부 |
| `chat_context` | 중요 대화 감지 시 (LLM 판단) | `/ai/chat` 내부 |

### 6.2. 삭제/업데이트 정책

| Collection | 삭제 조건 | 업데이트 조건 |
|------------|----------|--------------|
| `resumes` | 파일 삭제 시 | 파일 재업로드 시 (기존 삭제 후 재저장) |
| `job_postings` | 파일 삭제 시 | 파일 재업로드 시 |
| `analysis_results` | 채팅방 삭제 시 | 재분석 시 새로 추가 (이력 유지) |
| `interview_feedback` | 채팅방 삭제 시 | 불변 (이력 유지) |
| `chat_context` | 만료 시간 도래 시 | 중요도 변경 시 |

### 6.3. 만료 정책

```python
# 정기 정리 작업 (Airflow DAG 또는 Cron)
def cleanup_expired_contexts():
    now = datetime.utcnow().isoformat()
    
    # 만료된 컨텍스트 조회
    expired = chat_context_collection.get(
        where={"expires_at": {"$lt": now}}
    )
    
    # 삭제
    if expired['ids']:
        chat_context_collection.delete(ids=expired['ids'])
```

---

## 참고 자료

- [ChromaDB 공식 문서](https://docs.trychroma.com/)
- [Gemini Embedding API](https://ai.google.dev/tutorials/embeddings_quickstart)
- [LangChain VectorStores](https://python.langchain.com/docs/modules/data_connection/vectorstores/)
- [03_서비스_시나리오.md](03_서비스_시나리오.md)
- [08_API_명세.md](08_API_명세.md)
