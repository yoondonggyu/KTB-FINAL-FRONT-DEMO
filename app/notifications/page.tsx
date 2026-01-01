'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface Notification {
  id: string
  type: 'schedule' | 'activity' | 'post'
  content: string
  createdAt: Date
  isRead: boolean
  link?: string
}

// 더미 알림 데이터
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'schedule',
    content: '삼성전자 코딩테스트 마감 D-3일 입니다.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
    isRead: false,
    link: '/calendar'
  },
  {
    id: '2',
    type: 'activity',
    content: '유저닉네임1님이 회원님에게 팔로우를 걸었습니다.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    isRead: false,
    link: '/profile/followers'
  },
  {
    id: '3',
    type: 'post',
    content: '유저닉네임2님이 게시글에 댓글을 남겼습니다.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
    isRead: false,
    link: '/feed/1'
  },
  {
    id: '4',
    type: 'schedule',
    content: '카카오 1차 면접일 마감 D-1일 입니다.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
    isRead: true,
    link: '/calendar'
  },
  {
    id: '5',
    type: 'activity',
    content: '이력서 관련 첨삭된 내용이 완료되었습니다.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    isRead: true,
    link: '/ai'
  },
  {
    id: '6',
    type: 'post',
    content: '팔로우 중인 유저닉네임3님이 새로운 글을 작성했습니다.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    isRead: true,
    link: '/feed/2'
  },
  {
    id: '7',
    type: 'activity',
    content: 'OCR 인식이 완료되었습니다.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    isRead: true,
    link: '/ai'
  },
  {
    id: '8',
    type: 'post',
    content: '나의 게시글의 조회수가 증가하고 있습니다.',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35일 전 (1개월 이상)
    isRead: true,
    link: '/feed/3'
  },
]

const categories = [
  { id: 'all', name: '전체' },
  { id: 'post', name: '게시글' },
  { id: 'activity', name: '친구' },
  { id: 'schedule', name: '활동' },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)
  const [hasUnread, setHasUnread] = useState(true)

  // 페이지 입장 시 모든 알림 읽음 처리
  useEffect(() => {
    // 실제로는 API 호출로 처리
    const timer = setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setHasUnread(false)
    }, 1000) // 1초 후 읽음 처리 (시각적 효과를 위해)

    return () => clearTimeout(timer)
  }, [])

  // 카테고리별 필터링
  const filteredNotifications = notifications.filter(notification => {
    if (activeCategory === 'all') return true
    return notification.type === activeCategory
  })

  // 시간 포맷팅 함수
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const months = Math.floor(days / 30)

    if (minutes < 60) {
      return `${minutes}분 이전`
    } else if (hours < 24) {
      const hour = date.getHours()
      const minute = date.getMinutes()
      const period = hour < 12 ? '오전' : '오후'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${period} ${displayHour}시 ${minute}분`
    } else if (days < 30) {
      return `${days}일 전`
    } else {
      return `${months}개월 전`
    }
  }

  // 알림 내용 truncate (16자)
  const truncateContent = (content: string) => {
    if (content.length > 24) {
      return content.slice(0, 24) + '...'
    }
    return content
  }

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#151515" strokeWidth="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="#151515" strokeWidth="2"/>
            <line x1="9" y1="4" x2="9" y2="2" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
            <line x1="15" y1="4" x2="15" y2="2" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'activity':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="#151515" strokeWidth="2"/>
            <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'post':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#151515" strokeWidth="2"/>
            <line x1="8" y1="9" x2="16" y2="9" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="13" x2="14" y2="13" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      default:
        return null
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles.title}>알림 센터</h1>
        </div>
        <button className={styles.notificationButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {hasUnread && <span className={styles.notificationBadge}></span>}
        </button>
      </div>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${activeCategory === category.id ? styles.categoryTabActive : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>알림이 없습니다</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.isRead ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className={styles.notificationContent}>
                <p className={styles.notificationText}>
                  {truncateContent(notification.content)}
                </p>
                <span className={styles.notificationTime}>
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className={styles.tabBar}>
        <button className={styles.tabItem} onClick={() => router.push('/calendar')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>홈</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/feed')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V9" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>피드</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/ai')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8E8E93" strokeWidth="2"/>
            <circle cx="9" cy="10" r="1.5" fill="#8E8E93"/>
            <circle cx="15" cy="10" r="1.5" fill="#8E8E93"/>
            <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="2" x2="12" y2="4" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>AI</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/chat')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </div>
    </div>
  )
}

