import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // 섹션 진입 시 부드럽게 떠오르는 애니메이션
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-black text-white py-32 px-6 md:px-20 relative z-20 overflow-hidden">
      <div ref={contentRef} className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* 섹션 헤더 */}
        <div className="text-center mb-16 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {t('dashboard.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-medium">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* 대시보드 프리뷰 카드 및 링크 영역 */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-12 shadow-2xl flex flex-col items-center relative group">
          
          {/* 대시보드 이미지/프리뷰가 들어갈 공간 */}
          {/* <div className="w-full aspect-video rounded-2xl bg-zinc-800 border border-zinc-700/50 overflow-hidden flex items-center justify-center relative mb-8 group-hover:border-zinc-600 transition-colors duration-300"> */}
            {/* 
              [이미지 삽입 가이드] 
              실제 대시보드 스크린샷 이미지가 준비되면 아래 주석을 풀고 사용하세요.
              <img src={`${import.meta.env.BASE_URL}assets/dashboard_preview.png`} alt="Dashboard Preview" className="w-full h-full object-cover" />
            */}
            {/* <span className="text-zinc-500 font-medium text-sm md:text-base">
              Dashboard UI Preview / Screenshot
            </span>
          </div> */}

          {/* 유튜브 영상 임베드 영역 */}
          <div className="w-full aspect-video rounded-2xl bg-zinc-800 border border-zinc-700/50 overflow-hidden flex items-center justify-center relative mb-8">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/XBVua-vR1_E?autoplay=1&mute=1&loop=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>

          {/* 링크 및 상세 설명 버튼 */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">Dori Dash</h3>
              <p className="text-zinc-400 text-sm md:text-base">{t('dashboard.subtitle2')}</p>
            </div>
            
            <a 
              href="https://dash.dgist-dori.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:bg-zinc-200 transition-all duration-300 transform hover:scale-105"
            >
              <span>{t('dashboard.cta')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M45 19.5l-7.5-7.5m0 0l7.5-7.5M37.5 12H3" />
                {/* 일반적인 화살표 아이콘 경로 수정 */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
