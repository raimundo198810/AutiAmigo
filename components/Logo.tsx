
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-24',
    xl: 'h-32'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-5xl',
    xl: 'text-7xl'
  };

  return (
    <div className={`flex items-center gap-4 transition-all duration-500 ${className}`}>
      <div className={`${sizeClasses[size]} aspect-square relative group perspective-container`}>
        <div className="w-full h-full tilt-element group-hover:rotate-12">
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_15px_35px_rgba(59,130,246,0.4)]"
          >
            <path 
              d="M35 15C35 9.47715 39.4772 5 45 5H55C60.5228 5 65 9.47715 65 15V25H75C80.5228 25 85 29.4772 85 35V45C85 50.5228 80.5228 55 75 55H65V65H75C80.5228 65 85 69.4772 85 75V85C85 90.5228 80.5228 95 75 95H65V85C65 79.4772 60.5228 75 55 75H45C39.4772 75 35 79.4772 35 85V95H25C19.4772 95 15 90.5228 15 85V75C15 69.4772 19.4772 65 25 65H35V55H25C19.4772 55 15 50.5228 15 45V35C15 29.4772 19.4772 25 25 25H35V15Z" 
              fill="url(#logo_gradient)"
            />
            <circle cx="50" cy="50" r="14" fill="white" fillOpacity="0.9" />
            <path d="M42 50C42 45.5817 45.5817 42 50 42C54.4183 42 58 45.5817 58 50C58 54.4183 54.4183 58 50 58C45.5817 58 42 54.4183 42 50Z" fill="#3B82F6" />
            <defs>
              <linearGradient id="logo_gradient" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="0.4" stopColor="#8B5CF6" />
                <stop offset="0.8" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-black tracking-tighter leading-none text-3d`}>
            Ajuda Autista
          </h1>
          <span className="text-[10px] sm:text-[14px] text-slate-600 font-black uppercase tracking-[0.3em] leading-tight opacity-80">
            Realismo 3D Inclusivo
          </span>
        </div>
      )}
    </div>
  );
};
