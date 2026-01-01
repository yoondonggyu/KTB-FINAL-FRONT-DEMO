'use client'

import { useState } from 'react'
import styles from './AddScheduleModal.module.css'

interface AddScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (schedule: ScheduleFormData) => void
}

interface ScheduleFormData {
  stage: string
  title: string
  company: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  isAllDay: boolean
  description: string
  tags: string[]
  alarms: Alarm[]
}

interface Alarm {
  id: number
  value: number
  unit: '일' | '시간' | '분'
}

const STAGES = ['서류', '코테', '1차 면접', '2차 면접', '개인일정']

export default function AddScheduleModal({ isOpen, onClose, onAdd }: AddScheduleModalProps) {
  const [stage, setStage] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('11:00')
  const [isAllDay, setIsAllDay] = useState(true)
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [alarms, setAlarms] = useState<Alarm[]>([{ id: 1, value: 3, unit: '일' }])
  const [aiText, setAiText] = useState('')

  // 오늘 날짜 포맷
  const today = new Date()
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // 날짜 표시 포맷
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // 알림 추가
  const handleAddAlarm = () => {
    const newId = alarms.length > 0 ? Math.max(...alarms.map(a => a.id)) + 1 : 1
    setAlarms([...alarms, { id: newId, value: 1, unit: '일' }])
  }

  // 알림 삭제
  const handleRemoveAlarm = (id: number) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id))
  }

  // 알림 값 변경
  const handleAlarmValueChange = (id: number, value: number) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, value } : alarm
    ))
  }

  // 알림 단위 변경
  const handleAlarmUnitChange = (id: number, unit: '일' | '시간' | '분') => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, unit } : alarm
    ))
  }

  // 폼 유효성 검사
  const isFormValid = stage && title && company && startDate

  // 폼 제출
  const handleSubmit = () => {
    if (!isFormValid) return

    const scheduleData: ScheduleFormData = {
      stage,
      title,
      company,
      startDate,
      startTime: isAllDay ? '' : startTime,
      endDate: endDate || startDate,
      endTime: isAllDay ? '' : endTime,
      isAllDay,
      description,
      tags,
      alarms
    }

    onAdd(scheduleData)
    handleReset()
    onClose()
  }

  // 폼 초기화
  const handleReset = () => {
    setStage('')
    setTitle('')
    setCompany('')
    setStartDate('')
    setStartTime('10:00')
    setEndDate('')
    setEndTime('11:00')
    setIsAllDay(true)
    setDescription('')
    setTags([])
    setTagInput('')
    setAlarms([{ id: 1, value: 3, unit: '일' }])
    setAiText('')
  }

  // AI 분석 (TODO: 실제 AI 연동)
  const handleAiAnalyze = () => {
    console.log('AI 분석 시작:', aiText)
    // TODO: AI API 연동
    alert('AI 분석 기능은 추후 구현 예정입니다.')
  }

  // 파일 첨부 (TODO: 실제 파일 업로드)
  const handleFileAttach = () => {
    // TODO: 파일 업로드 구현
    alert('파일 첨부 기능은 추후 구현 예정입니다.')
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>일정 추가</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* AI 자동 추가 섹션 */}
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="#000" strokeWidth="1.5"/>
                <circle cx="10" cy="7" r="2" fill="#000"/>
                <path d="M6 12H14M6 15H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>AI로 자동 추가 (채용 공고 텍스트 입력)</span>
            </div>
            <textarea
              className={styles.aiTextarea}
              placeholder="채용 공고 이미지나 내용을 입력하세요..."
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
            />
            <div className={styles.aiButtons}>
              <button className={styles.attachBtn} onClick={handleFileAttach}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 9.58333L10.2083 16.875C9.27575 17.8076 7.99447 18.3333 6.65833 18.3333C5.3222 18.3333 4.04092 17.8076 3.10833 16.875C2.17575 15.9424 1.65002 14.6611 1.65002 13.325C1.65002 11.9889 2.17575 10.7076 3.10833 9.775L10.4 2.48333C11.0218 1.86155 11.8668 1.51044 12.75 1.51044C13.6332 1.51044 14.4782 1.86155 15.1 2.48333C15.7218 3.10512 16.0729 3.95015 16.0729 4.83333C16.0729 5.71652 15.7218 6.56155 15.1 7.18333L7.8 14.475C7.48911 14.7859 7.06659 14.9614 6.625 14.9614C6.18341 14.9614 5.76089 14.7859 5.45 14.475C5.13911 14.1641 4.96355 13.7416 4.96355 13.3C4.96355 12.8584 5.13911 12.4359 5.45 12.125L12.15 5.43333" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                파일 첨부
              </button>
              <button className={styles.analyzeBtn} onClick={handleAiAnalyze}>
                AI 분석하기
              </button>
            </div>
          </div>

          {/* 단계 선택 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              단계<span className={styles.required}>*</span>
            </label>
            <div className={styles.stageButtons}>
              {STAGES.map((s) => (
                <button
                  key={s}
                  className={`${styles.stageBtn} ${stage === s ? styles.stageBtnActive : ''}`}
                  onClick={() => setStage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 일정 제목 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              일정 제목<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="예: 카카오 서류 마감"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 회사명 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              회사명<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="예: 카카오"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* 날짜 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              날짜<span className={styles.required}>*</span>
            </label>
            <div className={styles.allDayRow}>
              <span>종일</span>
              <button 
                className={`${styles.toggle} ${isAllDay ? styles.toggleActive : ''}`}
                onClick={() => setIsAllDay(!isAllDay)}
                aria-label="종일 토글"
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
            <div className={styles.dateTimeRow}>
              <input
                type="date"
                className={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {!isAllDay && (
                <input
                  type="time"
                  className={styles.timeInput}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              )}
            </div>
            <div className={styles.dateTimeRow}>
              <input
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="종료일 (선택)"
              />
              {!isAllDay && (
                <input
                  type="time"
                  className={styles.timeInput}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* 설명 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>설명</label>
            <textarea
              className={styles.textarea}
              placeholder="일정에 대한 추가 설명을 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 해시태그 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>해시태그</label>
            <div className={styles.tagInputRow}>
              <input
                type="text"
                className={styles.tagInput}
                placeholder="최대 5개의 태그를 입력할 수 있습니다."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button className={styles.addTagBtn} onClick={handleAddTag}>
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className={styles.tagList}>
                <span className={styles.tagLabel}>태그:</span>
                {tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button 
                      className={styles.tagRemoveBtn}
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`${tag} 태그 삭제`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3L3 9M3 3L9 9" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 알림 설정 */}
          <div className={styles.formGroup}>
            <div className={styles.alarmHeader}>
              <label className={styles.label}>알림 설정</label>
              <button className={styles.addAlarmBtn} onClick={handleAddAlarm} aria-label="알림 추가">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {alarms.map((alarm) => (
              <div key={alarm.id} className={styles.alarmRow}>
                <input
                  type="number"
                  className={styles.alarmValueInput}
                  value={alarm.value}
                  onChange={(e) => handleAlarmValueChange(alarm.id, parseInt(e.target.value) || 0)}
                  min={1}
                />
                <select
                  className={styles.alarmUnitSelect}
                  value={alarm.unit}
                  onChange={(e) => handleAlarmUnitChange(alarm.id, e.target.value as '일' | '시간' | '분')}
                >
                  <option value="분">분</option>
                  <option value="시간">시간</option>
                  <option value="일">일</option>
                </select>
                <span className={styles.alarmText}>전 알림</span>
                <button 
                  className={styles.removeAlarmBtn} 
                  onClick={() => handleRemoveAlarm(alarm.id)}
                  aria-label="알림 삭제"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonRow}>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button 
              className={`${styles.submitBtn} ${!isFormValid ? styles.submitBtnDisabled : ''}`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

