import React from 'react';

interface LogoDProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'letter-only' | 'watermark';
  showText?: boolean;
  textClassName?: string;
}

export const LogoD: React.FC<LogoDProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'full',
  showText = false,
  textClassName = 'text-white font-black text-xl tracking-tight',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className={`relative flex-shrink-0 ${className}`} style={style}>
        {variant === 'full' && (
          <img
            src="/logo.svg"
            alt="Logo D"
            className="w-full h-full object-contain rounded-2xl shadow-[4px_4px_0_#083B3A33] border-t border-t-white/30"
          />
        )}

        {variant === 'letter-only' && (
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full drop-shadow-[4px_4px_0_#083B3A]"
            shapeRendering="geometricPrecision"
          >
            {/* 3D Extrusion Shadow Layer */}
            <path
              d="M 125,95 L 295,95 C 395,95 465,165 465,270 C 465,375 395,445 295,445 L 125,445 C 105,445 90,430 90,410 L 90,130 C 90,110 105,95 125,95 Z"
              fill="#083B3A"
              transform="translate(24, 24)"
            />
            {/* Front Letter Face */}
            <path
              fillRule="evenodd"
              d="M 130,75 L 295,75 C 398,75 468,148 468,256 C 468,364 398,437 295,437 L 130,437 C 108,437 92,421 92,399 L 92,113 C 92,91 108,75 130,75 Z M 205,158 L 268,158 C 318,158 350,195 350,256 C 350,317 318,354 268,354 L 205,354 C 194,354 186,346 186,335 L 186,177 C 186,166 194,158 205,158 Z"
              fill="#54DDDE"
            />
            {/* Inner Depth */}
            <path
              d="M 186,158 L 245,158 C 255,158 268,162 268,162 L 242,185 L 212,185 L 212,330 L 186,354 Z"
              fill="#083B3A"
              opacity="0.8"
            />
            {/* Gloss highlight */}
            <path
              d="M 112,150 C 106,128 116,102 142,92 C 170,82 225,82 285,82"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 338,295 C 334,325 310,345 272,348 L 220,348"
              fill="none"
              stroke="#8EFAF4"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>
        )}

        {variant === 'watermark' && (
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full opacity-15 pointer-events-none select-none"
            shapeRendering="geometricPrecision"
          >
            {/* Shadow */}
            <path
              d="M 125,95 L 295,95 C 395,95 465,165 465,270 C 465,375 395,445 295,445 L 125,445 C 105,445 90,430 90,410 L 90,130 C 90,110 105,95 125,95 Z"
              fill="#083B3A"
              transform="translate(24, 24)"
            />
            {/* Front Letter */}
            <path
              fillRule="evenodd"
              d="M 130,75 L 295,75 C 398,75 468,148 468,256 C 468,364 398,437 295,437 L 130,437 C 108,437 92,421 92,399 L 92,113 C 92,91 108,75 130,75 Z M 205,158 L 268,158 C 318,158 350,195 350,256 C 350,317 318,354 268,354 L 205,354 C 194,354 186,346 186,335 L 186,177 C 186,166 194,158 205,158 Z"
              fill="#54DDDE"
            />
            {/* Gloss */}
            <path
              d="M 112,150 C 106,128 116,102 142,92 C 170,82 225,82 285,82"
              fill="none"
              stroke="#3AF0E4"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <span className={textClassName}>ديزاين ستوديو</span>
          <span className="text-[11px] text-[#54DDDE] font-medium tracking-wide">
            تصميم وهوية بصرية 3D
          </span>
        </div>
      )}
    </div>
  );
};
