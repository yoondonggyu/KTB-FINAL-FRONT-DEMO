'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type ChatCategory = 'personal' | 'group' | 'popular'

interface ChatRoom {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  participantCount?: number
  tag?: string
  isNotificationOff?: boolean
  hasUnread?: boolean
  type: ChatCategory
}

// 더미 채팅방 데이터
const dummyChatRooms: ChatRoom[] = [
  {
    id: 1,
    name: '김개발',
    avatar: '',
    lastMessage: '안녕하세요! 면접 관련해서 질문이 있어요.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    hasUnread: true,
    type: 'personal',
  },
  {
    id: 2,
    name: '이코딩',
    avatar: '',
    lastMessage: '코딩테스트 같이 준비해요!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    type: 'personal',
  },
  {
    id: 3,
    name: '박취준',
    avatar: '',
    lastMessage: '포트폴리오 피드백 감사합니다.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 어제
    type: 'personal',
  },
  {
    id: 4,
    name: '최개발',
    avatar: '',
    lastMessage: '다음에 또 이야기해요!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5일 전
    hasUnread: true,
    type: 'personal',
  },
  {
    id: 5,
    name: '정코딩',
    avatar: '',
    lastMessage: '화이팅입니다!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30일 전
    type: 'personal',
  },
  {
    id: 6,
    name: '한취준',
    avatar: '',
    lastMessage: '감사합니다!',
    lastMessageTime: new Date(2024, 11, 31), // 24년 12월 31일
    type: 'personal',
  },
  {
    id: 7,
    name: '프론트엔드 면접 스터디',
    avatar: '',
    lastMessage: '오늘 저녁 8시에 모여요!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
    participantCount: 150,
    tag: '면접',
    hasUnread: true,
    type: 'group',
  },
  {
    id: 8,
    name: '이력서 첨삭방',
    avatar: '',
    lastMessage: '피드백 부탁드려요!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    participantCount: 320,
    tag: '이력서',
    type: 'group',
  },
  {
    id: 9,
    name: '백엔드 코딩테스트',
    avatar: '',
    lastMessage: '알고리즘 문제 풀이 공유합니다.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
    participantCount: 89,
    tag: '코딩테스트',
    type: 'group',
  },
  {
    id: 10,
    name: '포트폴리오 리뷰방',
    avatar: '',
    lastMessage: '좋은 포트폴리오 예시 공유합니다.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7일 전
    participantCount: 245,
    tag: '포트폴리오',
    isNotificationOff: true,
    type: 'group',
  },
  {
    id: 11,
    name: '🔥 면접 마스터 클래스',
    avatar: '',
    lastMessage: '현직자 멘토링 진행 중!',
    lastMessageTime: new Date(),
    participantCount: 500,
    tag: '면접',
    type: 'popular',
  },
  {
    id: 12,
    name: '💼 취업 정보 공유방',
    avatar: '',
    lastMessage: '네이버 신입 공채 정보입니다.',
    lastMessageTime: new Date(),
    participantCount: 450,
    tag: '이력서',
    type: 'popular',
  },
]

export default function ChatListPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('personal')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [recentSearches] = useState(['프론트엔드', '면접', '코딩테스트'])

  // 카테고리에 따라 채팅방 필터링
  const filteredChatRooms = dummyChatRooms.filter(room => room.type === selectedCategory)

  // 시간 포맷팅 함수
  const formatTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const oneDay = 1000 * 60 * 60 * 24

    // 오늘인 경우
    if (diff < oneDay && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    // 어제인 경우
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.getDate() === yesterday.getDate() && 
        date.getMonth() === yesterday.getMonth() && 
        date.getFullYear() === yesterday.getFullYear()) {
      return '어제'
    }

    // 올해인 경우
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`
    }

    // 작년 이전인 경우
    return `${String(date.getFullYear()).slice(-2)}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  // 채팅방 이름 포맷팅 (6자 초과 시 ...)
  const formatName = (name: string): string => {
    if (name.length > 6) {
      return name.slice(0, 6) + '...'
    }
    return name
  }

  // 참여 인원 수 포맷팅
  const formatParticipantCount = (count: number): string => {
    if (count > 300) {
      return '300+명 참여중'
    }
    return `${count}명 참여중`
  }

  const handleChatRoomClick = (roomId: number) => {
    router.push(`/chat/${roomId}`)
  }

  const handleSearchClick = () => {
    setIsSearchModalOpen(true)
  }

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false)
    setSearchKeyword('')
  }

  const handleRecentSearchClick = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleCreateChatRoom = () => {
    // TODO: 채팅방 생성 페이지로 이동
    router.push('/chat/create')
  }

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <h1 className={styles.logo}>Devths</h1>
        <div className={styles.toolbarActions}>
          <button className={styles.iconButton} onClick={handleSearchClick} aria-label="검색">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="알림" onClick={() => router.push('/notifications')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 카테고리 토글 */}
      <div className={styles.categoryToggle}>
        <button 
          className={`${styles.categoryButton} ${selectedCategory === 'personal' ? styles.categoryButtonActive : ''}`}
          onClick={() => setSelectedCategory('personal')}
        >
          개인
        </button>
        <button 
          className={`${styles.categoryButton} ${selectedCategory === 'group' ? styles.categoryButtonActive : ''}`}
          onClick={() => setSelectedCategory('group')}
        >
          그룹
        </button>
        <button 
          className={`${styles.categoryButton} ${selectedCategory === 'popular' ? styles.categoryButtonActive : ''}`}
          onClick={() => setSelectedCategory('popular')}
        >
          인기
        </button>
      </div>

      {/* 섹션 제목 */}
      <h2 className={styles.sectionTitle}>
        {selectedCategory === 'personal' ? '참여중인 채팅방 목록' : '인기 그룹 채팅방 목록'}
      </h2>

      {/* 채팅방 목록 */}
      <main className={styles.chatList}>
        {filteredChatRooms.length === 0 ? (
          <div className={styles.emptyState}>
            <p>새롭게 채팅을 시작해보세요</p>
          </div>
        ) : (
          filteredChatRooms.map(room => (
            <div 
              key={room.id} 
              className={styles.chatCard}
              onClick={() => handleChatRoomClick(room.id)}
            >
              <div className={styles.avatar}>
                {room.avatar ? (
                  <img src={room.avatar} alt={room.name} />
                ) : (
                  <div className={styles.avatarPlaceholder}></div>
                )}
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <div className={styles.chatNameRow}>
                    <span className={styles.chatName}>{formatName(room.name)}</span>
                    {room.participantCount && (
                      <span className={styles.participantCount}>
                        {formatParticipantCount(room.participantCount)}
                      </span>
                    )}
                  </div>
                  {room.tag && selectedCategory !== 'personal' && (
                    <span className={styles.tagChip}># {room.tag}</span>
                  )}
                </div>
                <div className={styles.chatFooter}>
                  <span className={styles.lastMessage}>{room.lastMessage}</span>
                  <div className={styles.chatMeta}>
                    {room.isNotificationOff && (
                      <svg className={styles.muteIcon} width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6 5.33333C12.6 4.27247 12.1575 3.25505 11.3698 2.50491C10.5822 1.75476 9.51304 1.33333 8.4 1.33333C7.28696 1.33333 6.21782 1.75476 5.43016 2.50491C4.6425 3.25505 4.2 4.27247 4.2 5.33333C4.2 10 2.1 11.3333 2.1 11.3333H14.7C14.7 11.3333 12.6 10 12.6 5.33333Z" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1L15 14" stroke="#8E8E93" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    )}
                    {selectedCategory !== 'popular' && (
                      <span className={styles.lastTime}>{formatTime(room.lastMessageTime)}</span>
                    )}
                    {room.hasUnread && <span className={styles.unreadDot}></span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* 채팅방 생성 플로팅 버튼 */}
      <button className={styles.floatingButton} onClick={handleCreateChatRoom} aria-label="채팅방 생성">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 하단 탭 바 */}
      <nav className={styles.tabBar}>
        <button className={styles.tabItem} onClick={() => router.push('/calendar')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>홈</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/feed')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21M9 21V9" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <button className={`${styles.tabItem} ${styles.tabItemActive}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10H17" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14H13" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <div className={styles.searchModalOverlay} onClick={handleCloseSearchModal}>
          <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.searchModalHeader}>
              <button className={styles.backButton} onClick={handleCloseSearchModal} aria-label="닫기">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="채팅방 검색하기"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                maxLength={10}
              />
              <svg className={styles.searchIcon} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="7" stroke="#61646B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#61646B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {searchKeyword.length > 0 && searchKeyword.length < 1 && (
              <p className={styles.searchError}>최소 1글자 이상 입력해주세요.</p>
            )}
            <h3 className={styles.recentSearchTitle}>최근 검색</h3>
            <div className={styles.recentSearchList}>
              {recentSearches.map((keyword, index) => (
                <button 
                  key={index} 
                  className={styles.recentSearchChip}
                  onClick={() => handleRecentSearchClick(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

