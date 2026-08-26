import React from "react";

export default function InvitationCard() {
  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto bg-[#f8ebeb] rounded-3xl shadow-2xl relative overflow-hidden border border-[#ebd8d8] p-6 sm:p-10 text-center select-none min-h-[620px] sm:min-h-[700px] flex flex-col justify-between items-center my-2">
      
      {/* Defined SVG Gradients and Patterns */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="goldLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9CA7D" />
            <stop offset="50%" stopColor="#CFA238" />
            <stop offset="100%" stopColor="#A87B22" />
          </linearGradient>
          <linearGradient id="whitePetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FAFAF7" />
            <stop offset="100%" stopColor="#F2ECEB" />
          </linearGradient>
          <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D99F26" />
            <stop offset="50%" stopColor="#E8BD56" />
            <stop offset="100%" stopColor="#BA8518" />
          </linearGradient>
        </defs>
      </svg>

      {/* TOP-LEFT CORNER FLORALS */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-10"
        viewBox="0 0 200 200"
        fill="none"
      >
        {/* Slate Grey Leaves */}
        <g fill="#728285">
          <path d="M10,60 C30,45 55,50 65,30 C50,25 25,35 10,60 Z" opacity="0.9" />
          <path d="M40,25 C55,10 80,20 95,5 C80,0 55,10 40,25 Z" opacity="0.85" />
          <circle cx="68" cy="28" r="4" fill="#5c6a6d" />
          <circle cx="82" cy="18" r="3.5" fill="#5c6a6d" />
        </g>
        {/* Metallic Gold Leaves */}
        <g fill="url(#goldLeafGrad)">
          <path d="M5,100 C30,80 70,85 85,60 C65,55 30,65 5,100 Z" opacity="0.95" />
          <path d="M60,50 C80,30 110,40 125,20 C105,15 75,25 60,50 Z" opacity="0.9" />
        </g>
        {/* White Flower Petals */}
        <g transform="translate(45, 45)">
          <path d="M0,-35 C15,-40 30,-20 20,0 C10,15 -15,15 -20,0 C-25,-20 -15,-30 0,-35 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M-30,-15 C-40,0 -30,25 -10,25 C10,25 20,5 10,-15 C0,-30 -20,-25 -30,-15 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M15,-25 C30,-10 35,15 15,30 C-5,35 -20,20 -10,0 C0,-15 0,-25 15,-25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="6" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.8" />
        </g>
      </svg>

      {/* TOP-RIGHT CORNER FLORALS */}
      <svg
        className="absolute top-0 right-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-10"
        viewBox="0 0 200 200"
        fill="none"
      >
        {/* Slate Grey Leaves */}
        <g fill="#728285">
          <path d="M190,60 C170,45 145,50 135,30 C150,25 175,35 190,60 Z" opacity="0.9" />
          <path d="M160,25 C145,10 120,20 105,5 C120,0 145,10 160,25 Z" opacity="0.85" />
          <circle cx="132" cy="28" r="4" fill="#5c6a6d" />
          <circle cx="118" cy="18" r="3.5" fill="#5c6a6d" />
        </g>
        {/* Metallic Gold Leaves */}
        <g fill="url(#goldLeafGrad)">
          <path d="M195,100 C170,80 130,85 115,60 C135,55 170,65 195,100 Z" opacity="0.95" />
          <path d="M140,50 C120,30 90,40 75,20 C95,15 125,25 140,50 Z" opacity="0.9" />
        </g>
        {/* White Flower Petals */}
        <g transform="translate(155, 45)">
          <path d="M0,-35 C-15,-40 -30,-20 -20,0 C-10,15 15,15 20,0 C25,-20 15,-30 0,-35 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M30,-15 C40,0 30,25 10,25 C-10,25 -20,5 -10,-15 C0,-30 20,-25 30,-15 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M-15,-25 C-30,-10 -35,15 -15,30 C5,35 20,20 10,0 C0,-15 0,-25 -15,-25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="6" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.8" />
        </g>
      </svg>

      {/* BOTTOM-LEFT CORNER FLORALS */}
      <svg
        className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-10"
        viewBox="0 0 200 200"
        fill="none"
      >
        <g fill="#728285">
          <path d="M10,140 C30,155 55,150 65,170 C50,175 25,165 10,140 Z" opacity="0.9" />
          <path d="M40,175 C55,190 80,180 95,195 C80,200 55,190 40,175 Z" opacity="0.85" />
        </g>
        <g fill="url(#goldLeafGrad)">
          <path d="M5,100 C30,120 70,115 85,140 C65,145 30,135 5,100 Z" opacity="0.95" />
          <path d="M60,150 C80,170 110,160 125,180 C105,185 75,175 60,150 Z" opacity="0.9" />
        </g>
        <g transform="translate(45, 155)">
          <path d="M0,35 C15,40 30,20 20,0 C10,-15 -15,-15 -20,0 C-25,20 -15,30 0,35 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M-30,15 C-40,0 -30,-25 -10,-25 C10,-25 20,-5 10,15 C0,30 -20,25 -30,15 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M15,25 C30,10 35,-15 15,-30 C-5,-35 -20,-20 -10,0 C0,15 0,25 15,25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="6" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.8" />
        </g>
      </svg>

      {/* BOTTOM-RIGHT CORNER FLORALS */}
      <svg
        className="absolute bottom-0 right-0 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-10"
        viewBox="0 0 200 200"
        fill="none"
      >
        <g fill="#728285">
          <path d="M190,140 C170,155 145,150 135,170 C150,175 175,165 190,140 Z" opacity="0.9" />
          <path d="M160,175 C145,190 120,180 105,195 C120,200 145,190 160,175 Z" opacity="0.85" />
        </g>
        <g fill="url(#goldLeafGrad)">
          <path d="M195,100 C170,120 130,115 115,140 C135,145 170,135 195,100 Z" opacity="0.95" />
          <path d="M140,150 C120,170 90,160 75,180 C95,185 125,175 140,150 Z" opacity="0.9" />
        </g>
        <g transform="translate(155, 155)">
          <path d="M0,35 C-15,40 -30,20 -20,0 C-10,-15 15,-15 20,0 C25,20 15,30 0,35 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M30,15 C40,0 30,-25 10,-25 C-10,-25 -20,-5 -10,15 C0,30 20,25 30,15 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <path d="M-15,25 C-30,10 -35,-15 -15,-30 C5,-35 20,-20 10,0 C0,15 0,25 -15,25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="6" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.8" />
        </g>
      </svg>

      {/* TOP INVITATION HEADER TEXT */}
      <div className="relative z-20 pt-4 sm:pt-6">
        <p className="uppercase tracking-[0.28em] text-[11px] sm:text-[13px] text-[#866B5C] font-sans font-medium mb-1">
          ESTAS INVITADO A
        </p>
        <h2 
          className="uppercase tracking-[0.2em] text-xl sm:text-2xl text-[#6E4F40] font-bold"
          style={{ fontFamily: '"Cinzel", "Cormorant Garamond", serif' }}
        >
          LA BODA DE
        </h2>
      </div>

      {/* CENTRAL CIRCULAR FRAME WITH FLORAL WREATH */}
      <div className="relative my-6 sm:my-8 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center z-20">
        
        {/* Background Circle with Sketchy Organic Double/Triple Ring */}
        <div className="absolute inset-0 rounded-full bg-[#faf0ef] border border-[#d2bebe] shadow-inner flex items-center justify-center">
          <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-[#bfa598]/60 pointer-events-none"></div>
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-[#8c6f5e]/40 pointer-events-none"></div>
        </div>

        {/* WREATH FLORALS & LEAVES ENCIRCLING THE RING */}
        <svg
          className="absolute -inset-8 sm:-inset-10 w-[calc(100%+64px)] h-[calc(100%+64px)] sm:w-[calc(100%+80px)] sm:h-[calc(100%+80px)] pointer-events-none z-10"
          viewBox="0 0 300 300"
          fill="none"
        >
          {/* Left Wreath Branch */}
          <g transform="translate(150, 150) rotate(-45) translate(-150, -150)">
            <path d="M40,150 Q70,70 150,40" stroke="#728285" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M20,130 C40,110 50,80 65,65 C45,65 30,90 20,130 Z" fill="#728285" opacity="0.85" />
            <path d="M60,85 C80,65 100,50 120,40 C100,35 75,50 60,85 Z" fill="url(#goldLeafGrad)" />
            <circle cx="35" cy="110" r="3.5" fill="#5c6a6d" />
            <circle cx="50" cy="90" r="3" fill="#5c6a6d" />
          </g>

          {/* Right Wreath Branch */}
          <g transform="translate(150, 150) rotate(135) translate(-150, -150)">
            <path d="M40,150 Q70,70 150,40" stroke="#728285" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M20,130 C40,110 50,80 65,65 C45,65 30,90 20,130 Z" fill="#728285" opacity="0.85" />
            <path d="M60,85 C80,65 100,50 120,40 C100,35 75,50 60,85 Z" fill="url(#goldLeafGrad)" />
            <circle cx="35" cy="110" r="3.5" fill="#5c6a6d" />
            <circle cx="50" cy="90" r="3" fill="#5c6a6d" />
          </g>

          {/* White Wreath Blooming Flowers - Left Side */}
          <g transform="translate(42, 130)">
            <path d="M0,-25 C12,-30 22,-15 15,0 C8,10 -10,10 -15,0 C-20,-15 -10,-22 0,-25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <path d="M-22,-10 C-30,0 -22,18 -8,18 C8,18 15,5 8,-10 C0,-20 -15,-18 -22,-10 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <path d="M12,-18 C22,-8 25,10 12,22 C-2,25 -12,15 -8,0 C0,-10 0,-18 12,-18 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="4.5" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.6" />
          </g>

          {/* White Wreath Blooming Flowers - Right Side */}
          <g transform="translate(258, 170)">
            <path d="M0,-25 C-12,-30 -22,-15 -15,0 C-8,10 10,10 15,0 C20,-15 10,-22 0,-25 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <path d="M22,-10 C30,0 22,18 8,18 C-8,18 -15,5 -8,-10 C0,-20 15,-18 22,-10 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <path d="M-12,-18 C-22,-8 -25,10 -12,22 C2,25 12,15 8,0 C0,-10 0,-18 -12,-18 Z" fill="url(#whitePetalGrad)" stroke="#E0D2D2" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="4.5" fill="#F4E3D7" stroke="#D4A133" strokeWidth="0.6" />
          </g>

          {/* Additional Gold Leaves along circle edges */}
          <path d="M220,70 C240,55 260,70 270,50 C250,50 230,60 220,70 Z" fill="url(#goldLeafGrad)" opacity="0.9" />
          <path d="M80,230 C60,245 40,230 30,250 C50,250 70,240 80,230 Z" fill="url(#goldLeafGrad)" opacity="0.9" />
        </svg>

        {/* NAMES INSIDE THE CIRCLE */}
        <div className="relative z-20 text-center px-4">
          <h1 
            className="text-2xl sm:text-3.5xl font-bold tracking-[0.2em] uppercase leading-tight text-[#c9961b] drop-shadow-xs"
            style={{ 
              fontFamily: '"Cinzel", "Cormorant Garamond", serif',
              backgroundImage: 'linear-gradient(135deg, #d99f26 0%, #e8bd56 50%, #ba8518 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            NATALIA
          </h1>
          <p 
            className="text-3xl sm:text-4.5xl my-0 sm:-my-1 text-[#d99f26]"
            style={{ fontFamily: '"Alex Brush", cursive' }}
          >
            &
          </p>
          <h1 
            className="text-2xl sm:text-3.5xl font-bold tracking-[0.2em] uppercase leading-tight text-[#c9961b] drop-shadow-xs"
            style={{ 
              fontFamily: '"Cinzel", "Cormorant Garamond", serif',
              backgroundImage: 'linear-gradient(135deg, #d99f26 0%, #e8bd56 50%, #ba8518 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            GABRIEL
          </h1>
        </div>
      </div>

      {/* BOTTOM DATE TEXT */}
      <div className="relative z-20 pb-4 sm:pb-6">
        <p 
          className="uppercase tracking-[0.18em] text-base sm:text-xl text-[#5E4233] font-bold"
          style={{ fontFamily: '"Montserrat", "Cinzel", sans-serif' }}
        >
          28 DE NOVIEMBRE 2026
        </p>
      </div>

    </div>
  );
}
