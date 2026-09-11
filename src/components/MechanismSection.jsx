import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function MechanismSection() {
  const { t } = useTranslation();
  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useGSAP(() => {
    // 1. 섹션 전체를 화면에 고정하는 메인 ScrollTrigger (1600px 동안 고정)
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1600", 
      pin: true,
      // 여기서는 scrub이나 animation을 넣지 않고 오직 '화면 고정' 역할만 합니다.
    });

    // 2. 첫 번째 텍스트 애니메이션 (섹션이 화면에 닿자마자 자동으로 끝까지 재생됨)
    gsap.fromTo(
      text1Ref.current,
      { opacity: 0, x: -40 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top", // 섹션 진입 시 즉시 시작
          toggleActions: "play none none reverse" // 나타나다 마는 일 없이 한 번에 play
        }
      }
    );

    // 3. 두 번째 텍스트 애니메이션 (사용자가 조금 더 스크롤했을 때 끝까지 재생됨)
    gsap.fromTo(
      text2Ref.current,
      { opacity: 0, x: -40 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          // 고정된 상태에서 200px 정도 추가로 스크롤을 내렸을 때 발동
          start: "top -200px", 
          toggleActions: "play none none reverse" 
        }
      }
    );

  }, { scope: wrapperRef });

  return (
    <div ref={wrapperRef} className="w-full relative">
      
      {/* 화면에 고정되는 실제 섹션 */}
      <section 
        id="mechanism-section" 
        ref={sectionRef} 
        className="relative w-full h-dvh flex flex-col justify-between md:justify-center px-8 md:px-24 py-24 md:py-0 pointer-events-auto bg-transparent z-10"
      >
        <div className="w-full md:w-[450px] h-full md:h-auto flex flex-col justify-end md:justify-center">
          
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{t('mechanism.title')}</h2>
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800">{t('mechanism.subtitle')}</h3>
          </div>
          
          <div className="flex flex-col gap-6 md:gap-8">
            <div ref={text1Ref} className="border-l-2 border-black pl-5 opacity-0">
              <h4 className="text-xl font-bold mb-1 md:mb-2">{t('mechanism.item0.title')}</h4>
              <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
                {t('mechanism.item0.desc')}
              </p>
            </div>
            
            <div ref={text2Ref} className="border-l-2 border-black pl-5 opacity-0">
              <h4 className="text-xl font-bold mb-1 md:mb-2">{t('mechanism.item1.title')}</h4>
              <p className="text-gray-600 leading-relaxed font-medium text-sm md:text-base">
                {t('mechanism.item1.desc')}
              </p>
            </div>
          </div>

        </div>
      </section>
      
    </div>
  );
}
