import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const regions = [
  { code: 'ko', name: '대한민국' },
  { code: 'en', name: 'United States' }
];

export default function CountryRegionPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    navigate(-1); // 이전 페이지로 즉시 복귀
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6 md:px-20 z-40 relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-black">
          Choose Your Country or Region
        </h1>
        
        <ul className="flex flex-col border-t border-slate-200">
          {regions.map((region) => {
            const isActive = i18n.language?.startsWith(region.code);
            return (
              <li key={region.code} className="border-b border-slate-200">
                <button
                  onClick={() => handleSelect(region.code)}
                  className="w-full text-left py-5 px-2 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer group"
                >
                  <span className={`text-lg ${isActive ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>
                    {region.name}
                  </span>
                  {isActive && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
