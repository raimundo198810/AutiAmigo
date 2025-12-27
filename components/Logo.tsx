
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 transition-all duration-500 ${className}`}>
      <div className={`${sizeClasses[size]} aspect-square relative group`}>
        {/* SVG da Logomarca: Quebra-cabeça com curva de conexão */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-500"
        >
          <path 
            d="M35 15C35 9.47715 39.4772 5 45 5H55C60.5228 5 65 9.47715 65 15V25H75C80.5228 25 85 29.4772 85 35V45C85 50.5228 80.5228 55 75 55H65V65H75C80.5228 65 85 69.4772 85 75V85C85 90.5228 80.5228 95 75 95H65V85C65 79.4772 60.5228 75 55 75H45C39.4772 75 35 79.4772 35 85V95H25C19.4772 95 15 90.5228 15 85V75C15 69.4772 19.4772 65 25 65H35V55H25C19.4772 55 15 50.5228 15 45V35C15 29.4772 19.4772 25 25 25H35V15Z" 
            fill="url(#logo_gradient)"
          />
          <circle cx="50" cy="50" r="12" fill="white" fillOpacity="0.8" />
          <path d="M45 50C45 47.2386 47.2386 45 50 45C52.7614 45 55 47.2386 55 50C55 52.7614 52.7614 55 50 55C47.2386 55 45 52.7614 45 50Z" fill="#3B82F6" />
          <defs>
            <linearGradient id="logo_gradient" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-black tracking-tighter leading-none text-slate-800`}>
            Ajuda <span className="text-blue-600">Autista</span>
          </h1>
          <span className="text-[10px] sm:text-[12px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-tight">
            Portal de Apoio
          </span>
        </div>
      )}
    </div>
  );
};
