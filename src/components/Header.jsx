import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../assets/logo/logo-icon-mono.svg';
import logoText from '../assets/logo/logo-text.svg';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logoIcon} alt="Dori Logo" className="w-6 h-6" />
        </Link>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link to="/">
          <img src={logoText} alt="Dori" className="h-4 md:h-5" />
        </Link>
      </div>
      <div className="w-6 h-6"></div>
    </header>
  );
}
