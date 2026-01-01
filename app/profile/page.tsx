'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  likes: number
  comments: number
  views: number
}

interface Comment {
  id: number
  postTitle: string
  content: string
  createdAt: string
}

const dummyPosts: Post[] = [
  { id: 1, title: '카카오 프론트엔드 1차 코테 후기', content: '오늘 카카오 공채 1차 코딩테스트 봤습니다. 3문제 출제됐고 난이도는...', createdAt: '2025.12.24 16:11', likes: 124, comments: 23, views: 8 },
  { id: 2, title: '네이버 백엔드 면접 경험', content: '네이버 백엔드 직무 면접을 다녀왔습니다. 예상 질문과 실제 질문...', createdAt: '2025.12.23 14:30', likes: 89, comments: 15, views: 5 },
  { id: 3, title: '포트폴리오 피드백 요청드립니다', content: '프론트엔드 개발자 지망생입니다. 포트폴리오 피드백 부탁드려요...', createdAt: '2025.12.22 10:00', likes: 56, comments: 32, views: 12 },
]

const dummyComments: Comment[] = [
  { id: 1, postTitle: '백엔드 스터디원 모집해요', content: '오 저요 1:1 챗 드릴게요!!', createdAt: '2025.12.24 16:11' },
  { id: 2, postTitle: '알고리즘 문제 질문', content: '이 문제는 DFS로 풀면 될 것 같아요', createdAt: '2025.12.23 11:20' },
  { id: 3, postTitle: '이력서 첨삭 부탁드립니다', content: '전체적으로 잘 작성하셨는데 프로젝트 성과를 수치화하면 좋을 것 같아요', createdAt: '2025.12.22 09:45' },
]

const interestOptions = ['프론트엔드', '백엔드', '클라우드', 'AI', 'DevOps', '보안', 'iOS', 'Android']

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // User profile state
  const [nickname, setNickname] = useState('yun')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>(['프론트엔드'])
  const [followers, setFollowers] = useState(17)
  const [following, setFollowing] = useState(20)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] = useState(false)
  
  // Edit modal state
  const [editNickname, setEditNickname] = useState(nickname)
  const [editInterests, setEditInterests] = useState<string[]>(interests)
  const [editProfileImage, setEditProfileImage] = useState<string | null>(profileImage)
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameSuccess, setNicknameSuccess] = useState('')
  
  // Withdraw modal state
  const [withdrawInput, setWithdrawInput] = useState('')
  
  const withdrawPlaceholder = `탈퇴하겠습니다/${nickname}`

  const validateNickname = (value: string) => {
    if (value.length < 2) {
      setNicknameError('*닉네임이 너무 짧습니다.')
      return false
    }
    if (value.length > 10) {
      setNicknameError('*닉네임은 10자 이내여야 합니다.')
      return false
    }
    if (/[\s!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setNicknameError('*띄어쓰기와 특수 문자를 제거해주세요.')
      return false
    }
    if (/admin|운영자|관리자/i.test(value)) {
      setNicknameError('*유효하지 않은 닉네임입니다.')
      return false
    }
    setNicknameError('')
    return true
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEditNickname(value)
    setNicknameSuccess('')
    validateNickname(value)
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('사진 크기는 2MB 이하로 제한됩니다.')
        return
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('jpg, jpeg, png 확장자만 허용됩니다.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteProfileImage = () => {
    setEditProfileImage(null)
  }

  const toggleEditInterest = (interest: string) => {
    if (editInterests.includes(interest)) {
      setEditInterests(prev => prev.filter(i => i !== interest))
    } else {
      setEditInterests(prev => [...prev, interest])
    }
  }

  const handleSaveChanges = () => {
    if (!validateNickname(editNickname)) return
    
    setNickname(editNickname)
    setInterests(editInterests)
    setProfileImage(editProfileImage)
    setNicknameSuccess('*회원 정보가 성공적으로 변경되었습니다.')
    setNicknameError('')
  }

  const openEditModal = () => {
    setEditNickname(nickname)
    setEditInterests([...interests])
    setEditProfileImage(profileImage)
    setNicknameError('')
    setNicknameSuccess('')
    setIsEditModalOpen(true)
  }

  const openWithdrawModal = () => {
    setIsEditModalOpen(false)
    setWithdrawInput('')
    setIsWithdrawModalOpen(true)
  }

  const handleWithdraw = () => {
    // TODO: Implement actual withdrawal logic
    setIsWithdrawModalOpen(false)
    setIsWithdrawCompleteModalOpen(true)
  }

  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false)
    router.push('/')
  }

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
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

      <main className={styles.mainContent}>
        {/* 프로필 영역 */}
        <section className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImageWrapper}>
              {profileImage ? (
                <img src={profileImage} alt="프로필" className={styles.profileImage} />
              ) : (
                <div className={styles.profileImagePlaceholder} />
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.nickname}>{nickname}</h2>
              <div className={styles.interestTags}>
                {interests.map(interest => (
                  <span key={interest} className={styles.interestTag}>#{interest}</span>
                ))}
              </div>
            </div>
            <button className={styles.editButton} onClick={openEditModal}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#adb3bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#adb3bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>수정하기</span>
            </button>
          </div>
          
          {/* 팔로워/팔로잉 */}
          <div className={styles.followSection}>
            <button 
              className={styles.followButton}
              onClick={() => followers > 0 && router.push('/profile/followers')}
              disabled={followers === 0}
            >
              <span>팔로워 {followers >= 1000 ? `${(followers/1000).toFixed(0)}k` : followers}명</span>
            </button>
            <button 
              className={styles.followButton}
              onClick={() => following > 0 && router.push('/profile/following')}
              disabled={following === 0}
            >
              <span>팔로잉 {following >= 1000 ? `${(following/1000).toFixed(0)}k` : following}명</span>
            </button>
          </div>
        </section>

        {/* 내가 쓴 글/댓글 탭 */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'posts' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            내가 쓴 글
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'comments' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            내가 쓴 댓글
          </button>
        </div>

        {/* 게시글/댓글 목록 */}
        <div className={styles.contentList}>
          {activeTab === 'posts' ? (
            dummyPosts.length > 0 ? (
              dummyPosts.map(post => (
                <div key={post.id} className={styles.postCard} onClick={() => router.push(`/feed/${post.id}`)}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <span className={styles.postDate}>{post.createdAt}</span>
                  <p className={styles.postContent}>{post.content}</p>
                  <div className={styles.postStats}>
                    <span className={styles.stat}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.09924 19.7228 3.69395 19.0554 3.41724C18.3879 3.14052 17.6725 2.99805 16.95 2.99805C16.2275 2.99805 15.5121 3.14052 14.8446 3.41724C14.1772 3.69395 13.5708 4.09924 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3508 11.8792 21.7561 11.2728 22.0328 10.6054C22.3095 9.93789 22.452 9.22248 22.452 8.5C22.452 7.77752 22.3095 7.0621 22.0328 6.39464C21.7561 5.72718 21.3508 5.12075 20.84 4.61Z" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {post.likes}
                    </span>
                    <span className={styles.stat}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {post.comments}
                    </span>
                    <span className={styles.stat}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>아직 작성한 게시글이 없습니다.</p>
              </div>
            )
          ) : (
            dummyComments.length > 0 ? (
              dummyComments.map(comment => (
                <div key={comment.id} className={styles.postCard} onClick={() => router.push(`/feed/${comment.id}`)}>
                  <h3 className={styles.postTitle}>{comment.postTitle}</h3>
                  <span className={styles.postDate}>{comment.createdAt}</span>
                  <p className={styles.postContent}>{comment.content}</p>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>아직 작성한 댓글이 없습니다.</p>
              </div>
            )
          )}
        </div>
      </main>

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
        <button className={`${styles.tabItem} ${styles.tabItemActive}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* 회원정보 수정 모달 */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={() => setIsEditModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 프로필 사진 */}
            <div className={styles.editProfileImageSection}>
              <div className={styles.editProfileImageWrapper}>
                {editProfileImage ? (
                  <>
                    <img src={editProfileImage} alt="프로필" className={styles.editProfileImage} />
                    <div className={styles.editProfileImageOverlay} />
                  </>
                ) : (
                  <div className={styles.editProfileImagePlaceholder} />
                )}
                <button className={styles.editProfileImageButton} onClick={() => fileInputRef.current?.click()}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 5.33334V26.6667M5.33334 16H26.6667" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleProfileImageChange}
                  style={{ display: 'none' }}
                />
              </div>
              {editProfileImage && (
                <button className={styles.deleteImageButton} onClick={handleDeleteProfileImage}>
                  삭제
                </button>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div className={styles.editInputSection}>
              <label className={styles.editLabel}>닉네임</label>
              <input 
                type="text"
                className={styles.editInput}
                value={editNickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 입력하세요"
              />
              {nicknameError && <p className={styles.helperTextError}>{nicknameError}</p>}
              {nicknameSuccess && <p className={styles.helperTextSuccess}>{nicknameSuccess}</p>}
            </div>

            {/* 관심 분야 */}
            <div className={styles.editInputSection}>
              <label className={styles.editLabel}>관심 분야 수정</label>
              <div className={styles.interestChips}>
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    className={`${styles.interestChip} ${editInterests.includes(interest) ? styles.interestChipActive : ''}`}
                    onClick={() => toggleEditInterest(interest)}
                  >
                    {editInterests.includes(interest) ? `${interest} x` : interest}
                  </button>
                ))}
              </div>
            </div>

            {/* 변경하기 버튼 */}
            <button className={styles.saveButton} onClick={handleSaveChanges}>
              변경하기
            </button>

            {/* 탈퇴하기 */}
            <button className={styles.withdrawLink} onClick={openWithdrawModal}>
              탈퇴하기
            </button>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 모달 */}
      {isWithdrawModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsWithdrawModalOpen(false)}>
          <div className={styles.withdrawModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={() => setIsWithdrawModalOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className={styles.withdrawContent}>
              <div className={styles.withdrawIcon}>
                <svg width="39" height="39" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#151515" strokeWidth="2"/>
                  <path d="M12 8V12M12 16H12.01" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p className={styles.withdrawText}>
                회원 탈퇴 시 소실된 정보는<br/>
                복구할 수 없습니다.<br/>
                그래도 탈퇴하시겠다면<br/>
                아래 문구를 따라 작성해주세요.
              </p>
            </div>

            <p className={styles.withdrawPlaceholderText}>{withdrawPlaceholder}</p>
            
            <input 
              type="text"
              className={styles.withdrawInput}
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              placeholder=""
            />

            <button 
              className={`${styles.withdrawButton} ${withdrawInput === withdrawPlaceholder ? styles.withdrawButtonActive : ''}`}
              onClick={handleWithdraw}
              disabled={withdrawInput !== withdrawPlaceholder}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 완료 모달 */}
      {isWithdrawCompleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.withdrawCompleteModal}>
            <div className={styles.withdrawCompleteIcon}>
              <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28.5" cy="28.5" r="28.5" fill="#b9b9b9"/>
                <path d="M17 29L25 37L41 21" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.withdrawCompleteTitle}>회원 탈퇴가 완료되었습니다.</h3>
            <button className={styles.withdrawCompleteButton} onClick={handleWithdrawComplete}>
              홈으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

