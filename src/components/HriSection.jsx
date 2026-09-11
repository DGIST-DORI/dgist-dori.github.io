import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function HriSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    // 섹션 진입 시 그리드 아이템들이 순차적으로 떠오르는 애니메이션
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-slate-50 py-32 px-6 md:px-20 relative z-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HRI 섹션 헤더 */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
            {t('hri.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            {t('hri.subtitle')}
          </p>
        </div>

        {/* 벤토 박스 그리드 레이아웃: 데스크탑에서 2열(양옆 배치)로 설정 */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-auto">
          
          {/* 주요 카드 1: Voice */}
          <div className="md:col-span-1 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">{t('hri.voice.title')}</h3>
              <p className="text-gray-500 max-w-sm">{t('hri.voice.desc')}</p>
            </div>
            {/* 시각적 요소를 넣을 플레이스홀더 */}
            {/* <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-50 to-transparent rounded-tl-full opacity-50 group-hover:scale-105 transition-transform duration-500"></div> */}
          </div>

          {/* 주요 카드 2: Gesture */}
          <div className="md:col-span-1 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">{t('hri.gesture.title')}</h3>
              <p className="text-gray-500 max-w-sm">{t('hri.gesture.desc')}</p>
            </div>
            {/* 시각적 요소를 넣을 플레이스홀더 */}
            {/* <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-50 to-transparent rounded-tl-full opacity-50 group-hover:scale-105 transition-transform duration-500"></div> */}
          </div>

        </div>
      </div>
    </section>
  );
}
