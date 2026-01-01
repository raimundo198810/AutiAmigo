
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
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex items-center gap-4 ${className} group cursor-pointer`}>
      <div className={`${sizeClasses[size]} aspect-square relative transition-all duration-700 group-hover:scale-110 group-hover:rotate-[5deg]`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            {/* Gradiente 3D Profundo */}
            <linearGradient id="deep3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Iluminação Especular (Efeito de Brilho em Plástico/Vidro) */}
            <filter id="specular3D" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="20" lightingColor="#white" result="specular">
                <fePointLight x="-50" y="-100" z="200" />
              </feSpecularLighting>
              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularOut" />
              <feComposite in="SourceGraphic" in2="specularOut" operator="over" />
            </filter>

            {/* Sombra de Projeção */}
            <filter id="castShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="4" dy="8" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.4" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sombra de base */}
          <ellipse cx="50" cy="90" rx="30" ry="5" fill="black" opacity="0.1" className="group-hover:opacity-20 transition-opacity" />

          {/* Forma Principal do Coração 3D */}
          <g filter="url(#castShadow)">
            <path 
              d="M50 85C20 65 10 45 10 30C10 15 25 8 40 15C45 18 50 22 50 22C50 22 55 18 60 15C75 8 90 15 90 30C90 45 80 65 50 85Z" 
              fill="url(#deep3D)"
              filter="url(#specular3D)"
              className="animate-[pulse_4s_ease-in-out_infinite]"
            />
            
            {/* Camada Interna Fluida */}
            <path 
              d="M35 30C35 30 45 25 55 35C65 45 50 60 50 60C50 60 35 45 35 30Z" 
              fill="#10B981"
              opacity="0.8"
              className="animate-[bounce_3s_ease-in-out_infinite]"
              style={{ transformOrigin: 'center' }}
            />
          </g>

          {/* Ponto de Luz Central (Luminosidade Interna) */}
          <circle cx="50" cy="38" r="4" fill="white" filter="url(#specular3D)" className="animate-pulse" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-0.5">
            <h1 className={`${textSizeClasses[size]} font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none transition-colors duration-500`}>
              Ajuda<span className="text-blue-600 dark:text-blue-400">Autista</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-px w-3 bg-blue-500/30"></div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] leading-tight transition-colors duration-500">
              Apoio e Inclusão
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
