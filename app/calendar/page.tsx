'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import AddScheduleModal from './AddScheduleModal'

// 일정 타입 정의
interface Schedule {
  id: number
  title: string
  company: string
  date: string
  time?: string
  stage: '서류' | '코테' | '면접' | '개인일정' | '기타'
  dDay: number
  alarmDays: number
}

// 할일 타입 정의
interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Calendar() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // 예시 일정 데이터
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      title: '카카오 서류 마감',
      company: '카카오',
      date: '2025.01.05',
      time: '17:00',
      stage: '서류',
      dDay: 0,
      alarmDays: 3
    },
    {
      id: 2,
      title: '알고리즘 스터디',
      company: '개인',
      date: '2025.01.08',
      stage: '개인일정',
      dDay: 3,
      alarmDays: 1
    },
    {
      id: 3,
      title: '네이버 코딩테스트',
      company: '네이버',
      date: '2025.01.10',
      stage: '코테',
      dDay: 5,
      alarmDays: 1
    },
    {
      id: 4,
      title: '포트폴리오 작성',
      company: '개인',
      date: '2025.01.10~2025.01.20',
      stage: '기타',
      dDay: 15,
      alarmDays: 5
    }
  ])

  // 할일 목록
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '프로그래머스 1문제 풀기', completed: false },
    { id: 2, text: 'CS 면접 질문 정리', completed: false },
    { id: 3, text: '이력서 최종 검토', completed: true }
  ])

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // 주간 뷰를 위한 현재 주의 날짜들
  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    startOfWeek.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  // 주차 계산
  const getWeekNumber = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const pastDaysOfMonth = (date.getDate() + firstDayOfMonth.getDay() - 1) / 7
    return Math.ceil(pastDaysOfMonth)
  }

  // 할일 토글
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 진행률 계산
  const completedTodos = todos.filter(todo => todo.completed).length
  const progressPercentage = (completedTodos / todos.length) * 100

  // 일정 추가 핸들러
  const handleAddSchedule = (scheduleData: any) => {
    const newSchedule: Schedule = {
      id: schedules.length + 1,
      title: scheduleData.title,
      company: scheduleData.company,
      date: scheduleData.startDate,
      time: scheduleData.startTime || undefined,
      stage: scheduleData.stage as Schedule['stage'],
      dDay: Math.ceil((new Date(scheduleData.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      alarmDays: scheduleData.alarms?.[0]?.value || 1
    }
    setSchedules([...schedules, newSchedule])
  }

  // D-Day 뱃지 색상 결정
  const getDDayStyle = (dDay: number) => {
    if (dDay === 0) return styles.dDayUrgent
    if (dDay <= 3) return styles.dDaySoon
    return styles.dDayNormal
  }

  // 월/년 포맷
  const formatMonthYear = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  // 주간 포맷
  const formatWeekRange = (date: Date) => {
    const weekNum = getWeekNumber(date)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekNum}주차`
  }

  // 월간 달력 렌더링
  const renderMonthlyCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    // 빈 셀 추가 (월요일 시작)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>)
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() && 
        currentDate.getFullYear() === new Date().getFullYear()
      
      const isSelected = 
        day === selectedDate.getDate() && 
        currentDate.getMonth() === selectedDate.getMonth() && 
        currentDate.getFullYear() === selectedDate.getFullYear()

      days.push(
        <div 
          key={day} 
          className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          {day}
        </div>
      )
    }

    return (
      <div className={styles.calendarGrid}>
        <div className={styles.weekdays}>
          {weekdays.map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>
        <div className={styles.days}>
          {days}
        </div>
      </div>
    )
  }

  // 주간 달력 렌더링
  const renderWeeklyCalendar = () => {
    const weekDates = getWeekDates()
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
      <div className={styles.weeklyGrid}>
        {weekdays.map((dayName, index) => {
          const date = weekDates[index]
          const isToday = date.toDateString() === new Date().toDateString()
          const isSelected = date.toDateString() === selectedDate.toDateString()

          return (
            <div key={dayName} className={styles.weeklyDay}>
              <div className={styles.weekdayLabel}>{dayName}</div>
              <div 
                className={`${styles.weeklyDate} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <main className={styles.container}>
      {/* 상단 툴바 */}
      <header className={styles.toolbar}>
        <h1 className={styles.logo}>Devths</h1>
        <button className={styles.notificationBtn} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <div className={styles.content}>
        {/* 헤더 섹션 */}
        <section className={styles.headerSection}>
          <h2 className={styles.mainTitle}>취업 일정 관리</h2>
          <p className={styles.subtitle}>채용 일정을 한눈에 관리하세요</p>
        </section>

        {/* 월간/주간 토글 및 버튼 영역 */}
        <div className={styles.controlsRow}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'monthly' ? styles.toggleActive : ''}`}
              onClick={() => setViewMode('monthly')}
            >
              월간
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'weekly' ? styles.toggleActive : ''}`}
              onClick={() => setViewMode('weekly')}
            >
              주간
            </button>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              일정 추가
            </button>
            <button className={styles.filterButton}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              필터 열기
            </button>
          </div>
        </div>

        {/* 캘린더 영역 */}
        <section className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <span className={styles.monthYear}>
              {viewMode === 'monthly' ? formatMonthYear(currentDate) : formatWeekRange(currentDate)}
            </span>
            <div className={styles.navButtons}>
              <button 
                className={styles.navBtn} 
                onClick={viewMode === 'monthly' ? goToPrevMonth : goToPrevWeek}
                aria-label="이전"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={styles.navBtn} 
                onClick={viewMode === 'monthly' ? goToNextMonth : goToNextWeek}
                aria-label="다음"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          {viewMode === 'monthly' ? renderMonthlyCalendar() : renderWeeklyCalendar()}
        </section>

        {/* 다가오는 일정 */}
        <section className={styles.upcomingSection}>
          <h3 className={styles.sectionTitle}>다가오는 일정</h3>
          <div className={styles.scheduleList}>
            {schedules.map(schedule => (
              <div key={schedule.id} className={styles.scheduleCard}>
                <div className={styles.scheduleInfo}>
                  <div className={styles.scheduleTags}>
                    <span className={styles.stageTag}>{schedule.stage}</span>
                    {schedule.dDay <= 3 && (
                      <span className={styles.urgentTag}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="6" cy="6" r="5" fill="#FF4444"/>
                        </svg>
                        임박
                      </span>
                    )}
                  </div>
                  <h4 className={styles.scheduleTitle}>{schedule.title}</h4>
                  <div className={styles.scheduleMeta}>
                    <span className={styles.company}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 14V4.66667C14 4.31305 13.8595 3.97391 13.6095 3.72386C13.3594 3.47381 13.0203 3.33333 12.6667 3.33333H8.66667V2H14V14Z" fill="#4a5565"/>
                        <path d="M2 14V4.66667C2 4.31305 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H7.33333V14H2Z" fill="#4a5565"/>
                      </svg>
                      {schedule.company}
                    </span>
                    <span className={styles.dateTime}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="12" height="11" rx="1" stroke="#4a5565" strokeWidth="1.5"/>
                        <path d="M5 2V4M11 2V4M2 6H14" stroke="#4a5565" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {schedule.date}{schedule.time && ` ${schedule.time}`}
                    </span>
                  </div>
                </div>
                <div className={styles.dDayInfo}>
                  <span className={`${styles.dDayBadge} ${getDDayStyle(schedule.dDay)}`}>
                    {schedule.dDay === 0 ? 'D-Day' : `D-${schedule.dDay}`}
                  </span>
                  <span className={styles.alarmInfo}>{schedule.alarmDays}일 전 알림</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 오늘 할 일 */}
        <section className={styles.todoSection}>
          <div className={styles.todoHeader}>
            <h3 className={styles.sectionTitle}>오늘 할 일</h3>
          </div>
          <div className={styles.todoCard}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className={styles.todoList}>
              {todos.map(todo => (
                <div key={todo.id} className={styles.todoItem}>
                  <button 
                    className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? '완료 취소' : '완료'}
                  >
                    {todo.completed && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 하단 탭 바 */}
      <nav className={styles.tabBar}>
        <button className={`${styles.tabItem} ${styles.tabActive}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

      {/* 일정 추가 모달 */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSchedule}
      />
    </main>
  )
}

