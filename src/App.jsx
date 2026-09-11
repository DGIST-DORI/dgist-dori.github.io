import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MechanismSection from './components/MechanismSection';
import DrivingShowcase from './components/DrivingShowcase';
import HriSection from './components/HriSection';
import DashboardSection from './components/DashboardSection';
import Footer from './components/Footer';
import CountryRegionPage from './components/CountryRegionPage';
import ScrollToTop from './components/ScrollToTop';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

function MainPage() {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // 프레임 수 정의 (0부터 시작하므로 총 개수는 마지막 인덱스 + 1)
  const driveFrames = 28;      // 0 ~ 27
  const transformFrames = 135; // 0 ~ 134
  const driveAltFrames = 28;   // 0 ~ 27
  const totalFrames = driveFrames + transformFrames + driveAltFrames;

  useEffect(() => {
    const loadImages = async () => {
      const promises = [];
      
      // 1. 변신 전 주행 (drive_00000.webp ~ 00027)
      for (let i = 0; i < driveFrames; i++) {
        const pad = String(i).padStart(5, '0');
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}assets/sequence/drive_${pad}.webp`;
        promises.push(new Promise(res => { img.onload = () => res(img); img.onerror = () => res(img); }));
      }
      
      // 2. 변신 과정 (transform_00000.webp ~ 00134)
      for (let i = 0; i < transformFrames; i++) {
        const pad = String(i).padStart(5, '0');
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}assets/sequence/transform_${pad}.webp`;
        promises.push(new Promise(res => { img.onload = () => res(img); img.onerror = () => res(img); }));
      }
      
      // 3. 변신 후 주행 (drivealt_00000.webp ~ 00035)
      for (let i = 0; i < driveAltFrames; i++) {
        const pad = String(i).padStart(5, '0');
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}assets/sequence/drivealt_${pad}.webp`;
        promises.push(new Promise(res => { img.onload = () => res(img); img.onerror = () => res(img); }));
      }
      
      const loaded = await Promise.all(promises);
      imagesRef.current = loaded;
      setImagesLoaded(true);
      
      if (loaded[0] && canvasRef.current) {
        canvasRef.current.getContext('2d').drawImage(loaded[0], 0, 0, 1080, 1080);
      }
    };
    loadImages();
  }, []);

  useGSAP(() => {
    // 틸트 로직 유지
    const rotateXTo = gsap.quickTo(canvasWrapperRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(canvasWrapperRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const xRatio = (e.clientX / window.innerWidth) * 2 - 1;
      const yRatio = (e.clientY / window.innerHeight) * 2 - 1;
      rotateXTo(-yRatio * 2); 
      rotateYTo(xRatio * 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    if (imagesLoaded) {
      const canvasObj = { frame: 0 };
      const drawFrame = () => {
        const ctx = canvasRef.current?.getContext('2d');
        const img = imagesRef.current[Math.round(canvasObj.frame)];
        if (ctx && img) {
          ctx.clearRect(0, 0, 1080, 1080);
          ctx.drawImage(img, 0, 0, 1080, 1080);
        }
      };

      // 스크롤 거리 동기화 수학 (MechanismSection의 1600px 고정 기준)
      const h = window.innerHeight;
      const pinDistance = 1600; 
      const text1Offset = pinDistance * 0.1; // 텍스트 1이 등장하는 스크롤 시점(10%)

      // 3단계 애니메이션의 상대적 지속 거리 설정
      const d1 = h + text1Offset;          // Hero 전체 + 텍스트1 등장 직전까지
      const d2_hold = 200; // 텍스트 2 등장까지
      const d2 = pinDistance - text1Offset - d2_hold; // 텍스트2 등장 후 Mechanism 고정 해제까지
      const d3 = h;                        // 다음 섹션(DrivingShowcase)이 화면을 덮을 때까지

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: () => "+=" + (d1 + d2_hold + d2 + d3),
          scrub: 0.5,
        },
        onUpdate: drawFrame
      });

      masterTl
        // 1. 변신 전 주행
        .to(canvasObj, { frame: driveFrames - 1, snap: "frame", ease: "none", duration: d1 })
        // 2. 변신 과정
        .to(canvasObj, { frame: driveFrames + transformFrames - 1, snap: "frame", ease: "none", duration: d2 })
        // 3. 변신 후 주행
        .to(canvasObj, { frame: totalFrames - 1, snap: "frame", ease: "none", duration: d3 });
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: document.body, dependencies: [imagesLoaded] });

  return (
    <>
      <main className="relative w-full">
        <div 
          className="fixed top-0 left-0 w-full h-dvh flex items-center justify-center pointer-events-none z-0"
          style={{ perspective: '1000px' }}
        >
          <div 
            ref={canvasWrapperRef}
            className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] flex items-center justify-center pointer-events-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <canvas
              ref={canvasRef}
              width={1080}
              height={1080}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="relative z-10">
          <HeroSection />
          <MechanismSection />
          <div className="w-full" style={{ height: '50vh' }}></div>
        </div>

        <div className="relative z-20 w-full bg-white">
          <DrivingShowcase />
          <HriSection />
          <DashboardSection />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh bg-white text-black font-sans antialiased selection:bg-slate-200">
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/country-region" element={<CountryRegionPage />} />
        </Routes>
      </Router>
    </div>
  );
}
