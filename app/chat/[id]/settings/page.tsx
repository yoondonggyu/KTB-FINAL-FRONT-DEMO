'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './page.module.css'

interface User {
  id: string
  nickname: string
  avatar: string
  interests: string[]
  isFollowing: boolean
}

interface ChatImage {
  id: string
  url: string
  date: Date
}

// 더미 참여 유저 목록
const dummyParticipants: User[] = [
  { id: 'me', nickname: '본인 정보', avatar: '/avatars/me.png', interests: ['프론트엔드', '백엔드'], isFollowing: false },
  { id: '1', nickname: '유저 닉네임 1', avatar: '/avatars/user1.png', interests: ['프론트엔드'], isFollowing: true },
  { id: '2', nickname: '유저 닉네임 2', avatar: '/avatars/user2.png', interests: ['백엔드', 'DevOps'], isFollowing: false },
  { id: '3', nickname: '유저 닉네임 3', avatar: '/avatars/user3.png', interests: ['AI', '데이터분석'], isFollowing: true },
  { id: '4', nickname: '유저 닉네임 4', avatar: '/avatars/user4.png', interests: ['모바일'], isFollowing: false },
  { id: '5', nickname: '유저 닉네임 5', avatar: '/avatars/user5.png', interests: ['프론트엔드', 'UX'], isFollowing: false },
  { id: '6', nickname: '유저 닉네임 6', avatar: '/avatars/user6.png', interests: ['백엔드'], isFollowing: true },
  { id: '7', nickname: '유저 닉네임 7', avatar: '/avatars/user7.png', interests: ['프론트엔드'], isFollowing: false },
  { id: '8', nickname: '유저 닉네임 8', avatar: '/avatars/user8.png', interests: ['풀스택'], isFollowing: false },
]

// 더미 채팅 이미지
const dummyImages: ChatImage[] = [
  { id: '1', url: '/images/chat1.jpg', date: new Date() },
  { id: '2', url: '/images/chat2.jpg', date: new Date() },
  { id: '3', url: '/images/chat3.jpg', date: new Date() },
  { id: '4', url: '/images/chat4.jpg', date: new Date() },
]

// 현재 유저 ID (더미)
const currentUserId = 'me'

export default function ChatSettingsPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string

  // 채팅방 정보
  const [chatRoomName, setChatRoomName] = useState('채팅방 타이틀')
  const [chatCode] = useState('ABC12345XY')
  const [isNotificationOn, setIsNotificationOn] = useState(true)
  const [participants] = useState<User[]>(dummyParticipants)
  const [images] = useState<ChatImage[]>(dummyImages)

  // 모달 상태
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [showCodeCopyModal, setShowCodeCopyModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showUnfollowModal, setShowUnfollowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 이름 수정
  const [editedName, setEditedName] = useState(chatRoomName)

  const handleBack = () => {
    router.back()
  }

  const handleNotificationToggle = () => {
    setIsNotificationOn(!isNotificationOn)
    // TODO: 서버에 알림 설정 저장
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chatCode)
    setShowCodeCopyModal(true)
    setTimeout(() => setShowCodeCopyModal(false), 2000)
  }

  const handleOpenEditNameModal = () => {
    setEditedName(chatRoomName)
    setShowEditNameModal(true)
  }

  const handleSaveName = () => {
    if (editedName.trim() && editedName.length <= 10) {
      setChatRoomName(editedName.trim())
      setShowEditNameModal(false)
      // TODO: 서버에 이름 저장
    }
  }

  const handleOpenUserModal = (user: User) => {
    if (user.id !== currentUserId) {
      setSelectedUser(user)
      setShowUserModal(true)
    }
  }

  const handleStartChat = (userId: string) => {
    // TODO: 1:1 채팅방으로 이동
    router.push(`/chat/${userId}`)
  }

  const handleToggleFollow = (user: User) => {
    if (user.isFollowing) {
      setSelectedUser(user)
      setShowUnfollowModal(true)
      setShowUserModal(false)
    } else {
      // TODO: 팔로우 API 호출
      console.log('Follow user:', user.id)
    }
  }

  const handleConfirmUnfollow = () => {
    // TODO: 언팔로우 API 호출
    console.log('Unfollow user:', selectedUser?.id)
    setShowUnfollowModal(false)
    setSelectedUser(null)
  }

  const handleLeaveChatRoom = () => {
    // TODO: 채팅방 나가기 API 호출
    router.push('/chat')
  }

  const handleViewAllImages = () => {
    router.push(`/chat/${chatId}/images`)
  }

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <button className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>{chatRoomName}</h1>
        <div className={styles.toolbarRight}></div>
      </header>

      {/* 채팅방 정보 */}
      <div className={styles.content}>
        {/* 채팅방 프로필 */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarPlaceholder}></div>
          </div>
          <div className={styles.profileNameRow}>
            <span className={styles.profileName}>{chatRoomName}</span>
            <button className={styles.editNameButton} onClick={handleOpenEditNameModal} aria-label="이름 수정">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 1.5L10.5 3.5L3.5 10.5H1.5V8.5L8.5 1.5Z" stroke="#151515" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className={styles.settingSection}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>알림</span>
            </div>
            <button 
              className={`${styles.toggle} ${isNotificationOn ? styles.toggleOn : ''}`}
              onClick={handleNotificationToggle}
              aria-label={isNotificationOn ? '알림 끄기' : '알림 켜기'}
            >
              <span className={styles.toggleThumb}></span>
            </button>
          </div>
        </div>

        {/* 대화 채팅 코드 */}
        <div className={styles.codeSection}>
          <span className={styles.codeSectionTitle}>대화 채팅 코드</span>
          <div className={styles.codeBox}>
            <span className={styles.codeText}>{chatCode}</span>
            <button className={styles.copyButton} onClick={handleCopyCode} aria-label="코드 복사">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="#151515" strokeWidth="2"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 이미지 미리보기 */}
        <div className={styles.imageSection}>
          <span className={styles.sectionTitle}>이미지</span>
          <div className={styles.imageGrid}>
            {images.slice(0, 4).map((image) => (
              <div key={image.id} className={styles.imageItem}>
                <div className={styles.imagePlaceholder}></div>
              </div>
            ))}
            {images.length > 4 && (
              <button className={styles.moreImagesButton} onClick={handleViewAllImages}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="1" fill="#151515"/>
                  <circle cx="19" cy="12" r="1" fill="#151515"/>
                  <circle cx="5" cy="12" r="1" fill="#151515"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 참여 유저 목록 */}
        <div className={styles.participantsSection}>
          <span className={styles.sectionTitle}>참여유저 목록</span>
          <div className={styles.participantsList}>
            {participants.map((user) => (
              <div 
                key={user.id} 
                className={`${styles.participantItem} ${user.id === currentUserId ? styles.currentUser : ''}`}
                onClick={() => handleOpenUserModal(user)}
              >
                <div className={styles.participantAvatar}>
                  <div className={styles.avatarSmall}></div>
                </div>
                <span className={styles.participantName}>{user.nickname}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅방 나가기 버튼 */}
        <button className={styles.leaveButton} onClick={() => setShowLeaveModal(true)}>
          채팅방 나가기
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
            <path d="M8 10H16M8 14H12" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* 채팅방 나가기 모달 */}
      {showLeaveModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLeaveModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>채팅방 나가기</h3>
              <button className={styles.modalCloseButton} onClick={() => setShowLeaveModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>현재 이용중인 채팅방에서 나가게 됩니다.</p>
              <p>정말 나가시겠습니까?</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowLeaveModal(false)}>
                취소
              </button>
              <button className={styles.leaveConfirmButton} onClick={handleLeaveChatRoom}>
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 채팅방 이름 수정 모달 */}
      {showEditNameModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditNameModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>채팅방 이름 수정</h3>
              <button className={styles.modalCloseButton} onClick={() => setShowEditNameModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>내가 이해하기 쉽게 채팅방 이름을 수정해보세요</p>
              <div className={styles.editNameInputWrapper}>
                <input
                  type="text"
                  className={styles.editNameInput}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value.slice(0, 10))}
                  placeholder={chatRoomName}
                  maxLength={10}
                />
                <span className={styles.charCount}>{editedName.length}/10</span>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowEditNameModal(false)}>
                취소
              </button>
              <button 
                className={styles.confirmButton} 
                onClick={handleSaveName}
                disabled={!editedName.trim()}
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 코드 복사 완료 토스트 */}
      {showCodeCopyModal && (
        <div className={styles.toast}>
          <p>채팅 코드가 복사되었습니다.</p>
        </div>
      )}

      {/* 유저 프로필 모달 */}
      {showUserModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
          <div className={styles.userModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.userModalClose} onClick={() => setShowUserModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={styles.userModalContent}>
              <div className={styles.userModalAvatar}>
                <div className={styles.avatarLarge}></div>
              </div>
              <div className={styles.userModalInfo}>
                <span className={styles.userModalName}>{selectedUser.nickname}</span>
                <button 
                  className={styles.chatButton}
                  onClick={() => handleStartChat(selectedUser.id)}
                  aria-label="1:1 채팅"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className={`${styles.followButton} ${selectedUser.isFollowing ? styles.following : ''}`}
                  onClick={() => handleToggleFollow(selectedUser)}
                >
                  {selectedUser.isFollowing ? '팔로잉' : '팔로우'}
                </button>
              </div>
              <div className={styles.userModalInterests}>
                {selectedUser.interests.map((interest, idx) => (
                  <span key={idx} className={styles.interestTag}>#{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 팔로우 취소 모달 */}
      {showUnfollowModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUnfollowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>팔로우 취소</h3>
            </div>
            <div className={styles.modalBody}>
              <p>정말 {selectedUser.nickname}님과의 팔로우를 끊으시겠어요?</p>
              <p>상대방에게는 알림이 전송되지 않습니다.</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowUnfollowModal(false)}>
                뒤로 가기
              </button>
              <button className={styles.leaveConfirmButton} onClick={handleConfirmUnfollow}>
                팔로우 끊기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

