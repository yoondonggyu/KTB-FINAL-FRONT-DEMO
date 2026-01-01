'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../followers/page.module.css'

interface User {
  id: number
  nickname: string
  profileImage: string | null
  interests: string[]
  isFollowing: boolean
}

const dummyFollowing: User[] = [
  { id: 1, nickname: 'henry', profileImage: null, interests: ['프론트엔드', '백엔드'], isFollowing: true },
  { id: 2, nickname: 'estar', profileImage: null, interests: ['클라우드'], isFollowing: true },
  { id: 3, nickname: 'neon', profileImage: null, interests: ['AI', 'DevOps'], isFollowing: true },
  { id: 4, nickname: 'david', profileImage: null, interests: ['iOS'], isFollowing: true },
  { id: 5, nickname: 'alex', profileImage: null, interests: ['백엔드'], isFollowing: true },
  { id: 6, nickname: 'jane', profileImage: null, interests: ['프론트엔드'], isFollowing: true },
  { id: 7, nickname: 'mike', profileImage: null, interests: ['클라우드', 'DevOps'], isFollowing: true },
  { id: 8, nickname: 'sara', profileImage: null, interests: ['AI'], isFollowing: true },
  { id: 9, nickname: 'chris', profileImage: null, interests: ['Android'], isFollowing: true },
  { id: 10, nickname: 'emma', profileImage: null, interests: ['보안'], isFollowing: true },
]

export default function FollowingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following')
  const [following, setFollowing] = useState<User[]>(dummyFollowing)
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false)

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setIsProfileModalOpen(true)
  }

  const handleChatClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation()
    // TODO: Navigate to chat with user
    console.log('Chat with:', user.nickname)
  }

  const handleUnfollowClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation()
    setSelectedUser(user)
    setIsUnfollowModalOpen(true)
  }

  const confirmUnfollow = () => {
    if (selectedUser) {
      setFollowing(prev => prev.filter(u => u.id !== selectedUser.id))
      setIsUnfollowModalOpen(false)
      setIsProfileModalOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.logo}>Devths</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} aria-label="알림" onClick={() => router.push('/notifications')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.notificationDot} />
          </button>
        </div>
      </header>

      {/* 탭 버튼 */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'followers' ? styles.tabButtonActive : ''}`}
          onClick={() => router.push('/profile/followers')}
        >
          팔로워
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'following' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('following')}
        >
          팔로잉
        </button>
      </div>

      {/* 팔로잉 목록 */}
      <div className={styles.userList}>
        {following.map(user => (
          <div key={user.id} className={styles.userCard} onClick={() => handleUserClick(user)}>
            <div className={styles.userInfo}>
              <div className={styles.userImageWrapper}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.nickname} className={styles.userImage} />
                ) : (
                  <div className={styles.userImagePlaceholder} />
                )}
              </div>
              <span className={styles.userName}>{user.nickname}</span>
            </div>
            <div className={styles.userActions}>
              <button className={styles.chatButton} onClick={(e) => handleChatClick(e, user)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={styles.removeButton} onClick={(e) => handleUnfollowClick(e, user)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#151515" strokeWidth="2"/>
                  <path d="M15 9L9 15M9 9L15 15" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
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
        <button className={styles.tabItem} onClick={() => router.push('/chat')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10H17" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14H13" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={`${styles.tabItem} ${styles.tabItemActive}`} onClick={() => router.push('/profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* 사용자 프로필 모달 */}
      {isProfileModalOpen && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setIsProfileModalOpen(false)}>
          <div className={styles.profileModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={() => setIsProfileModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className={styles.profileModalContent}>
              <div className={styles.profileModalImageWrapper}>
                {selectedUser.profileImage ? (
                  <img src={selectedUser.profileImage} alt={selectedUser.nickname} className={styles.profileModalImage} />
                ) : (
                  <div className={styles.profileModalImagePlaceholder} />
                )}
              </div>
              <div className={styles.profileModalInfo}>
                <h2 className={styles.profileModalName}>{selectedUser.nickname}</h2>
                <div className={styles.profileModalInterests}>
                  {selectedUser.interests.map(interest => (
                    <span key={interest} className={styles.profileModalInterest}>#{interest}</span>
                  ))}
                </div>
              </div>
              <div className={styles.profileModalActions}>
                <button className={styles.profileModalChatButton} onClick={(e) => handleChatClick(e, selectedUser)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className={`${styles.profileModalFollowButton} ${styles.followingButton}`}
                  onClick={(e) => handleUnfollowClick(e, selectedUser)}
                >
                  팔로잉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 팔로우 취소 모달 */}
      {isUnfollowModalOpen && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setIsUnfollowModalOpen(false)}>
          <div className={styles.unfollowModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.unfollowTitle}>팔로우 취소</h3>
            <p className={styles.unfollowMessage}>
              정말 {selectedUser.nickname}님과의 팔로우를 끊으시겠어요?
            </p>
            <p className={styles.unfollowSubMessage}>
              상대방에게는 알림이 전송되지 않습니다.
            </p>
            <div className={styles.unfollowActions}>
              <button className={styles.unfollowCancelButton} onClick={() => setIsUnfollowModalOpen(false)}>
                뒤로 가기
              </button>
              <button className={styles.unfollowConfirmButton} onClick={confirmUnfollow}>
                팔로우 끊기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

