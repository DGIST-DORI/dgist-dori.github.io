import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const staticShowcaseConfig = [
  { bg: "bg-slate-800", videoSrc: `${import.meta.env.BASE_URL}assets/videos/video_0.mp4` },
  { bg: "bg-slate-700", videoSrc: `${import.meta.env.BASE_URL}assets/videos/video_1.mp4` },
  { bg: "bg-slate-900", videoSrc: `${import.meta.env.BASE_URL}assets/videos/video_2.mp4` },
  { bg: "bg-slate-900", videoSrc: `${import.meta.env.BASE_URL}assets/videos/video_3.mp4` },
];

export default function DrivingShowcase() {
    const { t } = useTranslation();

    const translatedItems = t('showcase.items', { returnObjects: true });

    // 번역된 텍스트 배열과 정적 데이터 배열을 합쳐서 최종 렌더링할 객체 배열을 만듭니다.
    const showcaseItems = translatedItems.map((item, index) => ({
        id: index + 1,
        title: item.title,
        description: item.desc,
        bg: staticShowcaseConfig[index].bg,
        videoSrc: staticShowcaseConfig[index].videoSrc
    }));

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollerRef = useRef(null);
    const cardRefs = useRef([]);
    const videoRefs = useRef([]);
    const scrollSettleTimeoutRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);
    // 인디케이터/화살표 클릭으로 프로그래매틱 스크롤이 진행 중인 동안엔
    // 네이티브 scroll 이벤트 기반의 "가장 가까운 카드" 재계산이 끼어들어
    // currentIndex를 덮어쓰지 않도록 막는 플래그
    const isProgrammaticScrollRef = useRef(false);
    const programmaticScrollFallbackRef = useRef(null);

    // 현재 스크롤 위치에서 컨테이너 정중앙에 가장 가까운 카드의 인덱스를 계산
    const getClosestIndex = useCallback(() => {
        const container = scrollerRef.current;
        if (!container) return 0;
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
        });
        return closestIndex;
    }, []);

    // 특정 카드를 스크롤 컨테이너 정중앙으로 부드럽게 스크롤 (실제 DOM 크기 기준이라 반응형 대응 자동)
    const scrollToIndex = useCallback((index) => {
        const container = scrollerRef.current;
        const card = cardRefs.current[index];
        if (!container || !card) return;
        const target = card.offsetLeft + card.offsetWidth / 2 - container.clientWidth / 2;

        // 프로그래매틱 스크롤 시작 — 스크롤이 실제로 끝날 때까지
        // handleScroll의 "가장 가까운 카드" 재계산을 막는다
        isProgrammaticScrollRef.current = true;
        clearTimeout(programmaticScrollFallbackRef.current);
        // scrollend 미지원 브라우저를 위한 안전장치 (smooth-scroll이 이보다 오래 걸리진 않음)
        programmaticScrollFallbackRef.current = setTimeout(() => {
            isProgrammaticScrollRef.current = false;
        }, 500);

        container.scrollTo({ left: target, behavior: 'smooth' });
        setCurrentIndex(index);
    }, []);

    const handlePrev = () => scrollToIndex(Math.max(currentIndex - 1, 0));
    const handleNext = () => scrollToIndex(Math.min(currentIndex + 1, showcaseItems.length - 1));

    // 네이티브 스크롤(트랙패드/터치/스크롤바 — 전부 브라우저가 직접 처리)이 멎으면
    // 가장 가까운 카드로 인디케이터/텍스트 상태만 동기화
    const handleScroll = () => {
        if (isDraggingRef.current) return; // 마우스 드래그 중엔 pointerup에서 별도 처리
        if (isProgrammaticScrollRef.current) return; // 인디케이터/화살표 클릭발 스크롤 중엔 개입하지 않음
        clearTimeout(scrollSettleTimeoutRef.current);
        scrollSettleTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(getClosestIndex());
        }, 120);
    };

    // 데스크탑 마우스 전용 '드래그로 스크롤' — 트랙패드 스와이프나 터치 스크롤은
    // 브라우저가 이미 네이티브로 처리하므로 이 로직이 필요 없고, 개입하지 않음
    const handlePointerDown = (e) => {
        if (e.pointerType !== 'mouse') return;
        const container = scrollerRef.current;
        if (!container) return;
        isDraggingRef.current = true;
        dragStartXRef.current = e.clientX;
        dragStartScrollLeftRef.current = container.scrollLeft;
        container.style.scrollSnapType = 'none'; // 드래그 중엔 스냅을 잠깐 풀어 손 움직임을 그대로 따라가게 함
        container.style.cursor = 'grabbing';
        container.setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return;
        const container = scrollerRef.current;
        if (!container) return;
        container.scrollLeft = dragStartScrollLeftRef.current - (e.clientX - dragStartXRef.current);
    };

    const endDrag = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        const container = scrollerRef.current;
        if (!container) return;
        container.style.scrollSnapType = 'x mandatory'; // 스냅 복원
        container.style.cursor = 'grab';
        scrollToIndex(getClosestIndex()); // 놓은 지점에서 가장 가까운 카드로 스냅
    };

    useEffect(() => {
        videoRefs.current.forEach((videoEl, index) => {
        if (!videoEl) return;
        if (index === currentIndex) {
            videoEl.currentTime = 0;
            videoEl.play().catch(() => {
            // 브라우저 정책상 자동재생 제약이 걸릴 경우 대비 예외처리
            });
        } else {
            videoEl.pause();
        }
        });
    }, [currentIndex]);

    // 스크롤이 실제로 완전히 멎는 시점(scrollend)에 플래그를 해제.
    // 120ms 타이머 추측보다 정확해서, handleScroll과의 경합을 원천적으로 줄여준다.
    useEffect(() => {
        const container = scrollerRef.current;
        if (!container) return;
        const clearProgrammaticFlag = () => {
        isProgrammaticScrollRef.current = false;
        clearTimeout(programmaticScrollFallbackRef.current);
        };
        container.addEventListener('scrollend', clearProgrammaticFlag);
        return () => container.removeEventListener('scrollend', clearProgrammaticFlag);
    }, []);

    useEffect(() => () => {
        clearTimeout(scrollSettleTimeoutRef.current);
        clearTimeout(programmaticScrollFallbackRef.current);
    }, []);

    const currentItem = showcaseItems[currentIndex];

    return (
        <section className="relative w-full h-screen bg-white flex flex-col justify-center gap-4 md:gap-5 py-12 px-6 md:px-20 overflow-hidden">
        
        {/* 상단 타이틀 */}
        <div className="text-left flex-shrink-0">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{t('showcase.title')}</h2>
            <p className="text-lg md:text-xl font-medium text-gray-600">{t('showcase.subtitle')}</p>
        </div>

        {/* 
            [1] 좌우 끝까지 확장된 풀 스크롤 무대 영역
            네이티브 CSS Scroll Snap 사용 — 트랙패드/터치/스크롤바를 브라우저가 직접 처리해서
            감도 튜닝, 관성 처리, 사파리 뒤로가기 제스처 같은 문제를 JS로 재현할 필요가 없음
        */}
        <div className="relative w-full w-screen -mx-6 md:-mx-20 h-[320px] md:h-[380px] bg-slate-100 shadow-inner overflow-hidden">
            <div 
            ref={scrollerRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            className="w-full h-full flex items-center overflow-x-auto select-none [--card-w:300px] md:[--card-w:700px] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden"
            style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
                paddingInline: 'calc(50% - var(--card-w) / 2)',
                cursor: 'grab',
            }}
            >
            <div className="flex items-center gap-6 md:gap-8">
                {showcaseItems.map((item, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                    key={item.id}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    onClick={() => scrollToIndex(index)}
                    className={`relative flex-shrink-0 w-[300px] md:w-[700px] h-[260px] md:h-[340px] rounded-3xl overflow-hidden flex items-center justify-center text-white shadow-xl cursor-pointer transition-all duration-300 [scroll-snap-align:center] [scroll-snap-stop:always] ${item.bg} ${
                        isActive ? "opacity-100 scale-100 z-10" : "opacity-40 hover:opacity-70 scale-95"
                    }`}
                    >
                    {/* 시연 영상 태그 적용 (자동 재생, 음소거, 루프, 인라인 재생) */}
                    <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={item.videoSrc}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    </div>
                );
                })}
            </div>
            </div>
        </div>

        {/* 
            [2] 스크롤 영역 바로 밑: 인디케이터 중앙 정렬 및 우측 하단 화살표
        */}
        <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 flex-shrink-0">
            
            {/* 좌측 균형용 빈 공간 */}
            <div className="w-12 md:w-24"></div>

            {/* 
                Dori 'o' 인디케이터 (원본 디자인: 단일 요소, width가 실제로 늘어남)
                - rounded-md는 넣지 않음: rounded-full 하나만으로도 가로가 긴 박스에서
                  자동으로 알약(스타디움) 모양이 나오고, 두 클래스가 동시에 있으면
                  border-radius 해석이 충돌해서 어중간한 모양이 나오던 원래 버그의 원인이었음.
                - [contain:paint] + translateZ(0): 이 요소만 독립된 페인트/컴포지팅
                  레이어로 강제 분리. 근처에서 계속 디코딩되는 <video> 4개 때문에
                  브라우저가 이 작은 요소의 래스터 타일을 부분적으로만 무효화해서
                  "줄어들지 않는 유령 알약"이 잔상처럼 남는 걸 방지하려는 목적.
                  (border-radius 자체 값은 애니메이션 내내 안 바뀌고 width만 바뀜)
            */}
            <div className="flex items-center gap-3">
            {showcaseItems.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive}
                    className={`[contain:paint] [transform:translateZ(0)] transition-[width,opacity] duration-300 ease-out border-2 border-black bg-transparent rounded-full cursor-pointer ${
                    isActive
                        ? "w-10 h-3"
                        : "w-3 h-3 opacity-40 hover:opacity-80"
                    }`}
                />
                );
            })}
            </div>

            {/* 우측 화살표 버튼 — 첫/마지막 카드에서는 비활성화 (순환하지 않음) */}
            <div className="flex items-center gap-3">
            <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                aria-label="Previous slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={handleNext}
                disabled={currentIndex === showcaseItems.length - 1}
                className="w-12 h-12 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                aria-label="Next slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            </div>

        </div>

        {/* 
            [3] 인디케이터와 화살표 아래에 위치한 텍스트 설명 영역
        */}
        <div className="text-left flex-shrink-0 pt-2 pb-2">
            <h3 className="text-xl md:text-2xl font-bold text-black">{currentItem.title}</h3>
            <p className="text-sm md:text-base text-gray-600 mt-1">{currentItem.description}</p>
        </div>

        </section>
    );
}