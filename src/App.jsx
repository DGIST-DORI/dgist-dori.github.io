import React, { useRef } from 'react';
import HeroSection from './components/HeroSection';
import MechanismSection from './components/MechanismSection';
import DrivingShowcase from './components/DrivingShowcase'; // 추가

import logoIcon from './assets/logo/logo-icon-mono.svg';
import logoText from './assets/logo/logo-text.svg';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function App() {
  const robotRef = useRef(null);

  useGSAP(() => {
    // 1. GSAP quickTo: 마우스 이동처럼 빈번하게 발생하는 이벤트에 최적화된 고성능 애니메이션 메서드
    const rotateXTo = gsap.quickTo(robotRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(robotRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      // 2. 화면 중앙을 (0,0)으로 기준 잡고, 마우스 위치를 -1에서 1 사이의 비율로 정규화
      const xRatio = (e.clientX / window.innerWidth) * 2 - 1;
      const yRatio = (e.clientY / window.innerHeight) * 2 - 1;

      // 3. 최대 회전각 설정 (예: 12도). 
      // 마우스가 X축으로 이동하면 로봇은 Y축을 중심으로 회전해야 하므로 교차 적용.
      rotateXTo(-yRatio * 12); 
      rotateYTo(xRatio * 12);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-slate-200">
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="Dori Logo" className="w-6 h-6" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <img src={logoText} alt="Dori" className="h-4 md:h-5" />
        </div>
        <div className="w-6 h-6"></div>
      </header>

      <main className="relative w-full">
        {/* 고정 로봇 레이어 */}
        <div
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-0"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={robotRef}
            className="w-64 h-64 md:w-[450px] md:h-[450px] bg-gray-200 rounded-full flex items-center justify-center shadow-inner pointer-events-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="text-gray-500 font-medium text-center px-4">
              Robot Rendering
            </span>
          </div>
        </div>

        {/* 텍스트 컨텐츠 레이어 */}
        <div className="relative z-10">
          <HeroSection />
          <MechanismSection />
        </div>

        {/* 주행 시연 섹션 (로봇 고정이 풀리며 위로 자연스럽게 덮어쓰고 올라옴) */}
        <div className="relative z-20 w-full bg-white">
          <DrivingShowcase />
        </div>
      </main>
      
    </div>
  );
}
