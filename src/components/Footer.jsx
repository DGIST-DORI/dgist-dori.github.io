import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  // 현재 설정된 언어 코드를 기반으로 지역명 렌더링
  const currentRegion = i18n.language?.startsWith('ko') ? '대한민국' : 'United States';

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-10 px-6 md:px-20 text-xs md:text-sm text-gray-500 z-30 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <div className="border-b border-slate-200 pb-6">
          <p className="leading-relaxed">
            This project is developed as part of the DGIST UGRP (Undergraduate Group Research Program).
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
            <p>Copyright © {currentYear} Dori Team. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <span className="w-[1px] h-3 bg-gray-300"></span>
              <a href="#" className="hover:text-black transition-colors">Terms of Use</a>
            </div>
          </div>

          {/* 지역 선택 페이지로 라우팅되는 링크 */}
          <Link 
            to="/country-region" 
            className="flex items-center gap-2 hover:text-black transition-colors group"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{currentRegion}</span>
          </Link>

        </div>
      </div>
    </footer>
  );
}
