'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'

interface User {
  id: string
  nickname: string
  avatar: string
}

// 더미 팔로잉 유저 목록
const followingUsers: User[] = [
  { id: '1', nickname: '유저 닉네임 1', avatar: '/avatars/user1.png' },
  { id: '2', nickname: '유저 닉네임 2', avatar: '/avatars/user2.png' },
  { id: '3', nickname: '유저 닉네임 3', avatar: '/avatars/user3.png' },
  { id: '4', nickname: '유저 닉네임 4', avatar: '/avatars/user4.png' },
  { id: '5', nickname: '유저 닉네임 5', avatar: '/avatars/user5.png' },
  { id: '6', nickname: '유저 닉네임 6', avatar: '/avatars/user6.png' },
  { id: '7', nickname: '유저 닉네임 7', avatar: '/avatars/user7.png' },
  { id: '8', nickname: '유저 닉네임 8', avatar: '/avatars/user8.png' },
]

const tags = ['이력서', '포트폴리오', '면접', '코딩테스트']

export default function ChatCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') || 'personal'

  const [chatType, setChatType] = useState<'personal' | 'group'>(initialType as 'personal' | 'group')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchError, setSearchError] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [chatRoomName, setChatRoomName] = useState('')
  const [selectedTag, setSelectedTag] = useState('이력서')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showEmptyGroupModal, setShowEmptyGroupModal] = useState(false)

  // 검색된 유저 목록
  const filteredUsers = searchKeyword.length >= 2
    ? followingUsers.filter(user =>
        user.nickname.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : followingUsers

  // 검색어 유효성 검사
  const validateSearch = () => {
    if (searchKeyword.trim() === '') {
      setSearchError('검색어를 입력해 주세요.')
      return false
    }
    if (searchKeyword.trim().length < 2) {
      setSearchError('검색어는 2자 이상 입력해 주세요.')
      return false
    }
    if (searchKeyword.length > 10) {
      setSearchError('검색어는 최대 10자까지 입력할 수 있습니다.')
      return false
    }
    setSearchError('')
    return true
  }

  const handleSearchChange = (value: string) => {
    if (value.length <= 10) {
      setSearchKeyword(value)
      setSearchError('')
    }
  }

  // 유저 선택/해제
  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } else {
      // 개인 채팅방은 1명만 선택 가능
      if (chatType === 'personal' && selectedUsers.length >= 1) {
        setErrorMessage('개인 채팅방은 1인 필수 선택입니다.')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 3000)
        return
      }
      setSelectedUsers(prev => [...prev, userId])
    }
  }

  // 태그 선택
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
  }

  // 완료 버튼 활성화 조건
  const isCompleteButtonEnabled = () => {
    if (chatType === 'personal') {
      return selectedUsers.length === 1
    } else {
      // 그룹: 채팅방 이름 필수, 유저 0명도 가능
      return chatRoomName.trim().length > 0
    }
  }

  // 채팅방 생성
  const handleCreateChat = () => {
    // 개인 채팅방 유효성 검사
    if (chatType === 'personal') {
      if (selectedUsers.length !== 1) {
        setErrorMessage('개인 채팅방은 1인 필수 선택입니다.')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 3000)
        return
      }
    }

    // 그룹 채팅방 유효성 검사
    if (chatType === 'group') {
      if (chatRoomName.trim().length === 0) {
        setErrorMessage('채팅방 이름을 입력해 주세요.')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 3000)
        return
      }

      // 유저 없이 생성하는 경우 확인 모달
      if (selectedUsers.length === 0) {
        setShowEmptyGroupModal(true)
        return
      }

      if (selectedUsers.length === 1) {
        setErrorMessage('그룹 채팅방은 2인 이상 필수 선택입니다.')
        setShowErrorToast(true)
        setTimeout(() => setShowErrorToast(false), 3000)
        return
      }
    }

    createChatRoom()
  }

  const createChatRoom = () => {
    // 채팅방 생성 성공
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
      // 채팅 목록으로 이동
      router.push('/chat')
    }, 1500)
  }

  const handleEmptyGroupConfirm = () => {
    setShowEmptyGroupModal(false)
    createChatRoom()
  }

  const handleEmptyGroupCancel = () => {
    setShowEmptyGroupModal(false)
  }

  // 채팅 타입 변경 시 선택 초기화
  useEffect(() => {
    setSelectedUsers([])
    setChatRoomName('')
    setSelectedTag('이력서')
    setSearchKeyword('')
    setSearchError('')
  }, [chatType])

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.backButton} onClick={() => router.back()} aria-label="뒤로 가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles.title}>채팅방 생성</h1>
        </div>
        <button className={styles.notificationButton} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3015 21.5547 12.9987 21.7295C12.6959 21.9044 12.3528 21.9967 12 21.9967C11.6472 21.9967 11.3041 21.9044 11.0013 21.7295C10.6985 21.5547 10.4458 21.3031 10.22 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* 개인/그룹 탭 */}
        <div className={styles.chatTypeTabs}>
          <button
            className={`${styles.chatTypeTab} ${chatType === 'personal' ? styles.chatTypeTabActive : ''}`}
            onClick={() => setChatType('personal')}
          >
            개인
          </button>
          <button
            className={`${styles.chatTypeTab} ${chatType === 'group' ? styles.chatTypeTabActive : ''}`}
            onClick={() => setChatType('group')}
          >
            그룹
          </button>
        </div>

        {/* 그룹 채팅방 전용: 채팅방 이름 */}
        {chatType === 'group' && (
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>
              채팅방 이름 <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="제목을 입력하세요"
              value={chatRoomName}
              onChange={(e) => {
                if (e.target.value.length <= 10) {
                  setChatRoomName(e.target.value)
                }
              }}
              maxLength={10}
            />
            <span className={styles.charCount}>{chatRoomName.length}/10</span>
          </div>
        )}

        {/* 그룹 채팅방 전용: 태그 선택 */}
        {chatType === 'group' && (
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>
              태그 선택 <span className={styles.required}>*</span>
            </label>
            <div className={styles.tagContainer}>
              {tags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${selectedTag === tag ? styles.tagButtonActive : ''}`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 유저 검색 */}
        <div className={styles.inputSection}>
          <label className={styles.inputLabel}>유저 검색</label>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="이름을 입력하세요"
              value={searchKeyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              maxLength={10}
            />
            {searchKeyword && (
              <button className={styles.clearButton} onClick={() => setSearchKeyword('')} aria-label="검색어 지우기">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          {searchError && <p className={styles.errorText}>{searchError}</p>}
        </div>

        {/* 팔로잉 유저 목록 */}
        <div className={styles.userListSection}>
          <label className={styles.inputLabel}>
            팔로잉 유저 목록 {chatType === 'personal' && <span className={styles.required}>*</span>}
          </label>
          
          {filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              {searchKeyword ? '해당하는 유저가 없습니다.' : '아직 팔로우 하고 있는 유저가 없습니다.'}
            </div>
          ) : (
            <div className={styles.userList}>
              {filteredUsers.map(user => (
                <div key={user.id} className={styles.userItem} onClick={() => handleUserSelect(user.id)}>
                  <div className={styles.userAvatar}>
                    <img src={user.avatar} alt={user.nickname} className={styles.avatarImage} />
                  </div>
                  <span className={styles.userName}>{user.nickname}</span>
                  <div className={`${styles.checkbox} ${selectedUsers.includes(user.id) ? styles.checkboxChecked : ''}`}>
                    {selectedUsers.includes(user.id) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 완료 버튼 */}
      <div className={styles.bottomActions}>
        <button
          className={`${styles.completeButton} ${isCompleteButtonEnabled() ? styles.completeButtonActive : ''}`}
          onClick={handleCreateChat}
          disabled={!isCompleteButtonEnabled()}
        >
          완료
        </button>
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

      {/* 성공 토스트 */}
      {showSuccessToast && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <h3>채팅방 생성 완료</h3>
            <p>채팅방이 정상적으로 생성되었습니다</p>
          </div>
        </div>
      )}

      {/* 에러 토스트 */}
      {showErrorToast && (
        <div className={styles.errorToast}>
          <div className={styles.toastContent}>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 유저 없이 그룹 채팅방 생성 확인 모달 */}
      {showEmptyGroupModal && (
        <div className={styles.modalOverlay} onClick={handleEmptyGroupCancel}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>유저없이 채팅방 생성하기</h3>
              <button className={styles.modalCloseButton} onClick={handleEmptyGroupCancel} aria-label="닫기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>아무런 사용자 없이 그룹채팅방을 생성합니다.</p>
              <p>이대로 생성하시겠습니까?</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={handleEmptyGroupCancel}>취소</button>
              <button className={styles.confirmButton} onClick={handleEmptyGroupConfirm}>생성</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

