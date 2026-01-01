'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './page.module.css'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  images?: string[]
  isDeleted?: boolean
  isFailed?: boolean
  readCount?: number // 그룹 채팅에서 읽지 않은 유저 수
}

interface ChatRoom {
  id: string
  name: string
  type: 'personal' | 'group'
  participants: number
  messages: Message[]
}

// 현재 유저 ID (더미)
const currentUserId = 'user1'

// 더미 채팅방 데이터
const dummyChatRoom: ChatRoom = {
  id: '1',
  name: '채팅방 타이틀',
  type: 'group', // 'personal' 또는 'group'
  participants: 5,
  messages: [
    {
      id: '1',
      senderId: 'user2',
      senderName: '유저 닉네임',
      senderAvatar: '/avatars/user2.png',
      content: '메세지 텍스트가 입력됩니다',
      timestamp: new Date('2024-12-24T14:00:00'),
      readCount: 2,
    },
    {
      id: '2',
      senderId: 'user2',
      senderName: '유저 닉네임',
      senderAvatar: '/avatars/user2.png',
      content: '장문의 메세지 텍스트가 입력됩니다장문의 메세지 텍스트가 입력됩니다장문의 메세지 텍스트가 입력됩니다장문의 메세지 텍스트가 입력됩니다장문의 메세지 텍스트가 입력됩니다장문의 메세지 텍스트가 입력됩니다. 펼쳐진 장문의 텍스트가 입력됩니다. 펼쳐진 장문의 텍스트가 입력됩니다.',
      timestamp: new Date('2024-12-24T14:01:00'),
      readCount: 0,
    },
    {
      id: '3',
      senderId: 'user1',
      senderName: '나',
      senderAvatar: '/avatars/user1.png',
      content: '메세지 텍스트가 입력됩니다',
      timestamp: new Date('2024-12-24T14:02:00'),
      images: ['/images/sample1.jpg', '/images/sample2.jpg', '/images/sample3.jpg'],
    },
    {
      id: '4',
      senderId: 'user2',
      senderName: '유저 닉네임',
      senderAvatar: '/avatars/user2.png',
      content: '삭제된 메시지입니다.',
      timestamp: new Date('2024-12-24T14:03:00'),
      isDeleted: true,
    },
    {
      id: '5',
      senderId: 'user2',
      senderName: '유저 닉네임',
      senderAvatar: '/avatars/user2.png',
      content: '메세지 텍스트가 입력됩니다',
      timestamp: new Date('2024-12-24T14:04:00'),
    },
    {
      id: '6',
      senderId: 'user1',
      senderName: '나',
      senderAvatar: '/avatars/user1.png',
      content: '메세지 텍스트가 입력됩니다',
      timestamp: new Date('2024-12-25T09:00:00'),
    },
    {
      id: '7',
      senderId: 'user1',
      senderName: '나',
      senderAvatar: '/avatars/user1.png',
      content: '메시지 전송에 실패했습니다',
      timestamp: new Date('2024-12-25T09:01:00'),
      isFailed: true,
    },
  ],
}

export default function ChatDetailPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)

  const [chatRoom, setChatRoom] = useState<ChatRoom>(dummyChatRoom)
  const [messageInput, setMessageInput] = useState('')
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; avatar: string } | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatRoom.messages])

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const isThisYear = date.getFullYear() === today.getFullYear()

    if (isToday) {
      return '오늘'
    } else if (isThisYear) {
      const weekdays = ['일', '월', '화', '수', '목', '금', '토']
      return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`
    } else {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    }
  }

  // 시간 포맷팅
  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes}${ampm}`
  }

  // 날짜 구분선 필요 여부
  const shouldShowDateDivider = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return true
    const currentDate = new Date(currentMsg.timestamp).toDateString()
    const prevDate = new Date(prevMsg.timestamp).toDateString()
    return currentDate !== prevDate
  }

  // 장문 메시지 토글
  const toggleExpandMessage = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  // 메시지 롱프레스 시작
  const handleMessageLongPressStart = (messageId: string, senderId: string) => {
    if (senderId !== currentUserId) return // 자신의 메시지만 삭제 가능

    const timer = setTimeout(() => {
      setSelectedMessageId(messageId)
      setShowDeleteModal(true)
    }, 2000)
    setLongPressTimer(timer)
  }

  // 메시지 롱프레스 종료
  const handleMessageLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  // 메시지 삭제
  const handleDeleteMessage = () => {
    if (!selectedMessageId) return

    setChatRoom(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === selectedMessageId
          ? { ...msg, content: '삭제된 메시지입니다.', isDeleted: true }
          : msg
      ),
    }))

    setShowDeleteModal(false)
    setSelectedMessageId(null)
  }

  // 메시지 전송
  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: '나',
      senderAvatar: '/avatars/user1.png',
      content: messageInput.trim(),
      timestamp: new Date(),
    }

    setChatRoom(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }))

    setMessageInput('')
    messageInputRef.current?.focus()
  }

  // 실패한 메시지 재전송
  const handleRetryMessage = (messageId: string) => {
    setChatRoom(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, isFailed: false } : msg
      ),
    }))
  }

  // 실패한 메시지 삭제
  const handleDeleteFailedMessage = (messageId: string) => {
    setChatRoom(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId),
    }))
  }

  // 유저 프로필 클릭
  const handleUserClick = (user: { id: string; name: string; avatar: string }) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // 첨부파일 모달
  const handleAttachmentClick = () => {
    setShowAttachmentModal(true)
  }

  const isOwnMessage = (senderId: string) => senderId === currentUserId

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.backButton} onClick={() => router.push('/chat')} aria-label="뒤로 가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.toolbarCenter}>
          <h1 className={styles.title}>{chatRoom.name}</h1>
          {chatRoom.type === 'group' && (
            <span className={styles.participantCount}>{chatRoom.participants}</span>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.menuButton} onClick={() => router.push(`/chat/${chatId}/settings`)} aria-label="채팅방 설정">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* 보안 안내 */}
      <div className={styles.securityNotice}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6A7282" strokeWidth="2"/>
          <path d="M12 8V12" stroke="#6A7282" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="#6A7282"/>
        </svg>
        <div className={styles.securityNoticeText}>
          <span className={styles.securityNoticeTitle}>보안 안내</span>
          <span className={styles.securityNoticeDesc}>연락처, 계좌번호, 주민번호 등 개인정보를 공유하지 마세요</span>
        </div>
      </div>

      {/* 메시지 영역 */}
      <main className={styles.chatArea}>
        {chatRoom.messages.map((message, index) => {
          const prevMessage = index > 0 ? chatRoom.messages[index - 1] : null
          const showDateDivider = shouldShowDateDivider(message, prevMessage)
          const isExpanded = expandedMessages.has(message.id)
          const isLongMessage = message.content.length > 300

          return (
            <div key={message.id}>
              {/* 날짜 구분선 */}
              {showDateDivider && (
                <div className={styles.dateDivider}>
                  <span className={styles.dateLabel}>{formatDate(message.timestamp)}</span>
                </div>
              )}

              {/* 메시지 */}
              <div
                className={`${styles.messageContainer} ${isOwnMessage(message.senderId) ? styles.ownMessage : ''}`}
                onMouseDown={() => handleMessageLongPressStart(message.id, message.senderId)}
                onMouseUp={handleMessageLongPressEnd}
                onMouseLeave={handleMessageLongPressEnd}
                onTouchStart={() => handleMessageLongPressStart(message.id, message.senderId)}
                onTouchEnd={handleMessageLongPressEnd}
              >
                {!isOwnMessage(message.senderId) && (
                  <div
                    className={styles.avatarContainer}
                    onClick={() => handleUserClick({ id: message.senderId, name: message.senderName, avatar: message.senderAvatar })}
                  >
                    <div className={styles.avatar}>
                      <img src={message.senderAvatar} alt={message.senderName} />
                    </div>
                  </div>
                )}

                <div className={styles.messageContent}>
                  {!isOwnMessage(message.senderId) && (
                    <span className={styles.senderName}>{message.senderName}</span>
                  )}

                  <div className={styles.messageBubbleWrapper}>
                    {isOwnMessage(message.senderId) && (
                      <div className={styles.messageInfo}>
                        {message.isFailed ? (
                          <div className={styles.failedActions}>
                            <button className={styles.retryButton} onClick={() => handleRetryMessage(message.id)} aria-label="재전송">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3313 3 18.2364 4.77411 19.8 7.4641" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M21 3V8H16" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button className={styles.deleteFailedButton} onClick={() => handleDeleteFailedMessage(message.id)} aria-label="삭제">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            {chatRoom.type === 'group' && message.readCount !== undefined && message.readCount > 0 && (
                              <span className={styles.readCount}>{message.readCount > 300 ? '300+' : message.readCount}</span>
                            )}
                            <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                          </>
                        )}
                      </div>
                    )}

                    <div className={`${styles.messageBubble} ${isOwnMessage(message.senderId) ? styles.ownBubble : ''} ${message.isDeleted ? styles.deletedBubble : ''} ${message.isFailed ? styles.failedBubble : ''}`}>
                      {message.images && message.images.length > 0 && !message.isDeleted && (
                        <div className={styles.imageGrid}>
                          {message.images.slice(0, 9).map((img, imgIndex) => (
                            <div key={imgIndex} className={styles.imageItem}>
                              <img src={img} alt={`첨부 이미지 ${imgIndex + 1}`} />
                            </div>
                          ))}
                        </div>
                      )}

                      <p className={styles.messageText}>
                        {isLongMessage && !isExpanded
                          ? `${message.content.slice(0, 300)}...`
                          : message.content}
                      </p>

                      {isLongMessage && (
                        <button className={styles.expandButton} onClick={() => toggleExpandMessage(message.id)}>
                          {isExpanded ? '접기' : '펼치기'}
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                          >
                            <path d="M6 9L12 15L18 9" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {!isOwnMessage(message.senderId) && (
                      <div className={styles.messageInfo}>
                        {chatRoom.type === 'group' && message.readCount !== undefined && message.readCount > 0 && (
                          <span className={styles.readCount}>{message.readCount > 300 ? '300+' : message.readCount}</span>
                        )}
                        <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* 메시지 입력 */}
      <div className={styles.inputBar}>
        <button className={styles.attachButton} onClick={handleAttachmentClick} aria-label="파일 첨부">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="#858e99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.inputWrapper}>
          <input
            ref={messageInputRef}
            type="text"
            className={styles.messageInput}
            placeholder="메세지를 입력하는 공간입니다."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
        <button
          className={`${styles.sendButton} ${messageInput.trim() ? styles.sendButtonActive : ''}`}
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
          aria-label="전송"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 메시지 삭제 모달 */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>메시지 삭제</h3>
              <button className={styles.modalCloseButton} onClick={() => setShowDeleteModal(false)} aria-label="닫기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>정말 삭제하시겠습니까?</p>
              <p>삭제된 메시지는 복구할 수 없습니다.</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>취소</button>
              <button className={styles.deleteButton} onClick={handleDeleteMessage}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 첨부파일 모달 */}
      {showAttachmentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAttachmentModal(false)}>
          <div className={styles.attachmentModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.attachmentOption}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#61646b" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#61646b"/>
                <path d="M21 15L16 10L5 21" stroke="#61646b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>이미지 첨부</span>
            </button>
            <button className={styles.attachmentOption}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="8" height="8" rx="1" stroke="#999999" strokeWidth="2"/>
                <rect x="13" y="3" width="8" height="8" rx="1" stroke="#999999" strokeWidth="2"/>
                <rect x="3" y="13" width="8" height="8" rx="1" stroke="#999999" strokeWidth="2"/>
                <rect x="13" y="13" width="8" height="8" rx="1" stroke="#999999" strokeWidth="2"/>
              </svg>
              <span>파일 첨부</span>
            </button>
          </div>
        </div>
      )}

      {/* 유저 프로필 모달 */}
      {showUserModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
          <div className={styles.userModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.userModalContent}>
              <div className={styles.userModalAvatar}>
                <img src={selectedUser.avatar} alt={selectedUser.name} />
              </div>
              <h3 className={styles.userModalName}>{selectedUser.name}</h3>
              <div className={styles.userModalActions}>
                <button className={styles.userModalButton}>1:1 채팅</button>
                <button className={styles.userModalButton}>프로필 보기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

