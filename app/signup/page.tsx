'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface InterestCategory {
  id: string
  label: string
  selected: boolean
}

export default function SignupPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')
  const [helperText, setHelperText] = useState('')
  const [isNicknameValid, setIsNicknameValid] = useState(false)
  const [interests, setInterests] = useState<InterestCategory[]>([
    { id: 'backend', label: '백엔드', selected: false },
    { id: 'frontend', label: '프론트엔드', selected: false },
    { id: 'cloud', label: '클라우드', selected: false },
    { id: 'ai', label: 'AI', selected: false },
  ])
  const [showToast, setShowToast] = useState(false)

  // 닉네임 유효성 검사
  useEffect(() => {
    validateNickname(nickname)
  }, [nickname])

  const validateNickname = (value: string) => {
    // 빈 값
    if (!value) {
      setHelperText('')
      setIsNicknameValid(false)
      return
    }

    // 2자 미만
    if (value.length < 2) {
      setHelperText('*닉네임이 너무 짧습니다.')
      setIsNicknameValid(false)
      return
    }

    // 10자 초과
    if (value.length > 10) {
      setHelperText('*닉네임은 10자 이내여야 합니다.')
      setIsNicknameValid(false)
      return
    }

    // 띄어쓰기나 특수 문자
    const specialCharRegex = /[^a-zA-Z0-9가-힣]/
    if (specialCharRegex.test(value)) {
      setHelperText('*띄어쓰기와 특수 문자를 제거해주세요.')
      setIsNicknameValid(false)
      return
    }

    // 운영자, admin 관련 단어
    const forbiddenWords = ['admin', 'administrator', '운영자', '관리자']
    const lowerValue = value.toLowerCase()
    if (forbiddenWords.some(word => lowerValue.includes(word))) {
      setHelperText('*유효하지 않은 닉네임입니다.')
      setIsNicknameValid(false)
      return
    }

    // 유효성 검사 통과
    setHelperText('')
    setIsNicknameValid(true)
  }

  // 프로필 이미지 처리
  const handleProfileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 확인 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('사진 크기는 2MB 이하로 제한됩니다.')
      return
    }

    // 확장자 확인
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
      alert('jpg, jpeg, png 파일만 허용됩니다.')
      return
    }

    // 이미지 미리보기
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // 관심 분야 토글
  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.map(interest =>
        interest.id === id
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    )
  }

  // 시작하기 버튼 클릭
  const handleSubmit = async () => {
    if (!isNicknameValid) return

    // TODO: 실제 회원가입 API 호출
    console.log('회원가입 정보:', {
      profileImage,
      nickname,
      interests: interests.filter(i => i.selected).map(i => i.id)
    })

    // 토스트 메시지 표시
    setShowToast(true)
    
    // 1.5초 후 메인 페이지(캘린더)로 이동
    setTimeout(() => {
      setShowToast(false)
      router.push('/calendar')
    }, 1500)
  }

  // 기본 프로필 표시 (닉네임 첫 글자)
  const getDefaultProfile = () => {
    if (nickname) {
      return nickname.charAt(0).toUpperCase()
    }
    return '+'
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* 헤더 */}
        <h1 className={styles.title}>Devths</h1>

        {/* 프로필 사진 영역 */}
        <div className={styles.profileSection}>
          <label className={styles.profileLabel}>프로필 사진</label>
          <div 
            className={styles.profileCircle}
            onClick={handleProfileClick}
          >
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="프로필" 
                className={styles.profileImage}
              />
            ) : (
              <span className={styles.profileDefault}>
                {getDefaultProfile()}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>

        {/* 닉네임 입력 영역 */}
        <div className={styles.inputSection}>
          <label className={styles.inputLabel}>닉네임</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력해주세요(2~10자)"
              className={styles.input}
              maxLength={11}
            />
          </div>
          {helperText && (
            <span className={styles.helperText}>{helperText}</span>
          )}
        </div>

        {/* 관심 분야 선택 영역 */}
        <div className={styles.interestSection}>
          <label className={styles.interestLabel}>관심 분야를 선택해주세요!</label>
          <div className={styles.interestTags}>
            {interests.map((interest) => (
              <button
                key={interest.id}
                className={`${styles.interestTag} ${
                  interest.selected ? styles.interestTagSelected : ''
                }`}
                onClick={() => toggleInterest(interest.id)}
              >
                {interest.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <button
          className={`${styles.submitButton} ${
            isNicknameValid ? styles.submitButtonActive : ''
          }`}
          onClick={handleSubmit}
          disabled={!isNicknameValid}
        >
          시작하기
        </button>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={styles.toast}>
          회원가입이 완료되었습니다.
        </div>
      )}
    </main>
  )
}

