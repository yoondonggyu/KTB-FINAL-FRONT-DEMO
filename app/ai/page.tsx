'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface ChatRoom {
  id: string
  name: string
  status: 'saved' | 'temporary' // 보관됨 / 임시 보관
  createdAt: string
  lastMessage?: string
}

export default function AIChatListPage() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  
  // Mock data - 실제로는 API에서 가져옴
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    { id: '1', name: '카카오 프론트엔드 이력서 분석', status: 'saved', createdAt: '2시간 전' },
    { id: '2', name: 'NHN 백엔드 채용공고 매칭', status: 'temporary', createdAt: '5시간 전' },
    { id: '3', name: '네이버 클라우드 면접 준비', status: 'saved', createdAt: '1일 전' },
    { id: '4', name: '라인 프론트엔드 이력서 피드백', status: 'temporary', createdAt: '2일 전' },
    { id: '5', name: '토스 서버 개발자 채용공고 분석', status: 'temporary', createdAt: '3일 전' },
    { id: '6', name: '쿠팡 물류 시스템 이력서 검토', status: 'saved', createdAt: '5일 전' },
    { id: '7', name: '배달의민족 인턴 지원서 분석', status: 'temporary', createdAt: '1주 전' },
    { id: '8', name: '당근마켓 iOS 개발자 매칭', status: 'temporary', createdAt: '2주 전' },
  ])

  const handleNewChat = () => {
    // TODO: 새 대화 시작 - 이력서/채용공고 분석 페이지로 이동
    router.push('/ai/new')
  }

  const handleChatRoomClick = (chatId: string) => {
    // TODO: 채팅방 진입 - 이전 대화 이어서 진행
    router.push(`/ai/chat/${chatId}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    setSelectedChatId(chatId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (selectedChatId) {
      setChatRooms(prev => prev.filter(chat => chat.id !== selectedChatId))
      setShowDeleteModal(false)
      setSelectedChatId(null)
    }
  }

  const handleToggleStatus = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    setChatRooms(prev => prev.map(chat => {
      if (chat.id === chatId && chat.status === 'temporary') {
        return { ...chat, status: 'saved' }
      }
      return chat
    }))
  }

  const isEmpty = chatRooms.length === 0

  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <header className={styles.toolbar}>
        <h1 className={styles.logo}>Devths</h1>
        <button className={styles.iconButton} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Content Area */}
      <div className={styles.content}>
        {isEmpty ? (
          /* Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="115" height="115" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10H16M8 14H12" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={styles.emptyText}>
              아직 저장된 대화 내역이 없어요.<br/>
              새로운 대화를 시작하고 분석을 받아보세요!
            </p>
            <button className={styles.newChatButtonLarge} onClick={handleNewChat}>
              새 대화 시작
            </button>
          </div>
        ) : (
          /* Chat List */
          <>
            {/* New Chat Button */}
            <div className={styles.newChatCard} onClick={handleNewChat}>
              <span className={styles.newChatText}>새 대화 시작</span>
              <div className={styles.plusIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#151515" strokeWidth="2"/>
                  <path d="M12 8V16M8 12H16" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Chat Room List */}
            <div className={styles.chatList}>
              {chatRooms.map(chat => (
                <div 
                  key={chat.id} 
                  className={styles.chatCard}
                  onClick={() => handleChatRoomClick(chat.id)}
                >
                  <div className={styles.chatInfo}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <button 
                      className={`${styles.statusBadge} ${chat.status === 'saved' ? styles.statusSaved : styles.statusTemporary}`}
                      onClick={(e) => handleToggleStatus(e, chat.id)}
                      disabled={chat.status === 'saved'}
                    >
                      {chat.status === 'saved' ? '보관됨' : '임시 보관'}
                    </button>
                  </div>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteClick(e, chat.id)}
                    aria-label="삭제"
                  >
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 11V17" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 11V17" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>대화 삭제</h3>
            <p className={styles.modalText}>
              이 대화를 삭제하시겠습니까?<br/>
              삭제된 대화는 복구할 수 없습니다.
            </p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button 
                className={styles.confirmDeleteButton}
                onClick={handleConfirmDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
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
        <button className={`${styles.tabItem} ${styles.tabItemActive}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#3649f6" strokeWidth="2"/>
            <circle cx="12" cy="8" r="2" fill="#3649f6"/>
            <path d="M8 14H16M8 18H12" stroke="#3649f6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className={styles.tabTextActive}>AI</span>
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
    </div>
  )
}

