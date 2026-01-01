'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface Comment {
  id: string
  author: string
  authorInitial: string
  timestamp: string
  content: string
  replies?: Comment[]
}

export default function PostDetailPage() {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(124)
  const [commentText, setCommentText] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock data
  const post = {
    id: '1',
    author: '김개발',
    authorInitial: '김',
    authorTag: '#프론트엔드',
    timestamp: '2시간 전',
    title: '카카오 프론트엔드 1차 코테 후기',
    content: '오늘 카카오 공채 1차 코딩테스트 봤습니다. 3문제 출제됐고 난이도는 어려운 편이었습니다.',
    tag: '코딩테스트',
    commentCount: 23,
    shareCount: 8,
  }

  const comments: Comment[] = [
    {
      id: '1',
      author: '김개발',
      authorInitial: '김',
      timestamp: '1시간 전',
      content: '정말 유용한 정보네요! 저도 도전해봐야겠어요',
      replies: [],
    },
    {
      id: '2',
      author: '이백엔드',
      authorInitial: '이',
      timestamp: '2시간 전',
      content: '혹시 난이도는 어느정도였나요?',
      replies: [
        {
          id: '2-1',
          author: '김개발',
          authorInitial: '김',
          timestamp: '1시간 전',
          content: '프로그래머스 Lv2~Lv3 정도였습니다',
        },
      ],
    },
  ]

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1)
    } else {
      setLikeCount(prev => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareModal(false)
    // TODO: Show toast notification
  }

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // TODO: API call to submit comment
      console.log('댓글 등록:', commentText)
      setCommentText('')
    }
  }

  return (
    <div className={styles.container}>
      {/* Header / Toolbar */}
      <div className={styles.toolbar}>
        <button onClick={() => router.back()} className={styles.backButton} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.logo}>Devths</span>
        <div className={styles.toolbarActions}>
          <button className={styles.iconButton} aria-label="검색">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="알림" onClick={() => router.push('/notifications')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content Section */}
      <div className={styles.postSection}>
        {/* Author Info */}
        <div className={styles.authorRow}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>
              <span>{post.authorInitial}</span>
            </div>
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{post.author}</span>
              <span className={styles.authorTag}>{post.authorTag}</span>
              <span className={styles.timestamp}>{post.timestamp}</span>
            </div>
          </div>
          <button className={styles.moreButton} aria-label="더보기">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="4" r="1.5" fill="#6A7282"/>
              <circle cx="10" cy="10" r="1.5" fill="#6A7282"/>
              <circle cx="10" cy="16" r="1.5" fill="#6A7282"/>
            </svg>
          </button>
        </div>

        {/* Post Title */}
        <h1 className={styles.postTitle}>{post.title}</h1>

        {/* Post Content */}
        <p className={styles.postContent}>{post.content}</p>

        {/* Tag */}
        <div className={styles.tagContainer}>
          <span className={styles.tag}>{post.tag}</span>
        </div>

        {/* Interaction Buttons */}
        <div className={styles.interactionRow}>
          <div className={styles.interactionButtons}>
            <button
              className={`${styles.interactionButton} ${isLiked ? styles.interactionButtonActive : ''}`}
              onClick={handleLike}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill={isLiked ? "#EF4444" : "none"} xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 6.1875C15.75 4.32555 14.2245 2.8125 12.3469 2.8125C10.9406 2.8125 9.72656 3.675 9.1875 4.875C8.64844 3.675 7.43437 2.8125 6.02812 2.8125C4.15547 2.8125 2.625 4.32555 2.625 6.1875C2.625 10.4437 9.1875 15.1875 9.1875 15.1875C9.1875 15.1875 15.75 10.4437 15.75 6.1875Z" stroke={isLiked ? "#EF4444" : "#4A5565"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{likeCount}</span>
            </button>
            <button className={styles.interactionButton}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 8.625C15.7531 9.65918 15.5045 10.6787 15.0254 11.5957C14.4609 12.7012 13.6131 13.6261 12.5689 14.2852C11.5247 14.9443 10.3241 15.3132 9.09609 15.3535C8.06191 15.3566 7.04236 15.108 6.12539 14.6289L2.25 15.75L3.37109 11.8746C2.89199 10.9576 2.64339 9.93809 2.64649 8.90391C2.68676 7.67589 3.05566 6.47527 3.71475 5.43109C4.37384 4.3869 5.29881 3.53909 6.40429 2.97461C7.32127 2.49551 8.34082 2.24691 9.375 2.25H9.75C11.3848 2.34141 12.9289 3.02969 14.0746 4.17539C15.2203 5.32109 15.9086 6.86523 16 8.5V8.875L15.75 8.625Z" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{post.commentCount}</span>
            </button>
            <button className={styles.interactionButton} onClick={handleShare}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 6C14.7426 6 15.75 4.99264 15.75 3.75C15.75 2.50736 14.7426 1.5 13.5 1.5C12.2574 1.5 11.25 2.50736 11.25 3.75C11.25 4.99264 12.2574 6 13.5 6Z" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.5 11.25C5.74264 11.25 6.75 10.2426 6.75 9C6.75 7.75736 5.74264 6.75 4.5 6.75C3.25736 6.75 2.25 7.75736 2.25 9C2.25 10.2426 3.25736 11.25 4.5 11.25Z" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 16.5C14.7426 16.5 15.75 15.4926 15.75 14.25C15.75 13.0074 14.7426 12 13.5 12C12.2574 12 11.25 13.0074 11.25 14.25C11.25 15.4926 12.2574 16.5 13.5 16.5Z" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.44531 10.1328L11.5625 13.1172" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5547 4.88281L6.44531 7.86719" stroke="#4A5565" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{post.shareCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className={styles.securityNotice}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8.8 12H7.2V7.2H8.8V12ZM8.8 5.6H7.2V4H8.8V5.6Z" fill="#6A7282"/>
        </svg>
        <span>개인정보(연락처, 계좌번호 등) 공유에 주의하세요</span>
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>댓글 {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}개</h2>
        
        <div className={styles.commentsList}>
          {comments.map(comment => (
            <div key={comment.id} className={styles.commentThread}>
              {/* Main Comment */}
              <div className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div className={styles.commentAvatar}>
                    <span>{comment.authorInitial}</span>
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentMeta}>
                      <div className={styles.commentMetaLeft}>
                        <span className={styles.commentAuthor}>{comment.author}</span>
                        <span className={styles.commentTime}>{comment.timestamp}</span>
                      </div>
                      <button className={styles.commentMoreButton} aria-label="더보기">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="7" cy="3" r="1" fill="#6A7282"/>
                          <circle cx="7" cy="7" r="1" fill="#6A7282"/>
                          <circle cx="7" cy="11" r="1" fill="#6A7282"/>
                        </svg>
                      </button>
                    </div>
                    <p className={styles.commentContent}>{comment.content}</p>
                    <button className={styles.replyButton}>답글</button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className={styles.repliesContainer}>
                  {comment.replies.map(reply => (
                    <div key={reply.id} className={styles.replyCard}>
                      <div className={styles.commentHeader}>
                        <div className={styles.replyAvatar}>
                          <span>{reply.authorInitial}</span>
                        </div>
                        <div className={styles.commentBody}>
                          <div className={styles.commentMeta}>
                            <div className={styles.commentMetaLeft}>
                              <span className={styles.replyAuthor}>{reply.author}</span>
                              <span className={styles.replyTime}>{reply.timestamp}</span>
                            </div>
                            <button className={styles.commentMoreButton} aria-label="더보기">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="6" cy="2.5" r="0.8" fill="#6A7282"/>
                                <circle cx="6" cy="6" r="0.8" fill="#6A7282"/>
                                <circle cx="6" cy="9.5" r="0.8" fill="#6A7282"/>
                              </svg>
                            </button>
                          </div>
                          <p className={styles.replyContent}>{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className={styles.commentInputContainer}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className={styles.commentInput}
        />
        <button
          className={`${styles.commentSubmitButton} ${commentText.trim() ? styles.commentSubmitButtonActive : ''}`}
          onClick={handleCommentSubmit}
          disabled={!commentText.trim()}
        >
          등록
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.shareModalTitle}>게시물 공유</h3>
            <p className={styles.shareModalDescription}>게시물 링크를 복사하여 공유할 수 있습니다.</p>
            <div className={styles.shareLinkBox}>
              <p className={styles.shareLink}>{typeof window !== 'undefined' ? window.location.href : ''}</p>
            </div>
            <div className={styles.shareModalButtons}>
              <button className={styles.cancelButton} onClick={() => setShowShareModal(false)}>
                취소
              </button>
              <button className={styles.copyButton} onClick={handleCopyLink}>
                링크 복사
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className={styles.tabBar}>
        <button className={styles.tabItem} onClick={() => router.push('/calendar')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>홈</span>
        </button>
        <button className={`${styles.tabItem} ${styles.tabItemActive}`} onClick={() => router.push('/feed')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21M9 21V9" stroke="#151515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>피드</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/ai')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8A8A8A" strokeWidth="2"/>
            <circle cx="12" cy="8" r="2" fill="#8A8A8A"/>
            <path d="M8 14H16M8 18H12" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>AI</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/chat')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V9C21 8.46957 20.7893 7.96086 20.4142 7.58579C20.0391 7.21071 19.5304 7 19 7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H19C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10H17" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14H13" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>채팅</span>
        </button>
        <button className={styles.tabItem} onClick={() => router.push('/profile')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12C7.58172 12 4 15.5817 4 20H20C20 15.5817 16.4183 12 12 12Z" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>프로필</span>
        </button>
      </div>
    </div>
  )
}

