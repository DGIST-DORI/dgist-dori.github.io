import React from 'react';
import logoText from '../assets/logo/logo-text.svg';
// GSAP 플러그인 불러오기
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// 플러그인 등록
gsap.registerPlugin(ScrollToPlugin);

export default function HeroSection() {
  const scrollToMechanism = () => {
    // 기본 스크롤(scrollIntoView) 대신 GSAP 애니메이션으로 스크롤을 제어합니다.
    gsap.to(window, {
      duration: 1.5, // 1.5초 동안 천천히 이동
      scrollTo: '#mechanism-section',
      ease: 'power3.inOut' // 처음과 끝을 부드럽게 가감속
    });
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-between py-24 px-4 pointer-events-auto">
      <div className="text-center mt-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          캐치프레이즈 캐치
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-800">
          서브텍스트
        </p>
      </div>
      
      <div className="text-center flex flex-col items-center gap-6 mb-8">
        <img src={logoText} alt="Dori" className="h-10 md:h-14 mb-2" />
        
        <button 
          onClick={scrollToMechanism}
          className="relative overflow-hidden flex items-center justify-between w-56 px-6 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
        >
          <span className="font-medium">Scroll to Explore</span>
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg 
              className="w-5 h-5 absolute animate-slide-down-loop" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}
