import React from 'react';
import HeroSection from './components/HeroSection';
import MechanismSection from './components/MechanismSection';
import DrivingShowcase from './components/DrivingShowcase'; // 추가

import logoIcon from './assets/logo/logo-icon-mono.svg';
import logoText from './assets/logo/logo-text.svg';

export default function App() {
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
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-0">
          <div className="w-64 h-64 md:w-[450px] md:h-[450px] bg-gray-200 rounded-full flex items-center justify-center shadow-inner pointer-events-auto">
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
