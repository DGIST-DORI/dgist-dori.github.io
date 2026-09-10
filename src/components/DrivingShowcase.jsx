import React, { useState, useRef, useEffect } from 'react';

const showcaseItems = [
  { id: 1, title: "실내 복도 자율주행", description: "매끄러운 바닥 환경에서 부드러운 휠 구동", bg: "bg-slate-800" },
  { id: 2, title: "휠 트랜스폼 시연", description: "구형태에서 루빅스 큐브 회전 및 바퀴 전환", bg: "bg-slate-700" },
  { id: 3, title: "실외 보도블록 주행", description: "거친 노면 환경 대응 실외용 바퀴 모드", bg: "bg-slate-900" },
];

export default function DrivingShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const dragStartXRef = useRef(null);
  const stageRef = useRef(null);
  const wheelDeltaRef = useRef(0);
  const wheelTimeoutRef = useRef(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, showcaseItems.length - 1));
  };

  const DRAG_THRESHOLD = 60; // 마우스/터치 드래그: 이 거리(px) 이상 끌어야 다음/이전 카드로 스냅됨
  const WHEEL_SNAP_THRESHOLD = 200; // 트랙패드 스와이프: 드래그보다 높게 잡아 과민 반응 방지
  const WHEEL_DAMPING = 0.8; // 트랙패드 delta 감도 완화

  const handlePointerDown = (e) => {
    dragStartXRef.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (dragStartXRef.current === null) return;
    setDragDelta(e.clientX - dragStartXRef.current);
  };

  const handlePointerUp = () => {
    if (dragStartXRef.current === null) return;
    if (dragDelta <= -DRAG_THRESHOLD) {
      handleNext();
    } else if (dragDelta >= DRAG_THRESHOLD) {
      handlePrev();
    }
    dragStartXRef.current = null;
    setDragDelta(0);
    setIsDragging(false);
  };

  // 드래그 도중 카드를 눌렀다 뗀 것이 '클릭'으로 오인되어 엉뚱한 카드로 튀지 않도록 방지
  const handleCardClick = (index) => {
    if (Math.abs(dragDelta) > 5) return;
    setCurrentIndex(index);
  };

  // 트랙패드 좌우 스크롤(휠 제스처) 처리 — pointer 이벤트로는 안 잡히는 두 손가락 스와이프용
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;

    // 제스처가 끝난 뒤(손을 떼거나 관성이 멈춘 뒤) 남은 자투리 오프셋을 원위치로 되돌림
    const settleWheel = () => {
      wheelDeltaRef.current = 0;
      setDragDelta(0);
      setIsWheeling(false);
    };

    const onWheel = (e) => {
      // 가로/세로 판정은 매 이벤트마다 독립적으로 — 제스처 시작 시 한 번만 판정해서 고정해두면
      // 초반의 미세한 대각선 흔들림 때문에 실제로는 가로 스와이프인데도 세로로 오판되어
      // 그 뒤로 preventDefault가 한 번도 안 불리고, 그 결과 사파리가 뒤로가기/앞으로가기
      // 제스처로 받아버리는 문제가 있었음. 매번 개별 판정하면 가로 이벤트는 절대 놓치지 않음.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // 세로 스크롤은 페이지에 그대로 맡김

      e.preventDefault();
      setIsWheeling(true);

      wheelDeltaRef.current -= e.deltaX * WHEEL_DAMPING;

      if (wheelDeltaRef.current <= -WHEEL_SNAP_THRESHOLD) {
        handleNext();
        wheelDeltaRef.current = 0;
        setDragDelta(0);
      } else if (wheelDeltaRef.current >= WHEEL_SNAP_THRESHOLD) {
        handlePrev();
        wheelDeltaRef.current = 0;
        setDragDelta(0);
      } else {
        setDragDelta(wheelDeltaRef.current);
      }

      clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(settleWheel, 150);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentItem = showcaseItems[currentIndex];

  return (
    <section className="relative w-full h-screen bg-white flex flex-col justify-center gap-4 md:gap-5 py-12 px-6 md:px-20 overflow-hidden">
      
      {/* 상단 타이틀 */}
      <div className="text-left flex-shrink-0">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">도리 굴러가요</h2>
        <p className="text-lg md:text-xl font-medium text-gray-600">주행 시연 & 자율 주행 시뮬레이션</p>
      </div>

      {/* 
        [1] 좌우 끝까지 확장된 풀 스크롤 무대 영역
      */}
      <div 
        ref={stageRef}
        className="relative w-full w-screen -mx-6 md:-mx-20 h-[320px] md:h-[380px] bg-slate-100 flex items-center overflow-hidden shadow-inner select-none [--card-w:300px] [--card-gap:24px] md:[--card-w:700px] md:[--card-gap:32px]"
        style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab', overscrollBehaviorX: 'contain' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { if (isDragging) handlePointerUp(); }}
        onPointerCancel={() => { if (isDragging) handlePointerUp(); }}
      >
        
        {/* 슬라이드 트랙 (CSS 변수 기반 중앙 정렬 + 드래그/휠 오프셋 반영, 제스처 중엔 트랜지션 해제) */}
        <div 
          className={`flex items-center gap-6 md:gap-8 ease-out ${isDragging || isWheeling ? '' : 'transition-transform duration-500'}`}
          style={{ 
            '--index': currentIndex,
            transform: `translateX(calc(50vw - (var(--card-w) / 2) - (var(--index) * (var(--card-w) + var(--card-gap))) + ${dragDelta}px))`
          }}
        >
          {showcaseItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(index)}
                // 모서리 둥글기 복구 (rounded-3xl)
                className={`flex-shrink-0 w-[300px] md:w-[700px] h-[260px] md:h-[340px] rounded-3xl flex items-center justify-center text-white shadow-xl cursor-pointer transition-all duration-300 ${item.bg} ${
                  isActive ? "opacity-100 scale-100 z-10" : "opacity-40 hover:opacity-70 scale-95"
                }`}
              >
                <span className="text-gray-400 font-medium">시연 영상/이미지</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 
        [2] 스크롤 영역 바로 밑: 인디케이터 중앙 정렬 및 우측 하단 화살표
      */}
      <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between px-2 md:px-4 flex-shrink-0">
        
        {/* 좌측 균형용 빈 공간 */}
        <div className="w-12 md:w-24"></div>

        {/* Dori 'o' 인디케이터 (스크롤 영역 바로 밑에 중앙 정렬 복원) */}
        <div className="flex items-center gap-3">
          {showcaseItems.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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

        {/* 우측 화살표 버튼 */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-black/20 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-sm cursor-pointer"
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
