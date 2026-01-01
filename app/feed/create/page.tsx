'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

// 태그 옵션
const TAG_OPTIONS = ['이력서', '포트폴리오', '면접', '코딩테스트']

// 첨부파일 타입
interface AttachedFile {
  name: string
  size: number
  type: 'image' | 'file'
}

export default function CreatePost() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 태그 토글 (최대 4개)
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      }
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, tag]
    })
  }

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = e.target.files
    if (!files) return

    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type
    }))

    setAttachedFiles(prev => [...prev, ...newFiles])
    e.target.value = '' // Reset input
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // 파일 삭제
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 등록 버튼 활성화 조건
  const canSubmit = title.trim() !== '' && content.trim() !== ''

  // 게시글 등록
  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    try {
      // TODO: 실제 API 호출
      console.log('게시글 등록:', {
        title,
        content,
        tags: selectedTags,
        files: attachedFiles
      })

      // 성공 후 피드 목록으로 이동
      router.push('/feed')
    } catch (error) {
      console.error('게시글 등록 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 마크다운 미리보기 (간단한 변환)
  const renderMarkdownPreview = (text: string): string => {
    if (!text) return '<p style="color: #99a1af; font-style: italic;">미리보기할 내용이 없습니다. 편집 탭에서 내용을 입력하세요.</p>'
    
    // 간단한 마크다운 변환
    let html = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>')

    return html
  }

  return (
    <main className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles.headerTitle}>글쓰기</h1>
        </div>
        <button 
          className={`${styles.submitBtn} ${canSubmit ? styles.submitBtnActive : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
      </header>

      <div className={styles.content}>
        {/* 보안 안내 */}
        <div className={styles.securityNotice}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#000" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className={styles.securityText}>
            <span className={styles.securityTitle}>보안 안내</span>
            <span className={styles.securityDesc}>연락처, 계좌번호, 주민번호 등 개인정보를 공유하지 마세요</span>
          </div>
        </div>

        {/* 제목 입력 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>제목 *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 내용 입력 */}
        <div className={styles.inputGroup}>
          <div className={styles.contentHeader}>
            <label className={styles.label}>내용 *</label>
            <div className={styles.tabToggle}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'edit' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                편집
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'preview' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                미리보기
              </button>
            </div>
          </div>
          
          {activeTab === 'edit' ? (
            <textarea
              className={styles.textarea}
              placeholder={`마크다운으로 작성하세요...

예시:
# 제목
## 부제목
**굵게** *기울임*
- 목록
\`\`\`코드\`\`\`
> 인용
[링크](https://example.com)`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div 
              className={styles.preview}
              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
            />
          )}
        </div>

        {/* 태그 선택 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>태그 (최대 4개)</label>
          <div className={styles.tagList}>
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                className={`${styles.tagBtn} ${selectedTags.includes(tag) ? styles.tagBtnActive : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 첨부 */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>첨부</label>
          <div className={styles.attachmentBtns}>
            <button 
              className={styles.attachBtn}
              onClick={() => imageInputRef.current?.click()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#364153" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#364153"/>
                <path d="M21 15L16 10L5 21" stroke="#364153" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              사진 업로드
            </button>
            <button 
              className={styles.attachBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V8L14 2Z" stroke="#364153" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="#364153" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              파일 업로드
            </button>
          </div>

          {/* 첨부된 파일 목록 */}
          {attachedFiles.length > 0 && (
            <div className={styles.attachedFiles}>
              {attachedFiles.map((file, index) => (
                <div key={index} className={styles.attachedFile}>
                  <div className={styles.fileInfo}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {file.type === 'image' ? (
                        <>
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#364153" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="#364153"/>
                          <path d="M21 15L16 10L5 21" stroke="#364153" strokeWidth="2"/>
                        </>
                      ) : (
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V8L14 2Z" stroke="#364153" strokeWidth="2"/>
                      )}
                    </svg>
                    <div className={styles.fileDetails}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <button 
                    className={styles.removeFileBtn}
                    onClick={() => removeFile(index)}
                    aria-label="파일 삭제"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="#6a7282" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e, 'image')}
            className={styles.hiddenInput}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e, 'file')}
            className={styles.hiddenInput}
          />
        </div>
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
        <button className={`${styles.tabItem} ${styles.tabActive}`} onClick={() => router.push('/feed')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21M9 21V9" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    </main>
  )
}

