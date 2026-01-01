'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

// 게시글 타입 정의
interface Post {
  id: number
  author: {
    name: string
    avatar?: string
    interests: string[]
  }
  title: string
  content: string
  tags: string[]
  chips: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
}

export default function FeedSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 예시 게시글 데이터 (실제로는 API에서 가져옴)
  const allPosts: Post[] = [
    {
      id: 1,
      author: { name: '김개발', interests: ['프론트엔드'] },
      title: '카카오 프론트엔드 1차 코테 후기',
      content: '오늘 카카오 공채 1차 코딩테스트 봤습니다. 3문제 출제됐고 난이도는...',
      tags: ['프론트엔드'],
      chips: ['코딩테스트'],
      likes: 124,
      comments: 23,
      shares: 8,
      createdAt: '2시간 전'
    },
    {
      id: 2,
      author: { name: 'david', avatar: 'dark', interests: ['프론트엔드', '백엔드'] },
      title: 'NHN 백엔드 최종 면접 질문 정리',
      content: '최종 합격했습니다! 면접 질문 공유합니다. 1. 프로젝트에서 가장 어려웠던...',
      tags: ['프론트엔드', '백엔드'],
      chips: ['면접', '코딩테스트'],
      likes: 256,
      comments: 45,
      shares: 32,
      createdAt: '5시간 전'
    },
    {
      id: 3,
      author: { name: '박개발', interests: ['AI'] },
      title: '신입 개발자 이력서 첨삭 받고 싶어요',
      content: '이력서 작성했는데 피드백 부탁드립니다. 프로젝트 3개 진행했고...',
      tags: ['AI'],
      chips: ['이력서', '면접', '코딩테스트'],
      likes: 89,
      comments: 15,
      shares: 12,
      createdAt: '9시간 전'
    },
    {
      id: 4,
      author: { name: '최춘식', interests: ['인공지능'] },
      title: '프로그래머스 Lv2 효율적으로 푸는 법',
      content: '코테 준비하면서 정리한 Lv2 유형별 접근법입니다...',
      tags: ['인공지능'],
      chips: ['코딩테스트', '이력서', '면접'],
      likes: 89,
      comments: 15,
      shares: 12,
      createdAt: '2일 전'
    },
    {
      id: 5,
      author: { name: '장개발', interests: ['프론트엔드'] },
      title: '배달의민족 인턴 전환 프로세스',
      content: '인턴 3개월 하고 전환 면접 봤습니다. 전환율은 약 70%정도...',
      tags: ['프론트엔드'],
      chips: ['면접'],
      likes: 178,
      comments: 34,
      shares: 21,
      createdAt: '6일 전'
    }
  ]

  // 검색 기능
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const lowerQuery = query.toLowerCase()
    
    // 제목 또는 내용에서 검색
    const results = allPosts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.author.name.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      post.chips.some(chip => chip.toLowerCase().includes(lowerQuery))
    )
    
    setSearchResults(results)
  }, [])

  // 검색어 변경 시 검색 실행 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, handleSearch])

  // 숫자 포맷
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // 아바타 이니셜
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <main className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.logo}>Devths</h1>
        <div className={styles.toolbarSpace} />
      </header>

      {/* 검색 입력 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#8a8a8a" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button 
              className={styles.clearBtn}
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      <div className={styles.content}>
        {isSearching && (
          <>
            <div className={styles.resultHeader}>
              <span className={styles.resultCount}>게시글 ({searchResults.length})</span>
            </div>

            {searchResults.length === 0 ? (
              <div className={styles.noResults}>
                <p>검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className={styles.postList}>
                {searchResults.map(post => (
                  <article key={post.id} className={styles.postCard}>
                    {/* 작성자 정보 */}
                    <div className={styles.postAuthor}>
                      <div className={`${styles.avatar} ${post.author.avatar === 'dark' ? styles.avatarDark : ''}`}>
                        {post.author.avatar === 'dark' ? '' : getInitial(post.author.name)}
                      </div>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorRow}>
                          <span className={styles.authorName}>{post.author.name}</span>
                          <span className={styles.postTime}>{post.createdAt}</span>
                        </div>
                        <span className={styles.authorTags}>
                          {post.tags.map(tag => `#${tag}`).join(' ')}
                        </span>
                      </div>
                    </div>

                    {/* 게시글 내용 */}
                    <div 
                      className={styles.postContent}
                      onClick={() => router.push(`/feed/${post.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postPreview}>{post.content}</p>
                    </div>

                    {/* 칩(태그) */}
                    <div className={styles.postChips}>
                      {post.chips.map(chip => (
                        <span key={chip} className={styles.chip}>{chip}</span>
                      ))}
                    </div>

                    {/* 반응 정보 */}
                    <div className={styles.postReactions}>
                      <div className={styles.reaction}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#6a7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{formatNumber(post.likes)}</span>
                      </div>
                      <div className={styles.reaction}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#6a7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                      <div className={styles.reaction}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="18" cy="5" r="3" stroke="#6a7282" strokeWidth="1.5"/>
                          <circle cx="6" cy="12" r="3" stroke="#6a7282" strokeWidth="1.5"/>
                          <circle cx="18" cy="19" r="3" stroke="#6a7282" strokeWidth="1.5"/>
                          <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#6a7282" strokeWidth="1.5"/>
                        </svg>
                        <span>{formatNumber(post.shares)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {!isSearching && !searchQuery && (
          <div className={styles.searchHint}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#d1d5dc" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="#d1d5dc" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>게시글 제목, 내용, 작성자를 검색해보세요</p>
          </div>
        )}
      </div>

      {/* 하단 탭 바 */}
      <nav className={styles.tabBar}>
        <button className={styles.tabItem} onClick={() => router.push('/calendar')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>홈</span>
        </button>
        <button className={`${styles.tabItem} ${styles.tabActive}`} onClick={() => router.push('/feed')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21M9 21V9" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>피드</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/ai')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8a8a8a" strokeWidth="2"/>
            <circle cx="12" cy="8" r="2" fill="#8a8a8a"/>
            <path d="M8 14H16M8 18H12" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>AI</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/chat')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={styles.tabItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>
    </main>
  )
}

