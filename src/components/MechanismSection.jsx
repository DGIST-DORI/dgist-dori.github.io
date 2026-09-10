import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function MechanismSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useGSAP(() => {
    // scrub을 제거하고 순수 타임라인 시간(duration)과 딜레이로 자동 재생되도록 설정
    const tl = gsap.timeline();

    tl.fromTo(
      text1Ref.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      text2Ref.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      "+=0.4" // 첫 번째 텍스트가 뜬 후 0.4초 뒤에 자동으로 두 번째 텍스트 등장
    );

    // 섹션은 고정(pin)하되, 내부 텍스트 애니메이션은 스크롤에 의존하지 않고 자동 재생
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1500", // 고정되는 스크롤 거리 (필요에 따라 조절 가능)
      pin: true,
      scrub: false,   // [핵심] 스크롤 속도에 동기화하지 않고 독립적으로 부드럽게 재생됨
      animation: tl,
    });
  }, { scope: sectionRef });

  return (
    <section 
      id="mechanism-section" 
      ref={sectionRef} 
      className="relative w-full h-screen flex flex-col justify-between md:justify-center px-8 md:px-24 py-24 md:py-0 pointer-events-auto bg-transparent z-10"
    >
      <div className="w-full md:w-[450px] h-full md:h-auto flex flex-col justify-between md:justify-center">
        
        {/* 상단 타이틀 */}
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{t('mechanism.title')}</h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">{t('mechanism.subtitle')}</h3>
        </div>
        
        {/* 서브텍스트 영역 (정렬 및 자동 등장 적용) */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* 첫 번째 텍스트 */}
          <div ref={text1Ref} className="border-l-2 border-black pl-5 opacity-0">
            <h4 className="text-xl font-bold mb-1 md:mb-2">{t('mechanism.item0.title')}</h4>
            <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
              {t('mechanism.item0.desc')}
            </p>
          </div>
          
          {/* 두 번째 텍스트 (불필요한 들여쓰기 md:ml-16을 제거하여 위 텍스트와 완벽히 일직선 정렬) */}
          <div ref={text2Ref} className="border-l-2 border-black pl-5 opacity-0">
            <h4 className="text-xl font-bold mb-1 md:mb-2">{t('mechanism.item1.title')}</h4>
            <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
              {t('mechanism.item1.desc')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
