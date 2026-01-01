'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)
  
  const slides = [
    {
      id: 1,
      title: 'Devths',
      description: '설명 1',
    },
    {
      id: 2,
      title: 'Devths',
      description: '설명 2,3, ...',
    }
  ]

  // 5초 자동 전환 기능 (기능 1)
  useEffect(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current)
    }
    
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [currentSlide, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // 터치 이벤트 핸들러 (스와이프 기능)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      nextSlide()
    } else if (distance < -minSwipeDistance) {
      prevSlide()
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  // 마우스 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== 0) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      nextSlide()
    } else if (distance < -minSwipeDistance) {
      prevSlide()
    }
    
    setTouchStart(0)
    setTouchEnd(0)
  }

  // 구글 OAuth2 로그인/회원가입 핸들러 (기능 2)
  const handleStartClick = async () => {
    // TODO: 실제 구글 OAuth2 구현 필요
    // 현재는 회원가입 페이지로 이동 (테스트용)
    // 실제 구현 시: 구글 로그인 -> 신규 사용자면 회원가입 페이지, 기존 사용자면 메인 페이지로 이동
    router.push('/signup')
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* 헤더 */}
        <h1 className={styles.title}>Devths</h1>

        {/* 서비스 설명 영역 (기능 1) */}
        <div className={styles.imageContainer}>
          <div 
            className={styles.imageWrapper}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className={styles.imagePlaceholder}>
              <div className={styles.imageContent}>
                <span className={styles.slideTitle}>{slides[currentSlide].title}</span>
                <span className={styles.slideDescription}>{slides[currentSlide].description}</span>
              </div>
            </div>
          </div>

          {/* 도트 네비게이션 */}
          <div className={styles.sliderControls}>
            <div className={styles.dots}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.dotActive : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
            <div className={styles.progressIndicator} />
          </div>
        </div>

        {/* 시작하기 버튼 (기능 2) */}
        <button 
          className={styles.startButton}
          onClick={handleStartClick}
          aria-label="구글 로그인으로 시작하기"
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          시작하기
        </button>
      </div>
    </main>
  )
}
