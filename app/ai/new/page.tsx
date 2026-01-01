'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function AINewChatPage() {
  const router = useRouter()
  
  // 이력서/포트폴리오 상태
  const [resumeText, setResumeText] = useState('')
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const resumeFileInputRef = useRef<HTMLInputElement>(null)
  
  // 채용 공고 상태
  const [jobPostingText, setJobPostingText] = useState('')
  const [jobPostingFiles, setJobPostingFiles] = useState<File[]>([])
  const jobPostingFileInputRef = useRef<HTMLInputElement>(null)
  
  // 로딩 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // 에러 모달 상태
  const [errorModal, setErrorModal] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: ''
  })

  // 파일 유효성 검사
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    
    if (file.size > maxSize) {
      return { valid: false, error: '파일 용량 초과' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: '지원하지 않는 파일 형식' }
    }
    
    return { valid: true }
  }

  // 이력서 파일 첨부
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: File[] = []
    
    for (const file of files) {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        setErrorModal({
          show: true,
          title: validation.error || '파일 오류',
          message: validation.error === '파일 용량 초과' 
            ? '첨부 가능한 최대 용량은 5MB입니다. 다른 파일을 선택해 주세요.'
            : '첨부 가능한 형식은 PDF, JPG, JPEG, PNG입니다. 다른 파일을 선택해 주세요.'
        })
        return
      }
    }
    
    // 이미지는 최대 9장, PDF는 최대 1개
    const imageCount = validFiles.filter(f => f.type.startsWith('image/')).length
    const pdfCount = validFiles.filter(f => f.type === 'application/pdf').length
    
    if (imageCount > 9) {
      setErrorModal({
        show: true,
        title: '이미지 개수 초과',
        message: '한 번에 첨부 가능한 최대 이미지 수는 9장입니다.'
      })
      return
    }
    
    if (pdfCount > 1) {
      setErrorModal({
        show: true,
        title: '파일 개수 초과',
        message: '한 번에 첨부 가능한 PDF 파일의 수는 1개입니다.'
      })
      return
    }
    
    setResumeFiles(validFiles)
  }

  // 채용 공고 파일 첨부
  const handleJobPostingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: File[] = []
    
    for (const file of files) {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        setErrorModal({
          show: true,
          title: validation.error || '파일 오류',
          message: validation.error === '파일 용량 초과' 
            ? '첨부 가능한 최대 용량은 5MB입니다. 다른 파일을 선택해 주세요.'
            : '첨부 가능한 형식은 PDF, JPG, JPEG, PNG입니다. 다른 파일을 선택해 주세요.'
        })
        return
      }
    }
    
    const imageCount = validFiles.filter(f => f.type.startsWith('image/')).length
    const pdfCount = validFiles.filter(f => f.type === 'application/pdf').length
    
    if (imageCount > 9) {
      setErrorModal({
        show: true,
        title: '이미지 개수 초과',
        message: '한 번에 첨부 가능한 최대 이미지 수는 9장입니다.'
      })
      return
    }
    
    if (pdfCount > 1) {
      setErrorModal({
        show: true,
        title: '파일 개수 초과',
        message: '한 번에 첨부 가능한 PDF 파일의 수는 1개입니다.'
      })
      return
    }
    
    setJobPostingFiles(validFiles)
  }

  // 파일 삭제
  const removeResumeFile = (index: number) => {
    setResumeFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeJobPostingFile = (index: number) => {
    setJobPostingFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 분석 시작
  const handleAnalyze = async () => {
    if (!resumeText && resumeFiles.length === 0) {
      setErrorModal({
        show: true,
        title: '입력 필요',
        message: '이력서 또는 포트폴리오를 입력해주세요.'
      })
      return
    }
    
    if (!jobPostingText && jobPostingFiles.length === 0) {
      setErrorModal({
        show: true,
        title: '입력 필요',
        message: '채용 공고를 입력해주세요.'
      })
      return
    }
    
    setIsAnalyzing(true)
    
    // TODO: 실제 API 호출
    // 임시로 3초 후 분석 완료 시뮬레이션
    setTimeout(() => {
      setIsAnalyzing(false)
      // 분석 완료 후 채팅 페이지로 이동
      router.push('/ai/chat/new')
    }, 3000)
  }

  const isFormValid = (resumeText || resumeFiles.length > 0) && (jobPostingText || jobPostingFiles.length > 0)

  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <header className={styles.toolbar}>
        <button className={styles.backButton} onClick={() => router.back()} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.logo}>Devths</h1>
        <button className={styles.iconButton} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      {/* Content */}
      <div className={styles.content}>
        {/* 이력서 및 포트폴리오 입력 섹션 */}
        <section className={styles.inputSection}>
          <h2 className={styles.sectionTitle}>이력서 및 포트폴리오 입력</h2>
          <div className={styles.inputBox}>
            <div className={styles.inputHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#000000" strokeWidth="2"/>
                <circle cx="12" cy="8" r="2" fill="#000000"/>
                <path d="M8 14H16M8 18H12" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.inputHeaderText}>AI로 분석하기(이미지, 텍스트, 파일 입력)</span>
            </div>
            <textarea
              className={styles.textArea}
              placeholder="이력서나 포트폴리오 내용을 입력하세요..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            
            {/* 첨부된 파일 목록 */}
            {resumeFiles.length > 0 && (
              <div className={styles.fileList}>
                {resumeFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button 
                      className={styles.removeFileButton}
                      onClick={() => removeResumeFile(index)}
                      aria-label="파일 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.attachmentRow}>
              <button 
                className={styles.attachButton}
                onClick={() => resumeFileInputRef.current?.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42102 14.0991 1.99219 15.1625 1.98867C16.2259 1.98515 17.2472 2.40723 18.0028 3.16114C18.7584 3.91504 19.183 4.93527 19.1823 5.99869C19.1816 7.06211 18.7558 8.08179 18 8.835L9.41 17.41C9.0327 17.7872 8.52186 17.9987 7.99 17.9987C7.45814 17.9987 6.9473 17.7872 6.57 17.41C6.19282 17.0327 5.98131 16.5219 5.98131 15.99C5.98131 15.4581 6.19282 14.9473 6.57 14.57L15.14 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>파일 첨부</span>
              </button>
              <input
                ref={resumeFileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleResumeFileChange}
                className={styles.hiddenInput}
              />
            </div>
          </div>
        </section>

        {/* 채용 공고 입력 섹션 */}
        <section className={styles.inputSection}>
          <h2 className={styles.sectionTitle}>채용 공고 입력</h2>
          <div className={styles.inputBox}>
            <div className={styles.inputHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#000000" strokeWidth="2"/>
                <circle cx="12" cy="8" r="2" fill="#000000"/>
                <path d="M8 14H16M8 18H12" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.inputHeaderText}>AI로 분석하기(이미지, 텍스트, 파일 입력)</span>
            </div>
            <textarea
              className={styles.textArea}
              placeholder="채용 공고 이미지나 내용을 입력하세요..."
              value={jobPostingText}
              onChange={(e) => setJobPostingText(e.target.value)}
            />
            
            {/* 첨부된 파일 목록 */}
            {jobPostingFiles.length > 0 && (
              <div className={styles.fileList}>
                {jobPostingFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button 
                      className={styles.removeFileButton}
                      onClick={() => removeJobPostingFile(index)}
                      aria-label="파일 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className={styles.attachmentRow}>
              <button 
                className={styles.attachButton}
                onClick={() => jobPostingFileInputRef.current?.click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42102 14.0991 1.99219 15.1625 1.98867C16.2259 1.98515 17.2472 2.40723 18.0028 3.16114C18.7584 3.91504 19.183 4.93527 19.1823 5.99869C19.1816 7.06211 18.7558 8.08179 18 8.835L9.41 17.41C9.0327 17.7872 8.52186 17.9987 7.99 17.9987C7.45814 17.9987 6.9473 17.7872 6.57 17.41C6.19282 17.0327 5.98131 16.5219 5.98131 15.99C5.98131 15.4581 6.19282 14.9473 6.57 14.57L15.14 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>파일 첨부</span>
              </button>
              <input
                ref={jobPostingFileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleJobPostingFileChange}
                className={styles.hiddenInput}
              />
            </div>
          </div>
        </section>

        {/* 보안 안내 */}
        <div className={styles.securityNotice}>
          <div className={styles.securityIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="#000000"/>
            </svg>
          </div>
          <div className={styles.securityContent}>
            <span className={styles.securityTitle}>보안 안내</span>
            <span className={styles.securityText}>연락처, 계좌번호, 주민번호 등 개인정보를 공유하지 마세요</span>
          </div>
        </div>

        {/* 분석 시작 버튼 */}
        <button 
          className={`${styles.analyzeButton} ${isFormValid ? styles.analyzeButtonActive : ''}`}
          onClick={handleAnalyze}
          disabled={!isFormValid || isAnalyzing}
        >
          이력서와 채용 공고 종합 분석 하기
        </button>
      </div>

      {/* 분석 중 모달 */}
      {isAnalyzing && (
        <div className={styles.modalOverlay}>
          <div className={styles.analyzingModal}>
            <div className={styles.analyzingContent}>
              <p className={styles.analyzingTitle}>AI 분석 중입니다.</p>
              <p className={styles.analyzingText}>
                회원님의<br/>
                이력서와 포트폴리오를 기반으로<br/>
                채용 공고를 분석하고 있어요.<br/><br/>
                잠시만 기다려주세요!
              </p>
            </div>
            <div className={styles.spinner}>
              <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.spinnerIcon}>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="#151515" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 에러 모달 */}
      {errorModal.show && (
        <div className={styles.modalOverlay} onClick={() => setErrorModal({ ...errorModal, show: false })}>
          <div className={styles.errorModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.errorModalHeader}>
              <h3 className={styles.errorModalTitle}>{errorModal.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setErrorModal({ ...errorModal, show: false })}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className={styles.errorModalText}>{errorModal.message}</p>
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
        <button className={`${styles.tabItem} ${styles.tabItemActive}`} onClick={() => router.push('/ai')}>
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

