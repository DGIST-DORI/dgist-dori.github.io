import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function DrivingShowcase() {
    const { t } = useTranslation();

    const showcaseItems = [
    { id: 1,
        title: t('drivingShowcase.item0.title'),
        description: t('drivingShowcase.item0.description'),
        bg: "bg-slate-800",
        videoSrc: `${import.meta.env.BASE_URL}assets/videos/video0.mp4`
    },
    { id: 2,
        title: t('drivingShowcase.item1.title'),
        description: t('drivingShowcase.item1.description'),
        bg: "bg-slate-700",
        videoSrc: `${import.meta.env.BASE_URL}assets/videos/video1.mp4`
    },
    { id: 3,
        title: t('drivingShowcase.item2.title'),
        description: t('drivingShowcase.item2.description'),
        bg: "bg-slate-900",
        videoSrc: `${import.meta.env.BASE_URL}assets/videos/video1.mp4`
    },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollerRef = useRef(null);
    const cardRefs = useRef([]);
    const videoRefs = useRef([]);
    const scrollSettleTimeoutRef = useRef(null);
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const dragStartScrollLeftRef = useRef(0);

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
        container.scrollTo({ left: target, behavior: 'smooth' });
        setCurrentIndex(index);
    }, []);

    const handlePrev = () => scrollToIndex(Math.max(currentIndex - 1, 0));
    const handleNext = () => scrollToIndex(Math.min(currentIndex + 1, showcaseItems.length - 1));

    // 네이티브 스크롤(트랙패드/터치/스크롤바 — 전부 브라우저가 직접 처리)이 멎으면
    // 가장 가까운 카드로 인디케이터/텍스트 상태만 동기화
    const handleScroll = () => {
        if (isDraggingRef.current) return; // 마우스 드래그 중엔 pointerup에서 별도 처리
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

    useEffect(() => () => clearTimeout(scrollSettleTimeoutRef.current), []);

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

            {/* Dori 'o' 인디케이터 */}
            <div className="flex items-center gap-3">
            {showcaseItems.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`transition-all duration-300 ease-out border-2 border-black bg-transparent rounded-full cursor-pointer ${
                    isActive 
                        ? "w-10 h-3 rounded-md" 
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
