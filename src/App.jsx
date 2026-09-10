import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MechanismSection from './components/MechanismSection';
import DrivingShowcase from './components/DrivingShowcase'; // 추가
import Footer from './components/Footer';
import CountryRegionPage from './components/CountryRegionPage';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function MainPage() {
  const robotRef = useRef(null);

  useGSAP(() => {
    const rotateXTo = gsap.quickTo(robotRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(robotRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const xRatio = (e.clientX / window.innerWidth) * 2 - 1;
      const yRatio = (e.clientY / window.innerHeight) * 2 - 1;
      rotateXTo(-yRatio * 12); 
      rotateYTo(xRatio * 12);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <main className="relative w-full">
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-0" style={{ perspective: '1000px' }}>
          <div ref={robotRef} className="w-64 h-64 md:w-[450px] md:h-[450px] bg-gray-200 rounded-full flex items-center justify-center shadow-inner pointer-events-auto" style={{ transformStyle: 'preserve-3d' }}>
            <span className="text-gray-500 font-medium text-center px-4">로봇 렌더링 이미지</span>
          </div>
        </div>
        <div className="relative z-10"><HeroSection /><MechanismSection /></div>
        <div className="relative z-20 w-full bg-white"><DrivingShowcase /></div>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-slate-200">
      {/* 
        GitHub Pages 배포 환경 호환성을 위해 vite.config.js의 base 경로를 
        Router의 basename으로 주입합니다. 
      */}
      <Router basename={import.meta.env.BASE_URL}>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/country-region" element={<CountryRegionPage />} />
        </Routes>
      </Router>
    </div>
  );
}
