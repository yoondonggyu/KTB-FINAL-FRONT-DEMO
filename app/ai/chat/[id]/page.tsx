'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './page.module.css'

interface Message {
  id: number
  type: 'ai' | 'user'
  content: string
  timestamp: string
  hasImage?: boolean
  imageUrl?: string
}

const initialAiResponse = `안녕하세요! 이력서와 채용 공고 분석이 완료되었습니다.

**📋 이력서 분석 결과**
- 프론트엔드 개발 경험 3년
- React, TypeScript 숙련도 높음
- 협업 프로젝트 경험 다수

**💼 채용 공고 매칭도**
- 기술 스택 일치율: 85%
- 요구 경험 일치율: 90%
- 추가 학습 권장: GraphQL, Next.js

**💡 추천 사항**
1. 포트폴리오에 프로젝트 성과 수치화 필요
2. 자기소개서에 협업 경험 강조
3. 기술 면접 대비 알고리즘 복습 권장

더 자세한 분석이나 면접 질문 생성을 원하시면 말씀해주세요!`

export default function AiChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: initialAiResponse,
      timestamp: '2:00pm'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const [chatTitle, setChatTitle] = useState('새 분석 결과')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Set chat title based on ID
    if (chatId && chatId !== 'new-analysis-id') {
      setChatTitle(`채팅방 ${chatId}`)
    }
  }, [chatId])

  const getCurrentTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12
    return `${hours}:${minutes}${ampm}`
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: getCurrentTime()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: `"${inputMessage}"에 대한 답변입니다.\n\n분석 내용을 바탕으로 추가 정보를 제공해드릴게요. 더 궁금한 점이 있으시면 말씀해주세요!`,
        timestamp: getCurrentTime()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileAttach = () => {
    fileInputRef.current?.click()
  }

  const handleImageAttach = () => {
    imageInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 5 * 1024 * 1024 // 10MB for images, 5MB for files
    const allowedFormats = type === 'image' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      : ['application/pdf']

    if (file.size > maxSize) {
      alert(`파일 용량이 ${type === 'image' ? '10MB' : '5MB'}를 초과합니다.`)
      return
    }

    if (!allowedFormats.includes(file.type)) {
      alert(type === 'image' 
        ? '지원하지 않는 파일 형식입니다. (JPG, JPEG, PNG, PDF만 가능)'
        : '지원하지 않는 파일 형식입니다. (PDF만 가능)')
      return
    }

    // Add file message
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: `📎 ${file.name}`,
      timestamp: getCurrentTime(),
      hasImage: type === 'image' && file.type.startsWith('image/'),
      imageUrl: type === 'image' && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }

    setMessages(prev => [...prev, newUserMessage])
    e.target.value = '' // Reset input
  }

  const handleBackClick = () => {
    router.push('/ai')
  }

  const handleSaveClick = () => {
    setIsSaveModalOpen(true)
  }

  const confirmSave = () => {
    // TODO: Implement actual save logic
    setIsSaveModalOpen(false)
    alert('대화가 저장되었습니다.')
    router.push('/ai')
  }

  const cancelSave = () => {
    setIsSaveModalOpen(false)
  }

  const handleGenerateInterviewQuestions = () => {
    setIsInterviewModalOpen(true)
  }

  const confirmGenerateInterview = () => {
    setIsInterviewModalOpen(false)
    setIsTyping(true)

    setTimeout(() => {
      const interviewQuestionsMessage: Message = {
        id: messages.length + 1,
        type: 'ai',
        content: `**🎯 예상 면접 질문**

**기술 면접**
1. React의 Virtual DOM이 무엇이고, 어떻게 동작하는지 설명해주세요.
2. TypeScript를 사용하면서 얻은 이점과 어려웠던 점은 무엇인가요?
3. 상태 관리 라이브러리를 선택할 때 고려하는 기준은 무엇인가요?

**프로젝트 경험**
4. 가장 어려웠던 프로젝트와 그 해결 과정을 설명해주세요.
5. 팀 프로젝트에서 갈등이 발생했을 때 어떻게 해결했나요?

**인성 면접**
6. 5년 후 본인의 모습을 어떻게 그리고 계신가요?
7. 우리 회사에 지원한 이유는 무엇인가요?

각 질문에 대한 모범 답변이나 피드백이 필요하시면 말씀해주세요!`,
        timestamp: getCurrentTime()
      }
      setMessages(prev => [...prev, interviewQuestionsMessage])
      setIsTyping(false)
    }, 2000)
  }

  const cancelGenerateInterview = () => {
    setIsInterviewModalOpen(false)
  }

  return (
    <div className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <button className={styles.backButton} onClick={handleBackClick} aria-label="뒤로 가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>{chatTitle}</h1>
        <button className={styles.saveButton} onClick={handleSaveClick}>
          대화 저장
        </button>
      </header>

      {/* 메시지 영역 */}
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${message.type === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper}`}
          >
            {message.type === 'ai' && (
              <div className={styles.aiAvatar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="#151515" strokeWidth="2"/>
                  <circle cx="12" cy="8" r="2" fill="#151515"/>
                  <path d="M8 14H16M8 18H12" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            <div className={`${styles.messageBubble} ${message.type === 'user' ? styles.userBubble : styles.aiBubble}`}>
              {message.hasImage && message.imageUrl && (
                <div className={styles.messageImage}>
                  <img src={message.imageUrl} alt="첨부 이미지" />
                </div>
              )}
              <p className={styles.messageContent}>{message.content}</p>
              <span className={styles.messageTime}>{message.timestamp}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.aiMessageWrapper}`}>
            <div className={styles.aiAvatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#151515" strokeWidth="2"/>
                <circle cx="12" cy="8" r="2" fill="#151515"/>
                <path d="M8 14H16M8 18H12" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={`${styles.messageBubble} ${styles.aiBubble}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 면접 질문 생성 버튼 */}
      <div className={styles.interviewButtonContainer}>
        <button className={styles.interviewButton} onClick={handleGenerateInterviewQuestions}>
          면접 질문 생성
        </button>
      </div>

      {/* 메시지 입력 영역 */}
      <div className={styles.inputContainer}>
        <div className={styles.attachmentButtons}>
          <button className={styles.attachButton} onClick={handleImageAttach} aria-label="이미지 첨부">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#61646b" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="#61646b"/>
              <path d="M21 15L16 10L5 21" stroke="#61646b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.attachButton} onClick={handleFileAttach} aria-label="파일 첨부">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59718 21.9983 8.00502 21.9983C6.41285 21.9983 4.88582 21.3658 3.76002 20.24C2.63421 19.1142 2.00171 17.5871 2.00171 15.995C2.00171 14.4028 2.63421 12.8758 3.76002 11.75L12.95 2.55999C13.7006 1.80943 14.7186 1.38672 15.78 1.38672C16.8415 1.38672 17.8595 1.80943 18.61 2.55999C19.3606 3.31056 19.7833 4.32855 19.7833 5.38999C19.7833 6.45143 19.3606 7.46943 18.61 8.21999L9.41002 17.41C9.03473 17.7853 8.52573 17.9966 7.99502 17.9966C7.4643 17.9966 6.9553 17.7853 6.58002 17.41C6.20473 17.0347 5.99338 16.5257 5.99338 15.995C5.99338 15.4643 6.20473 14.9553 6.58002 14.58L15.07 6.09999" stroke="#61646b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <input
          type="text"
          className={styles.messageInput}
          placeholder="메세지를 입력하는 공간입니다."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          className={`${styles.sendButton} ${inputMessage.trim() ? styles.sendButtonActive : ''}`}
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          aria-label="전송"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: 'none' }}
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={(e) => handleFileChange(e, 'image')}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, 'file')}
        />
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
        <button className={`${styles.tabItem} ${styles.tabItemActive}`} onClick={() => router.push('/ai')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#151515" strokeWidth="2"/>
            <circle cx="12" cy="8" r="2" fill="#151515"/>
            <path d="M8 14H16M8 18H12" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
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
        <button className={styles.tabItem}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* 대화 저장 확인 모달 */}
      {isSaveModalOpen && (
        <div className={styles.modalOverlay} onClick={cancelSave}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>대화 내용을 저장하시겠습니까?</h3>
            <p className={styles.modalMessage}>
              현재 대화 내용을 저장합니다.<br />
              대화 목록에서 확인 가능합니다.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={cancelSave}>아니오</button>
              <button className={styles.modalConfirmButton} onClick={confirmSave}>예</button>
            </div>
          </div>
        </div>
      )}

      {/* 면접 질문 생성 확인 모달 */}
      {isInterviewModalOpen && (
        <div className={styles.modalOverlay} onClick={cancelGenerateInterview}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>면접 질문을 생성하시겠습니까?</h3>
            <p className={styles.modalMessage}>
              현재 대화 내용을 기반하여 예상 면접 질문을 생성합니다.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={cancelGenerateInterview}>아니오</button>
              <button className={styles.modalConfirmButton} onClick={confirmGenerateInterview}>예</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

